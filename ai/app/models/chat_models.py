from pydantic import BaseModel, AnyHttpUrl, Field
from typing import List, Optional

class MediaItem(BaseModel):
    type: str  # "image", "audio", or "video"
    url: AnyHttpUrl
    name: str

class ChatRequest(BaseModel):
    chatId: str
    message: str
    media: Optional[List[MediaItem]] = []
    
class ChatResponse(BaseModel):
    success: bool = True
    response: Optional[str] = None
    error: Optional[str] = None
    sentiment: Optional[float] = None
    sentiment_label: Optional[str] = None
    # //này là trả về giá trị cảm xúc này