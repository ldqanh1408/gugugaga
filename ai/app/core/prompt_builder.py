from typing import Dict, Any, List
from app.models.chat_models import ChatRequest, MediaItem
import logging

logger = logging.getLogger(__name__)

class PromptBuilder:
    """
    Creates and formats prompts for text-based models with optional media context
    """
    
    def __init__(self, model_id: str = None, trust_remote_code: bool = False):
        """
        Initialize the prompt builder
        
        Args:
            model_id: Path or HuggingFace ID for the model (not used for BLIP)
            trust_remote_code: Whether to trust custom code in the model repo
        """
        logger.info(f"Initializing simplified PromptBuilder")
        # No specific processor needed for our approach

    def build(self, req: ChatRequest) -> Dict[str, Any]:
        """
        Build a prompt from the chat request.
        
        Args:
            req: The chat request containing message and media
            
        Returns:
            Dict containing the processed text
        """
        # Create default prompt
        prompt_text = req.message or "Describe what you see in detail."
        
        # Format as conversation
        formatted_prompt = f"<|user|>\n{prompt_text}</s>\n<|assistant|>\n"
        
        return {"text": formatted_prompt}
            
    def build_with_transcription(self, req: ChatRequest, transcription: str) -> Dict[str, Any]:
        """
        Build a prompt that includes audio transcription
        
        Args:
            req: The chat request containing message and media
            transcription: Text transcription of audio content
            
        Returns:
            Dict containing the processed text
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