from pydantic import BaseModel

class ChatRequest(BaseModel):
    chatId: str
    message: str