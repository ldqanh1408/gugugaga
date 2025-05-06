import torch
from pathlib import Path
from app.models.chat_models import ChatRequest, MediaItem
from app.utils.media_loader import load_image
from app.core.prompt_builder import PromptBuilder
from app.core.config import MODEL_NAME, settings
from app.utils.retrieval import save_media_caption
from app.utils.audio_processor import process_audio
from transformers import BlipProcessor, BlipForConditionalGeneration
import logging

logger = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).resolve().parents[2]

# Cache for models to prevent reloading
_blip_model = None
_blip_processor = None

# Check if CUDA is available
CUDA_AVAILABLE = torch.cuda.is_available()
if CUDA_AVAILABLE:
    logger.info("CUDA is available, using GPU for inference")
else:
    logger.warning("CUDA is not available, falling back to CPU (this will be much slower)")

def _get_model_path() -> str:
    """Get the appropriate model path, checking local directory first"""
    local_dir = ROOT_DIR / MODEL_NAME
    return str(local_dir) if local_dir.exists() else settings.MODEL_IMAGE_PATH

def _get_blip_model_and_processor():
    """Lazy initialization of BLIP model and processor"""
    global _blip_model, _blip_processor
    if _blip_model is None or _blip_processor is None:
        try:
            model_path = _get_model_path()
            logger.info(f"Loading BLIP model from: {model_path}")
            
            _blip_processor = BlipProcessor.from_pretrained(model_path)
            _blip_model = BlipForConditionalGeneration.from_pretrained(model_path)
            
            # Move model to GPU if available
            if CUDA_AVAILABLE:
                _blip_model = _blip_model.to("cuda")
                
            logger.info("BLIP model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading BLIP model: {str(e)}")
            raise
    return _blip_model, _blip_processor

def process_image(media_item: MediaItem, message_context: str = "") -> str:
    """
    Process image and generate caption/description using BLIP model
    
    Args:
        media_item: Media item containing image URL
        message_context: Optional message context
        
    Returns:
        Text description of the image
    """
    try:
        # Load image
        img = load_image(media_item.url)
        
        # Get model and processor
        model, processor = _get_blip_model_and_processor()
        
        # Create prompt based on user message or use default
        prompt = message_context if message_context else "a photo of"
        
        # Process image
        device = "cuda" if CUDA_AVAILABLE else "cpu"
        inputs = processor(img, prompt, return_tensors="pt").to(device)
        
        # Generate caption
        out = model.generate(**inputs, max_new_tokens=100)
        caption = processor.decode(out[0], skip_special_tokens=True)
        
        return f"Image analysis ({media_item.name}): {caption}"
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return f"Image analysis ({media_item.name}): [Failed to analyze this image]"

def process_audio(media_item: MediaItem) -> str:
    """
    Process audio and generate transcription
    
    Args:
        media_item: Media item containing audio URL
        
    Returns:
        Text transcription of the audio
    """
    try:
        # Process audio using the audio processor
        result = process_audio(media_item.url)
        
        # Extract transcription text
        transcription = result.get("text", "")
        language = result.get("language", "unknown")
        
        # Format the response with some metadata
        return f"Audio transcription ({media_item.name}, {language}): {transcription}"
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return f"Audio transcription ({media_item.name}): [Failed to transcribe audio]"

def process_all_media(req: ChatRequest) -> str:
    """
    Process all media items in the request and return combined context
    
    Args:
        req: Chat request with message and media items
        
    Returns:
        Combined results of all media processing
    """
    if not req.media:
        return ""
    
    media_results = []
    
    for media_item in req.media:
        try:
            if media_item.type == "image":
                result = process_image(media_item, req.message)
            elif media_item.type == "audio":
                # Pass the URL string and name explicitly
                audio_result = process_audio(str(media_item.url), media_item.name)
                # Format the audio transcription result
                result = f"Audio transcription ({audio_result.get('audio_name', 'unknown')}): {audio_result.get('text', '[Failed to transcribe audio]')}"
            else:
                logger.warning(f"Unsupported media type: {media_item.type}")
                continue
                
            media_results.append(result)
        except Exception as e:
            logger.error(f"Error processing {media_item.type}: {str(e)}")
            media_results.append(f"Failed to process {media_item.type} ({media_item.name})")
    
    return "\n\n".join(media_results) if media_results else ""

# Keep backward compatibility for handle_chat_request
def handle_chat_request(req: ChatRequest) -> str:
    """
    Legacy function for backward compatibility
    
    Args:
        req: Chat request with message and media items
        
    Returns:
        Combined results of all media processing
    """
    return process_all_media(req)