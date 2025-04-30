import re
from fastapi import APIRouter, HTTPException
from app.models.chat_models import ChatRequest
from app.services.llama_service import call_llama
from app.utils.retrieval import save_message, create_prompt
from app.services.chat_handler import handle_chat_request

router = APIRouter()

@router.post("/api/chats/ai")
async def chat_api(req: ChatRequest):
    # pre_prompt = handle_chat_request(req)
    prompt = create_prompt(req.chatId, req.message)
    try:
        reply = call_llama(prompt)
        save_message(req.chatId, req.message, reply)
        cleaned = re.sub(r'\n\s*\n+', '\n', reply)
        return {"response": cleaned}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))