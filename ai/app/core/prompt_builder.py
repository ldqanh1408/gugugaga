from transformers import LlavaNextProcessor
from typing import Dict
from app.models.chat_models import ChatRequest

class PromptBuilder:
    def __init__(self, model_id: str):
        self.processor = LlavaNextProcessor.from_pretrained(model_id)

    def build(self, req: ChatRequest) -> Dict:
        content = [{"type": "text", "text": req.message}]
        for media in req.media:
            content.append({"type": media.type})
        conversation = [{"role": "user", "content": content}]
        prompt = self.processor.apply_chat_template(
            conversation, add_generation_prompt=True
        )
        return {"text": prompt, "processor": self.processor}