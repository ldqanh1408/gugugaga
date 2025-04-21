import time
import re
from app.db.chromadb_client import chat_vectors
from app.services.embedding_service import get_embedding

# Lưu message vào ChromaDB

def save_message(chatId: str, user_message: str, ai_response: str) -> None:
    timestamp = int(time.time() * 1000)
    for role, text in [("user", f"User: {user_message}"), ("ai", f"Bot: {ai_response}")]:
        emb = get_embedding(text)
        chat_vectors.add(
            ids=[f"{chatId}-{role}-{timestamp}"],
            embeddings=[emb],
            documents=[text],
            metadatas=[{"chatId": chatId, "role": role, "timestamp": timestamp}]
        )

# Truy xuất context gần nhất

def retrieve_context(chatId: str, message: str, n_results: int = 5) -> str:
    emb = get_embedding(message)
    res = chat_vectors.query(
        query_embeddings=[emb],
        n_results=n_results*2,
        where={"$and": [{"chatId": chatId}, {"role": "user"}]}
    )
    texts = list(dict.fromkeys(res.get("documents", [[]])[0]))
    return "\n".join(texts[-n_results:])

# Tạo prompt đầy đủ

def create_prompt(chatId: str, message: str) -> str:
    # Lấy context (tin nhắn trước đó) của người dùng từ cơ sở dữ liệu
    context = retrieve_context(chatId, message)

    # Xây dựng nội dung system với hướng dẫn ban đầu
    system_prompt = (
        "🌟 You are an emotional support AI. Provide empathetic, constructive responses with lots of emojis. 🌟\n"
        "You must comply with the following rules:\n"
        "1. 💖 Always show empathy and emotional understanding **before** offering any advice or suggestions.\n"
        "2. 🔍 If the user asks about something personal, check history. If not found, say: 'I don’t know that yet 🥺 Could you tell me more?'\n"
        "3. 🎉 Use **lots of emojis** to keep your tone cheerful, comforting, and expressive.\n"
        "4. 🚫 Do **not** solve math, physics, or technical problems. Gently refuse and redirect to emotional support 🥹💗\n"
    )

    # Nếu có context, thêm vào sau phần hướng dẫn của system
    if context.strip():
        system_prompt += "\nPrevious user's messages (for context only):\n" + context.strip()

    final_prompt = (
        f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
        f"<|im_start|>user\n{message}<|im_end|>\n"
        f"<|im_start|>assistant"
    )

    return final_prompt