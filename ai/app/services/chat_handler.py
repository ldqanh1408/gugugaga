import torch
from pathlib import Path
from app.models.chat_models import ChatRequest, MediaItem
from app.utils.media_loader import load_image, load_video_frames
from app.core.prompt_builder import PromptBuilder
from app.core.config import MODEL_NAME, settings
from app.utils.retrieval import save_media_caption
from app.utils.audio_processor import process_audio
from transformers import LlavaNextForConditionalGeneration
import logging

logger = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).resolve().parents[2]

# Cache for models to prevent reloading
_llava_model = None
_llava_processor = None

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

def _get_llava_model():
    """Lazy initialization of LLaVA model"""
    global _llava_model
    if _llava_model is None:
        try:
            model_path = _get_model_path()
            logger.info(f"Loading LLaVA model from: {model_path}")
            # Use trust_remote_code=True to handle different model architectures properly
            _llava_model = LlavaNextForConditionalGeneration.from_pretrained(
                model_path, 
                torch_dtype=torch.int8, 
                low_cpu_mem_usage=True,
                trust_remote_code=True  # This allows proper loading of LLaVA-Next-Video
            ).to("cuda")
        except Exception as e:
            logger.error(f"Error loading LLaVA model: {str(e)}")
            raise
    return _llava_model

def _get_prompt_builder():
    """Get prompt builder for the current model path"""
    model_path = _get_model_path()
    return PromptBuilder(model_path)

def process_image(media_item: MediaItem, message_context: str = "") -> str:
    """
    Process image and generate caption/description using LLaVA model
    
    Args:
        media_item: Media item containing image URL
        message_context: Optional message context
        
    Returns:
        Text description of the image
    """
    try:
        # Build a simplified chat request
        req = ChatRequest(
            chatId="temp", 
            message=message_context or "Describe this image in detail.",
            media=[media_item]
        )
        
        # Build prompt and prepare input
        builder = _get_prompt_builder()
        data = builder.build(req)
        proc = data["processor"]
        img = load_image(media_item.url)

        # Process with model
        device = "cuda" if CUDA_AVAILABLE else "cpu"
        inputs = proc(text=data["text"], images=img, return_tensors="pt").to(device)
        model = _get_llava_model()

        # Generate response
        out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        response = proc.decode(out[0][2:], skip_special_tokens=True)
        
        return f"Image analysis ({media_item.name}): {response}"
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return f"Image analysis ({media_item.name}): [Failed to analyze this image]"


def process_video(media_item: MediaItem, message_context: str = "") -> str:
    """
    Process video and generate caption/description using LLaVA model
    
    Args:
        media_item: Media item containing video URL
        message_context: Optional message context
        
    Returns:
        Text description of the video
    """
    try:
        # Build a simplified chat request
        req = ChatRequest(
            chatId="temp", 
            message=message_context or "Describe this video in detail.",
            media=[media_item]
        )
        
        # Build prompt and prepare input
        builder = _get_prompt_builder()
        data = builder.build(req)
        proc = data["processor"]
        clip = load_video_frames(media_item.url)

        # Process with model
        device = "cuda" if CUDA_AVAILABLE else "cpu"
        inputs = proc(text=data["text"], videos=clip, padding=True, return_tensors="pt").to(device)
        model = _get_llava_model()

        # Generate response
        out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        response = proc.decode(out[0][2:], skip_special_tokens=True)
        
        return f"Video analysis ({media_item.name}): {response}"
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        return f"Video analysis ({media_item.name}): [Failed to analyze this video]"


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
            elif media_item.type == "video":
                result = process_video(media_item, req.message)
            elif media_item.type == "audio":
                result = process_audio(media_item)
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