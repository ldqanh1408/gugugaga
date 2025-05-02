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
        # Initialize media context
        media_context = ""
        
        # Process media synchronously if present
        if req.media:
            try:
                logger.info(f"Processing {len(req.media)} media items for chat {req.chatId}")
                media_response = handle_chat_request(req)
                if media_response:
                    media_context = f"[Media you just shared: {media_response}]"
                    logger.info("Media processing successful")
            except Exception as e:
                logger.error(f"Media processing error: {str(e)}")
                media_context = "[Failed to fully process some media you shared]"
        
        # Create the prompt with available context from DB
        prompt = create_prompt(req.chatId, req.message)
        
        # Add immediate media context if we have it
        if media_context:
            # Add media context to the prompt
            prompt = prompt.replace("<|im_start|>user\n", f"<|im_start|>user\n{media_context}\n")
            logger.info("Added media context to the prompt")
        
        # Get response from LLM
        logger.info("Calling LLM with combined context")
        reply = call_llama(prompt, max_tokens=512)  # Increased token limit to handle media context
        
        # Save the conversation to the database
        save_message(req.chatId, req.message, reply)
        
        # Clean up extra newlines for readability
        cleaned = re.sub(r'\n\s*\n+', '\n\n', reply)
        return {"response": cleaned}
    except Exception as e:
        logger.error(f"Error in chat API: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))