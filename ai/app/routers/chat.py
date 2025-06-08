import re
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.llama_service import call_llama
from app.utils.retrieval import save_message, create_prompt, save_media_caption
from app.services.chat_handler import process_all_media
from app.services.sentiment_service import analyze_sentiment
import logging
import traceback

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/api/chats/ai", response_model=ChatResponse)
async def chat_api(req: ChatRequest, background_tasks: BackgroundTasks):
    """
    Main API endpoint for chat processing
    
    Args:
        req: Chat request containing message and optional media
        background_tasks: FastAPI background tasks for async processing
        
    Returns:
        JSON response containing AI's reply and sentiment analysis
    """
    try:
        # Validate input
        if not req.chatId or not req.message.strip():
            raise HTTPException(status_code=400, detail="chatId and message are required")
        
        # Process media first if present
        media_context = ""
        if req.media:
            try:
                logger.info(f"Processing {len(req.media)} media items for chat {req.chatId}")
                # Process all media synchronously before generating a response
                media_context = process_all_media(req)
                logger.info(f"Media processed with context: {media_context[:100]}...")
            except Exception as e:
                logger.error(f"Media processing error: {str(e)}")
                media_context = "[Failed to process media. Continuing with chat...]"
        
        # Create the prompt with available context from DB and processed media
        prompt = create_prompt(req.chatId, req.message)
        
        # Add immediate media context if we have it
        if media_context:
            prompt += f"<|user|>\n[Media Analysis: {media_context}]</s>\n"
            # prompt += f"<|assistant|>\n"
            logger.info("Added media context to the prompt")
            
        prompt += f"<|assistant|>\n"
        print(prompt)
        # Get response from LLM
        logger.info("Calling LLM with combined context")
        try:
            reply = call_llama(prompt, max_tokens=512)
        except Exception as e:
            logger.error(f"LLM call failed: {str(e)}")
            raise HTTPException(status_code=503, detail="Service temporarily unavailable")
        
        # Clean up extra newlines for readability
        cleaned_reply = re.sub(r'\n\s*\n+', '\n\n', reply)
        
        # Analyze sentiment of user message
        sentiment_analysis = analyze_sentiment(req.message)
        logger.info(f"Sentiment analysis: {sentiment_analysis}")
        
        # Save message and media captions in background to not block response
        background_tasks.add_task(
            save_processed_data, 
            req.chatId, 
            req.message, 
            cleaned_reply, 
            media_context if media_context else None,
            sentiment_analysis
        )
        logger.info("Message and media saving scheduled in background")
        
        # Return standardized response format with sentiment data
        return {
            "success": True, 
            "response": cleaned_reply,
            "sentiment": sentiment_analysis["score"],
            "sentiment_label": sentiment_analysis["label"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat API: {str(e)}\n{traceback.format_exc()}")
        return {"success": False, "error": f"An unexpected error occurred: {str(e)}"}


async def save_processed_data(chatId: str, user_message: str, ai_reply: str, media_context: str = None, sentiment_data: dict = None):
    """
    Save messages and media context to database after processing
    
    Args:
        chatId: The chat ID
        user_message: The user's message
        ai_reply: The AI's response
        media_context: Media analysis context if available
        sentiment_data: Sentiment analysis results if available
    """
    try:
        # Save the chat messages
        save_message(chatId, user_message, ai_reply, sentiment_data)
        logger.info(f"Message saved for chat {chatId}")
        
        # If media was processed, save it as a separate entry
        if media_context:
            save_media_caption(chatId, "combined_media", media_context)
            logger.info(f"Media captions saved for chat {chatId}")
    except Exception as e:
        logger.error(f"Error saving processed data: {str(e)}")