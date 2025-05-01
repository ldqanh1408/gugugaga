from transformers import LlavaNextProcessor
from typing import Dict, Any
from app.models.chat_models import ChatRequest
import logging

logger = logging.getLogger(__name__)

class PromptBuilder:
    """
    Creates and formats prompts for multimodal models like LLaVA-Next
    """
    
    def __init__(self, model_id: str):
        """
        Initialize the prompt builder with the specified model ID
        
        Args:
            model_id: Path or HuggingFace ID for the LLaVA model
        """
        logger.info(f"Initializing PromptBuilder with model: {model_id}")
        try:
            self.processor = LlavaNextProcessor.from_pretrained(model_id)
            logger.info(f"Successfully loaded processor from {model_id}")
        except Exception as e:
            logger.error(f"Failed to load processor: {str(e)}")
            raise

    def build(self, req: ChatRequest) -> Dict[str, Any]:
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
        try:
            prompt = self.processor.apply_chat_template(
                conversation, add_generation_prompt=True
            )
            
            return {"text": prompt, "processor": self.processor}
        except Exception as e:
            logger.error(f"Error building prompt: {str(e)}")
            # Fallback to simple prompt
            return {
                "text": f"<image>\n{prompt_text}", 
                "processor": self.processor
            }