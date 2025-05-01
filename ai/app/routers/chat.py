import re
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.chat_models import ChatRequest
from app.services.llama_service import call_llama
from app.utils.retrieval import save_message, create_prompt, save_media_caption
from app.services.chat_handler import handle_chat_request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Function to process media in the background
async def process_media_background(req: ChatRequest):
    """
    Process media asynchronously in the background
    
    Args:
        req: Chat request containing media to process
    """
    try:
        if req.media:
            media_response = handle_chat_request(req)
            logger.info(f"Background media processing completed for chat {req.chatId}")
    except Exception as e:
        logger.error(f"Error processing media in background: {str(e)}")

@router.post("/api/chats/ai")
async def chat_api(req: ChatRequest, background_tasks: BackgroundTasks):
    """
    Main API endpoint for chat processing
    
    Args:
        req: Chat request containing message and optional media
        background_tasks: FastAPI background tasks for async processing
        
    Returns:
        JSON response containing AI's reply
    """
    try:
        # Initialize media context
        media_context = ""
        
        # Process media if present
        if req.media:
            try:
                # Process media synchronously to include in current response
                media_response = handle_chat_request(req)
                if media_response:
                    media_context = f"[Media you just shared: {media_response}]"
            except Exception as e:
                logger.error(f"Media processing error: {str(e)}")
                # Continue with text processing even if media fails
        
        # Create the prompt with available context from DB
        prompt = create_prompt(req.chatId, req.message)
        
        # Add immediate media context if we have it
        if media_context:
            prompt = prompt.replace("<|im_start|>user\n", f"<|im_start|>user\n{media_context}\n")
        
        # Get response from LLM
        reply = call_llama(prompt)
        
        # Save the conversation
        save_message(req.chatId, req.message, reply)
        
        # Clean up extra newlines for readability
        cleaned = re.sub(r'\n\s*\n+', '\n\n', reply)
        return {"response": cleaned}
    except Exception as e:
        logger.error(f"Error in chat API: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))