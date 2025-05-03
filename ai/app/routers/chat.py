import re
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.llama_service import call_llama
from app.utils.retrieval import save_message, create_prompt, save_media_caption
from app.services.chat_handler import handle_chat_request
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
        JSON response containing AI's reply
    """
    try:
        # Validate input
        if not req.chatId or not req.message.strip():
            raise HTTPException(status_code=400, detail="chatId and message are required")
            
        # Initialize media context
        media_context = ""
        media_processing = False
        
        # Process media if present
        if req.media:
            try:
                logger.info(f"Processing {len(req.media)} media items for chat {req.chatId}")
                media_processing = True
                # Add an indicator to the context
                media_context = "[Media processing in background. Your chat continues...]"
            except Exception as e:
                logger.error(f"Media processing error: {str(e)}")
                media_context = "[Failed to process media. Continuing with chat...]"
        
        # Create the prompt with available context from DB
        try:
            prompt = create_prompt(req.chatId, req.message)
            
            # Add immediate media context if we have it
            if media_context:
                prompt += f"<|im_start|>user\n{media_context}<|im_end|>\n"
                prompt += f"<|im_start|>assistant\n"
                
                logger.info("Added media context to the prompt")
        except Exception as e:
            logger.error(f"Error creating prompt: {str(e)}")
            # Use a simple prompt if creation fails
            prompt += f"<|im_start|>assistant\n"
        
        # Get response from LLM
        logger.info("Calling LLM with combined context")
        try:
            reply = call_llama(prompt, max_tokens=512)
        except Exception as e:
            logger.error(f"LLM call failed: {str(e)}")
            raise HTTPException(status_code=503, detail="Service temporarily unavailable")
        
        # Clean up extra newlines for readability
        cleaned_reply = re.sub(r'\n\s*\n+', '\n\n', reply)
        
        # If media processing is needed, handle it in the background and save message there
        if media_processing:
            # Pass message saving to the background task along with media processing
            background_tasks.add_task(
                process_media_and_save_message, 
                req, 
                cleaned_reply
            )
            logger.info("Media processing and message saving scheduled in background")
        else:
            # No media to process, save message immediately
            try:
                save_message(req.chatId, req.message, cleaned_reply)
                logger.info("Message saved to database")
            except Exception as e:
                logger.error(f"Failed to save message: {str(e)}")
                # Continue even if save fails
        
        # Return standardized response format
        return {"success": True, "response": cleaned_reply}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat API: {str(e)}\n{traceback.format_exc()}")
        return {"success": False, "error": f"An unexpected error occurred: {str(e)}"}


async def process_media_and_save_message(req: ChatRequest, ai_reply: str):
    """
    Process media items and save messages after processing is complete
    
    Args:
        req: The chat request containing message and media
        ai_reply: The AI's response to save
    """
    try:
        # Process all media from the request
        media_result = handle_chat_request(req)
        logger.info(f"Media processing completed for chat {req.chatId}")
        
        # Now that media is processed, save the message
        try:
            save_message(req.chatId, req.message, ai_reply)
            logger.info(f"Message saved after media processing for chat {req.chatId}")
        except Exception as save_err:
            logger.error(f"Failed to save message after media processing: {str(save_err)}")
        
        return media_result
    except Exception as e:
        logger.error(f"Error in background media processing: {str(e)}\n{traceback.format_exc()}")
        # Still try to save the message even if media processing failed
        try:
            save_message(req.chatId, req.message, ai_reply)
            logger.info("Message saved despite media processing failure")
        except Exception as save_err:
            logger.error(f"Failed to save message after media error: {str(save_err)}")