from transformers import LlavaNextProcessor
from typing import Dict, Any, List
from app.models.chat_models import ChatRequest, MediaItem
import logging

logger = logging.getLogger(__name__)

class PromptBuilder:
    """
    Creates and formats prompts for multimodal models like LLaVA-Next
    """
    
    def __init__(self, model_id: str, trust_remote_code: bool = False):
        """
        Initialize the prompt builder with the specified model ID
        
        Args:
            model_id: Path or HuggingFace ID for the LLaVA model
            trust_remote_code: Whether to trust custom code in the model repo
        """
        logger.info(f"Initializing PromptBuilder with model: {model_id}")
        try:
            self.processor = LlavaNextProcessor.from_pretrained(
                model_id,
                trust_remote_code=trust_remote_code
            )
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
            # Audio doesn't have direct support in LLaVA, but we'll process it separately
            # and include the transcription in the text context
        
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
            
    def build_with_transcription(self, req: ChatRequest, transcription: str) -> Dict[str, Any]:
        """
        Build a prompt that includes audio transcription along with other media
        
        Args:
            req: The chat request containing message and media
            transcription: Text transcription of audio content
            
        Returns:
            Dict containing the processed text and processor object
        """
        # Add transcription to the user's message
        enhanced_message = f"{req.message}\n[Audio Transcription: {transcription}]"
        
        # Create enhanced request with transcription included in the message
        enhanced_req = ChatRequest(
            chatId=req.chatId,
            message=enhanced_message,
            # Filter out audio media since we've included it as text
            media=[m for m in req.media if m.type != "audio"]
        )
        
        # Use standard build method with enhanced request
        return self.build(enhanced_req)