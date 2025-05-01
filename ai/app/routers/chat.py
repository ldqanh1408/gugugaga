import re
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.chat_models import ChatRequest
from app.services.llama_service import call_llama
from app.utils.retrieval import save_message, create_prompt, save_media_caption
from app.services.chat_handler import handle_chat_request

router = APIRouter()

# Function to process media in the background
async def process_media_background(req: ChatRequest):
    try:
        if req.media:
            media_response = handle_chat_request(req)
            # No need to return anything as we're saving directly to DB
    except Exception as e:
        print(f"Error processing media in background: {str(e)}")

@router.post("/api/chats/ai")
async def chat_api(req: ChatRequest, background_tasks: BackgroundTasks):
    try:
        # Process media if present (synchronously for now)
        media_context = ""
        if req.media:
            try:
                media_response = handle_chat_request(req)
                if media_response:
                    media_context = f"[Media you just shared: {media_response}]"
                # Note: media captions are already saved in handle_chat_request
            except Exception as e:
                print(f"Warning: Media processing error: {str(e)}")
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
        
        # Clean up extra newlines
        cleaned = re.sub(r'\n\s*\n+', '\n', reply)
        return {"response": cleaned}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))