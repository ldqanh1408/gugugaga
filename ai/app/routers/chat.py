import re
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.chat_models import ChatRequest
from app.services.llama_service import call_llama
from app.utils.retrieval import save_message, create_prompt, save_media_caption
from app.services.chat_handler import handle_chat_request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

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
        # Validate input
        if not req.chatId or not req.message.strip():
            raise HTTPException(status_code=400, detail="chatId and message are required")
            
        # Initialize media context
        media_context = ""
        
        # Process media asynchronously if present
        if req.media:
            try:
                logger.info(f"Processing {len(req.media)} media items for chat {req.chatId}")
                # Offload media processing to background task
                background_tasks.add_task(handle_chat_request, req)
                media_context = "[Media processing in background. Your chat continues...]"
                logger.info("Media processing started in background")
            except Exception as e:
                logger.error(f"Media processing error: {str(e)}")
                media_context = "[Failed to process media. Continuing with chat...]"
        
        # Create the prompt with available context from DB
        prompt = create_prompt(req.chatId, req.message)
        
        # Add immediate media context if we have it
        if media_context:
            prompt = prompt.replace("<|im_start|>user\n", f"<|im_start|>user\n{media_context}\n")
            logger.info("Added media context to the prompt")
        
        # Get response from LLM
        logger.info("Calling LLM with combined context")
        try:
            reply = call_llama(prompt, max_tokens=512)
        except Exception as e:
            logger.error(f"LLM call failed: {str(e)}")
            raise HTTPException(status_code=503, detail="Service temporarily unavailable")
        
        # Save the conversation to the database
        try:
            save_message(req.chatId, req.message, reply)
        except Exception as e:
            logger.error(f"Failed to save message: {str(e)}")
            # Continue even if save fails
            
        # Clean up extra newlines for readability
        cleaned = re.sub(r'\n\s*\n+', '\n\n', reply)
        return {"response": cleaned}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat API: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")