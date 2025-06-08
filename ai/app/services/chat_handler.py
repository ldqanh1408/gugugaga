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

def _generate_image_caption(img):
    """
    Generate caption for an image using the BLIP model
    
    Args:
        img: PIL Image object
        
    Returns:
        str: Generated caption
    """
    try:
        # Get model and processor
        model, processor = _get_blip_model_and_processor()
        
        # Create a default prompt
        prompt = "a photo of"
        
        # Process image
        device = "cuda" if CUDA_AVAILABLE else "cpu"
        inputs = processor(img, prompt, return_tensors="pt").to(device)
        
        # Generate caption
        out = model.generate(**inputs, max_new_tokens=100)
        caption = processor.decode(out[0], skip_special_tokens=True)
        
        return caption
    except Exception as e:
        logger.error(f"Error generating image caption: {str(e)}")
        return "Could not generate a caption for this image"

def process_all_media(req):
    """
    Process all media items in a request
    
    Args:
        req: ChatRequest object containing message and media items
        
    Returns:
        str: Combined results of all media processing
    """
    if not req.media:
        return ""
    
    captions = []
    for media_item in req.media:
        try:
            if media_item.type == "image":
                # Load and process image
                img = load_image(media_item.url)
                caption = _generate_image_caption(img)
                captions.append(f"Image analysis ({media_item.name}): {caption}")
                save_media_caption(req.chatId, f"image-{media_item.name}", caption)
                
            elif media_item.type == "audio":
                # Process audio
                transcript = process_audio(media_item.url, media_item.name)
                if isinstance(transcript, dict) and "text" in transcript:
                    text = transcript["text"]
                else:
                    text = str(transcript)
                captions.append(f"Audio transcription ({media_item.name}): {text}")
                save_media_caption(req.chatId, f"audio-{media_item.name}", text)
            else:
                logger.warning(f"Unsupported media type: {media_item.type}")
                
        except Exception as e:
            logger.error(f"Error processing {media_item.type}: {str(e)}")
            captions.append(f"Failed to process {media_item.type} ({media_item.name})")
            
    return "\n\n".join(captions) if captions else ""

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