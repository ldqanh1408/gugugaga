from pydantic import BaseModel, HttpUrl
from typing import Literal, List


class MediaItem(BaseModel):
    type: Literal["image", "video", "audio"]
    url: HttpUrl
    name: str

class ChatRequest(BaseModel):
    chatId: str
    message: str
    media: List[MediaItem]