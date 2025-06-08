import time
from app.db.chromadb_client import chat_vectors
from app.services.embedding_service import get_embedding
import logging

logger = logging.getLogger(__name__)

def save_message(chatId: str, user_message: str, ai_response: str, sentiment_data: dict = None) -> None:
    """
    Save user message and AI response to ChromaDB with embeddings
    
    Args:
        chatId: Unique identifier for the chat session
        user_message: User's input message 
        ai_response: AI's generated response
        sentiment_data: Optional sentiment analysis data
    """
    timestamp = int(time.time() * 1000)
    
    # Save user message
    user_metadata = {"chatId": chatId, "role": "user", "timestamp": timestamp}
    
    # Add sentiment data to metadata if available
    if sentiment_data and isinstance(sentiment_data, dict):
        user_metadata["sentiment_score"] = sentiment_data.get("score", 0.5)
        user_metadata["sentiment_label"] = sentiment_data.get("label", "neutral")
    
    user_text = f"User: {user_message}"
    user_emb = get_embedding(user_text)
    
    chat_vectors.add(
        ids=[f"{chatId}-user-{timestamp}"],
        embeddings=[user_emb],
        documents=[user_text],
        metadatas=[user_metadata]
    )
    
    # Save AI response
    ai_text = f"Bot: {ai_response}"
    ai_emb = get_embedding(ai_text)
    
    chat_vectors.add(
        ids=[f"{chatId}-ai-{timestamp}"],
        embeddings=[ai_emb],
        documents=[ai_text],
        metadatas=[{"chatId": chatId, "role": "ai", "timestamp": timestamp}]
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
    try:
        res = chat_vectors.query(
            query_embeddings=[emb],
            n_results=min(n_results*2, 20),  # Limit to reasonable number
            where={"chatId": chatId}
        )
        
        # Remove duplicates while preserving order
        if res and "documents" in res and res["documents"]:
            texts = list(dict.fromkeys(res.get("documents", [[]])[0]))
            return "\n".join(texts[-n_results:])
    except Exception as e:
        logger.warning(f"Error retrieving context: {str(e)}")
    
    return ""

def retrieve_media_context(chatId: str, n_results: int = 3) -> str:
    """
    Retrieve recent media context from the current chat session
    """
    try:
        # Use query to check if there are media records instead of count with where
        dummy_emb = get_embedding("media context")
        res = chat_vectors.query(
            query_embeddings=[dummy_emb],
            where={"$and": [
                {"chatId": chatId},
                {"role": "media"}
            ]},
            n_results=100,  # Use a large number that won't exceed your data
            include=["documents", "metadatas"]
        )
        
        # If no results, return empty string
        if not res["documents"] or not res["documents"][0]:
            return ""
            
        # Otherwise, return up to n_results documents
        return "\n".join(res["documents"][0][:n_results])
    except Exception as e:
        logger.warning(f"Error retrieving media context: {str(e)}")
    
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
    try:
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
            f"<|system|>\n{system_prompt}</s>\n"
            f"<|user|>\n{message}</s>\n"
        )
        return final_prompt
    
    except Exception as e:
        logger.error(f"Error creating prompt: {str(e)}")
        # Return a basic prompt if context retrieval fails
        return (
            f"<|system|>\n"
            f"🌟 You are an emotional support AI. Provide empathetic responses with emojis. 🌟\n"
            f"</s>\n"
            f"<|user|>\n{message}</s>\n"
        )