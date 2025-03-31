from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from pymongo import MongoClient
from bson import ObjectId
import chromadb
from sentence_transformers import SentenceTransformer
import time
import re

app = FastAPI(
    title="Chatbot API",
    description="API tích hợp MongoDB + ChromaDB và llama.cpp",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------------------
# 1. Kết nối MongoDB
# ---------------------------
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "Diary"

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
chats_collection = db["chats"]

# ---------------------------
# 2. Kết nối ChromaDB
# ---------------------------
chroma_client = chromadb.PersistentClient(path="./chromadb_store")
chat_vectors = chroma_client.get_or_create_collection(name="chat_embeddings")

# ---------------------------
# 3. Tải model embedding
# ---------------------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str):
    return embedding_model.encode(text).tolist()

# ---------------------------
# 4. Gọi API của llama.cpp
# ---------------------------
LLAMA_API_URL = "http://127.0.0.1:8090/completion"

def call_llama(prompt: str) -> str:
    payload = {
        "prompt": prompt,
        "n_predict": 400,          # Số token dự đoán, có thể điều chỉnh nếu cần
        "temperature": 0.6,        # Giảm nhiệt độ để giảm tính ngẫu nhiên, phản hồi ổn định hơn
        "top_k": 40,               # Số lựa chọn từ phía trên, giữ nguyên nếu cần sự đa dạng vừa đủ
        "top_p": 0.95,             # Tăng top_p để cho phép một phạm vi từ rộng hơn, nhưng vẫn kiểm soát được sự đa dạng
        "repeat_last_n": 128,      # Giảm số token cuối để hạn chế lặp lại
        "repeat_penalty": 1.1,     # Tăng nhẹ repeat_penalty để hạn chế lặp lại
        "stream": False,
    }
    try:
        resp = requests.post(LLAMA_API_URL, json=payload, timeout=30)
        return resp.json().get("content", "No response")
    except Exception as e:
        print(f"Error calling llama.cpp: {e}")
        return "Error calling AI"

# ---------------------------
# 5. Model cho API request
# ---------------------------
class ChatRequest(BaseModel):
    chatId: str  # ID của cuộc chat (MongoDB)
    message: str  # Tin nhắn của user

# ---------------------------
# 6. Hàm xử lý hội thoại AI
# ---------------------------
def save_message(chatId, user_message, ai_response):
    """Lưu tin nhắn của user và phản hồi của AI riêng biệt vào ChromaDB."""
    timestamp = int(time.time() * 1000)
    
    # Lưu tin nhắn của user
    user_text = f"User: {user_message}"
    user_embedding = get_embedding(user_text)
    chat_vectors.add(
        ids=[f"{chatId}-user-{timestamp}"],
        embeddings=[user_embedding],
        documents=[user_text],
        metadatas=[{"chatId": chatId, "role": "user", "timestamp": timestamp}]
    )
    
    # Lưu tin nhắn của AI
    ai_text = f"Bot: {ai_response}"
    ai_embedding = get_embedding(ai_text)
    chat_vectors.add(
        ids=[f"{chatId}-ai-{timestamp}"],
        embeddings=[ai_embedding],
        documents=[ai_text],
        metadatas=[{"chatId": chatId, "role": "ai", "timestamp": timestamp}]
    )

def clean_response(response):
    # Loại bỏ dòng bắt đầu với "User:" hoặc "Bot:"
    cleaned = re.sub(r'^(User:|Bot:).*$', '', response, flags=re.MULTILINE)
    return cleaned.strip()

def retrieve_context(chatId, user_message, n_results=5):
    """
    Lấy n tin nhắn gần nhất của user từ ChromaDB để tạo bối cảnh hội thoại.
    Chỉ truy vấn các tin nhắn có metadata role là 'user'.
    Sau đó, loại bỏ các bản sao trùng lặp và chỉ lấy 5 tin nhắn gần nhất.
    """
    embedding = get_embedding(user_message)

    # Sử dụng toán tử $and để kết hợp điều kiện
    results = chat_vectors.query(
        query_embeddings=[embedding],
        n_results=n_results * 2,  # lấy nhiều hơn để đảm bảo sau lọc đủ 5 tin nhắn
        where={"$and": [{"chatId": chatId}, {"role": "user"}]}
    )
    
    related_texts = results.get("documents", [[]])[0] or []
    print("realated text: ")
    print(related_texts)
    # Loại bỏ các tin nhắn trùng lặp, giữ thứ tự ban đầu
    unique_texts = list(dict.fromkeys(related_texts))
    print("unique text: ")
    print(unique_texts)
    # Chỉ lấy 5 tin nhắn gần nhất (có thể cần sắp xếp lại nếu cần)
    context_lines = unique_texts[-n_results:]
    
    print("context lines: ")
    print(context_lines)
    return "\n".join(context_lines)

def create_prompt(chatId, user_message):
    """Tạo prompt hoàn chỉnh với ngữ cảnh hội thoại."""
    context = retrieve_context(chatId, user_message)  # Lấy 5 tin nhắn gần nhất của user từ ChromaDB
    
    system_prompt = (
        "🌟 You are an emotional support AI. Provide empathetic, constructive responses with lots of emojis. 🌟\n"
        "Rules:\n"
        "1. 💖 Show empathy before giving advice.\n"
        "2. 🔍 For personal info queries, check history; if missing, reply: 'I don’t know that yet. Could you tell me?'\n"
        "3. 🚫 Do not mention your lack of physical form unless asked.\n"
        "4. 🔄 Summarize past messages instead of repeating them.\n"
        "5. 🎉 Use as many emojis as possible in your responses.\n"
    )


    if context.strip():
        final_prompt = f"{system_prompt}\nPrevious user messages:\n{context}\nUser just said: {user_message}\nYou:"
    else:
        final_prompt = f"{system_prompt}\nUser just said: {user_message}\nYou:"

    
    return final_prompt

# ---------------------------
# 7. Endpoint: API chính của AI Chatbot
# ---------------------------
@app.post("/api/chats/ai")
def chat_api(req: ChatRequest):
    final_prompt = create_prompt(req.chatId, req.message)
    print("Prompt gửi đến llama.cpp:")
    print(final_prompt)
    
    ai_reply = call_llama(final_prompt)
    save_message(req.chatId, req.message, ai_reply)  # Lưu hội thoại vào DB
    print("Phản hồi từ AI:")
    print(ai_reply)
    # này nó phản hồi tận 2 lầ, mà trong khi t in print(..) có 1 , m coi thử coi coi cái API của nhật kí á, thường bị cái nhật kí
    # Xử lý loại bỏ dòng trống thừa
    ai_reply = re.sub(r'\n\s*\n+', '\n', ai_reply.strip())
    # ai_reply = clean_response(ai_reply)
    
    return {"response": ai_reply}

# ---------------------------
# 8. Chạy Server trên port 4000
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)
