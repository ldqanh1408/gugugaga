from pydantic import BaseModel, AnyHttpUrl
from typing import List, Optional

class MediaItem(BaseModel):
    type: str  # "image" or "audio"
    url: AnyHttpUrl
    name: str

class ChatRequest(BaseModel):
    chatId: str
    message: str
    media: Optional[List[MediaItem]] = []