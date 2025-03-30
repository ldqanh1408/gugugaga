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

app = FastAPI(
    title="Chatbot API",
    description="API tích hợp MongoDB + ChromaDB và llama.cpp",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Hoặc thay "*" bằng ["http://localhost:3000"] nếu muốn giới hạn
    allow_credentials=True,
    allow_methods=["*"],          # Cho phép tất cả các method (GET, POST, PUT, DELETE, OPTIONS,...)
    allow_headers=["*"]           # Cho phép tất cả các header
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
# 4. Gọi API của llama.cpp (server chạy trên port 8080)
# ---------------------------
LLAMA_API_URL = "http://127.0.0.1:8080/completion"
def call_llama(prompt: str) -> str:
    payload = {
        "prompt": prompt,
        "n_predict": 500,          # Tăng số token để câu trả lời dài hơn
        "temperature": 0.5,        # Giảm bớt độ 'random', câu trả lời ổn định
        "top_k": 40,
        "top_p": 0.9,              # Tăng top_p để AI có thêm không gian chọn từ
        "repeat_last_n": 256,
        "repeat_penalty": 1.1,     # Giảm lặp lại từ so với 1.18
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
# 6. Endpoint: Tích hợp ChromaDB + llama.cpp
# ---------------------------
@app.post("/api/chats/ai")
def chat_api(req: ChatRequest):
    # Tạo embedding của tin nhắn user
    embedding = get_embedding(req.message)
    embed_id = f"{req.chatId}-user-{int(time.time()*1000)}"

    # Lưu tin nhắn vào ChromaDB
    chat_vectors.add(
        ids=[embed_id],
        embeddings=[embedding],
        documents=[req.message],
        metadatas=[{"chatId": req.chatId}]
    )

    # Truy vấn ChromaDB để lấy các tin nhắn liên quan
    results = chat_vectors.query(
        query_embeddings=[embedding],
        n_results=1
    )
    related_texts = results.get("documents", [[]])[0] or []
    # Nếu related_texts là danh sách rỗng thì related_prompt sẽ là chuỗi rỗng
    related_prompt = "\n".join(related_texts)

    final_prompt = related_prompt
    # # Tạo prompt cho llama.cpp với xử lý nếu related_prompt rỗng
    # if related_prompt.strip():
    #     final_prompt = f"{related_prompt}\nUser: {req.message}\nBot:"
    # else:
    #     final_prompt = f"User: {req.message}\nBot:"

    # Gọi llama.cpp để lấy phản hồi AI
    ai_reply = call_llama(final_prompt)

    return {"response": ai_reply}



# ---------------------------
# 7. Chạy Server trên port 4000
# ---------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)
