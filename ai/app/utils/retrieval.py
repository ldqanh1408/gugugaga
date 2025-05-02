import time
from app.db.chromadb_client import chat_vectors
from app.services.embedding_service import get_embedding

def save_message(chatId: str, user_message: str, ai_response: str) -> None:
    """
    Save user message and AI response to ChromaDB with embeddings
    
    Args:
        chatId: Unique identifier for the chat session
        user_message: User's input message 
        ai_response: AI's generated response
    """
    timestamp = int(time.time() * 1000)
    for role, text in [("user", f"User: {user_message}"), ("ai", f"Bot: {ai_response}")]:
        emb = get_embedding(text)
        chat_vectors.add(
            ids=[f"{chatId}-{role}-{timestamp}"],
            embeddings=[emb],
            documents=[text],
            metadatas=[{"chatId": chatId, "role": role, "timestamp": timestamp}]
        )

def save_media_caption(chatId: str, media_type: str, caption: str) -> None:
    """
    Save media caption/description to ChromaDB
    
    Args:
        chatId: Unique identifier for the chat session
        media_type: Type of media (image, video, etc.)
        caption: Generated caption or description
    """
    timestamp = int(time.time() * 1000)
    emb = get_embedding(caption)
    chat_vectors.add(
        ids=[f"{chatId}-media-{timestamp}"],
        embeddings=[emb],
        documents=[f"Media ({media_type}): {caption}"],
        metadatas=[{
            "chatId": chatId, 
            "role": "media", 
            "media_type": media_type, 
            "timestamp": timestamp
        }]
    )

def retrieve_context(chatId: str, message: str, n_results: int = 5) -> str:
    """
    Retrieve relevant context from previous messages
    
    Args:
        chatId: Unique identifier for the chat session
        message: Current user message to find relevant context for
        n_results: Number of previous messages to retrieve
        
    Returns:
        String containing context from previous messages
    """
    emb = get_embedding(message)
    res = chat_vectors.query(
        query_embeddings=[emb],
        n_results=n_results*2,
        where={"chatId": chatId}
    )
    
    # Remove duplicates while preserving order
    texts = list(dict.fromkeys(res.get("documents", [[]])[0]))
    return "\n".join(texts[-n_results:])

def retrieve_media_context(chatId: str, n_results: int = 3) -> str:
    """
    Retrieve recent media context from the current chat session
    
    Args:
        chatId: Unique identifier for the chat session
        n_results: Number of media items to retrieve
        
    Returns:
        String containing context from media captions/descriptions
    """
    res = chat_vectors.query(
        query_embeddings=None,  # No query embedding, just filter by metadata
        where={"$and": [
            {"chatId": chatId},
            {"role": "media"}
        ]},
        n_results=n_results,
        include=["documents", "metadatas"]
    )
    
    # Get the documents returned
    if res and "documents" in res and res["documents"]:
        return "\n".join(res["documents"][0])
    return ""

def create_prompt(chatId: str, message: str) -> str:
    """
    Create a complete prompt including system instructions and context
    
    Args:
        chatId: Unique identifier for the chat session
        message: Current user message
        
    Returns:
        Formatted prompt ready for the LLM
    """
    # Retrieve context from previous messages
    conversation_context = retrieve_context(chatId, message)
    
    # Retrieve recent media context
    media_context = retrieve_media_context(chatId)
    
    # Build system prompt with guidelines
    system_prompt = (
        "🌟 You are an emotional support AI. Provide empathetic, constructive responses with lots of emojis. 🌟\n"
        "You must comply with the following rules:\n"
        "1. 💖 Always show empathy and emotional understanding **before** offering any advice or suggestions.\n"
        "2. 🔍 If the user asks about something personal, check history. If not found, say: 'I don't know that yet 🥺 Could you tell me more?'\n"
        "3. 🎉 Use **lots of emojis** to keep your tone cheerful, comforting, and expressive.\n"
        "4. 🚫 Do **not** solve math, physics, or technical problems. Gently refuse and redirect to emotional support 🥹💗\n"
        "5. 👂 If the user shares media (images, videos, audio), respond to it and incorporate what you understand from it.\n"
    )

    # Add conversation context if available
    if conversation_context.strip():
        system_prompt += "\nPrevious messages (for context only):\n" + conversation_context.strip()

    # Add media context if available
    if media_context.strip():
        system_prompt += "\nPrevious media shared (for context only):\n" + media_context.strip()

    # Format the final prompt with special tokens
    final_prompt = (
        f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
        f"<|im_start|>user\n{message}<|im_end|>\n"
        f"<|im_start|>assistant"
    )

    return final_prompt