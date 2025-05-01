from transformers import LlavaNextProcessor
from typing import Dict
from app.models.chat_models import ChatRequest

class PromptBuilder:
    def __init__(self, model_id: str):
        """Initialize the prompt builder with the specified model ID"""
        self.processor = LlavaNextProcessor.from_pretrained(model_id)

    def build(self, req: ChatRequest) -> Dict:
        """
        Build a prompt for LLaVA-Next model from the chat request.
        
        Args:
            req: The chat request containing message and media
            
        Returns:
            Dict containing the processed text and processor object
        """
        # Create default prompt for media understanding
        prompt_text = req.message or "Describe what you see in detail."
        
        # Prepare media content
        content = [{"type": "text", "text": prompt_text}]
        
        # Add media items to the content
        for media in req.media:
            if media.type == "image":
                content.append({"type": "image"})
            elif media.type == "video":
                content.append({"type": "video"})
        
        # Format as conversation for the processor
        conversation = [{"role": "user", "content": content}]
        
        # Apply chat template
        prompt = self.processor.apply_chat_template(
            conversation, add_generation_prompt=True
        )
        
        return {"text": prompt, "processor": self.processor}