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
            _llava_model = LlavaNextForConditionalGeneration.from_pretrained(
                model_path, torch_dtype=torch.float16, low_cpu_mem_usage=True
            ).to("cuda")
        except Exception as e:
            logger.error(f"Error loading LLaVA model: {str(e)}")
            raise
    return _llava_model

def _get_prompt_builder():
    """Get prompt builder for the current model path"""
    model_path = _get_model_path()
    return PromptBuilder(model_path)

def handle_image_chat(req: ChatRequest) -> str:
    """
    Process image and generate caption/description using LLaVA model
    
    Args:
        req: Chat request containing image URL
        
    Returns:
        Text description of the image
    """
    try:
        # Validate media exists
        if not req.media or len(req.media) == 0:
            logger.error("No media provided for image handling")
            return "No image provided to analyze"
            
        # Build prompt and prepare input
        builder = _get_prompt_builder()
        data = builder.build(req)
        proc = data["processor"]
        img = load_image(req.media[0].url)

        # Process with model
        inputs = proc(text=data["text"], images=img, return_tensors="pt").to("cuda")
        model = _get_llava_model()

        # Generate response
        out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        response = proc.decode(out[0][2:], skip_special_tokens=True)
        
        # Save the image caption/description to ChromaDB
        save_media_caption(req.chatId, "image", response)
        
        return response
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        save_media_caption(req.chatId, "image", "Failed to process this image")
        return "I couldn't properly analyze this image 🥺"


def handle_video_chat(req: ChatRequest) -> str:
    """
    Process video and generate caption/description using LLaVA model
    
    Args:
        req: Chat request containing video URL
        
    Returns:
        Text description of the video
    """
    try:
        # Validate media exists
        if not req.media or len(req.media) == 0:
            logger.error("No media provided for video handling")
            return "No video provided to analyze"
            
        # Build prompt and prepare input
        builder = _get_prompt_builder()
        data = builder.build(req)
        proc = data["processor"]
        clip = load_video_frames(req.media[0].url)

        # Process with model
        inputs = proc(text=data["text"], videos=clip, padding=True, return_tensors="pt").to("cuda")
        model = _get_llava_model()

        # Generate response
        out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        response = proc.decode(out[0][2:], skip_special_tokens=True)
        
        # Save the video caption/description to ChromaDB
        save_media_caption(req.chatId, "video", response)
        
        return response
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        save_media_caption(req.chatId, "video", "Failed to process this video")
        return "I couldn't properly analyze this video 🥺"


def handle_audio_chat(req: ChatRequest) -> str:
    """
    Process audio and generate transcription
    
    Args:
        req: Chat request containing audio URL
        
    Returns:
        Text transcription of the audio
    """
    try:
        # Validate media exists
        if not req.media or len(req.media) == 0:
            logger.error("No media provided for audio handling")
            return "No audio provided to transcribe"
            
        # Process audio using the audio processor
        result = process_audio(req.media[0].url)
        
        # Extract transcription text
        transcription = result.get("text", "")
        language = result.get("language", "unknown")
        
        # Format the response with some metadata
        response = f"Transcription of audio ({language}): {transcription}"
        
        # Save the audio transcription to ChromaDB
        save_media_caption(req.chatId, "audio", response)
        
        return response
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        save_media_caption(req.chatId, "audio", "Failed to process this audio")
        return "I couldn't properly transcribe this audio 🥺"


def handle_mixed_chat(req: ChatRequest) -> str:
    """
    Process multiple media items (images, videos, and/or audio)
    
    Args:
        req: Chat request containing multiple media items
        
    Returns:
        Combined descriptions of all media items
    """
    replies = []
    # Process each media item one by one
    for index, media in enumerate(req.media):
        try:
            single_req = ChatRequest(
                chatId=req.chatId,
                message=f"{req.message} (media item {index+1})" if req.message else f"Describe this {media.type}",
                media=[media]
            )
            if media.type == "image":
                replies.append(handle_image_chat(single_req))
            elif media.type == "video":
                replies.append(handle_video_chat(single_req))
            elif media.type == "audio":
                replies.append(handle_audio_chat(single_req))
            else:
                logger.warning(f"Unsupported media type: {media.type}")
                continue
        except Exception as e:
            logger.error(f"Error processing media item {index}: {str(e)}")
            replies.append(f"Couldn't analyze media item {index+1}")
    
    # Combine all responses
    if replies:
        return "\n\n".join(replies)
    else:
        return "I couldn't process any of the media you shared 🥺"


def handle_chat_request(req: ChatRequest) -> str:
    """
    Main entry point for handling chat requests with media
    
    Args:
        req: Chat request with message and media items
        
    Returns:
        Generated description of media content
    """
    if not req.media:
        return ""
    
    types = {m.type for m in req.media}
    
    try:
        if len(req.media) == 1:
            if "image" in types:
                return handle_image_chat(req)
            elif "video" in types:
                return handle_video_chat(req)
            elif "audio" in types:
                return handle_audio_chat(req)
        else:
            # Multiple media items
            return handle_mixed_chat(req)
    except Exception as e:
        logger.error(f"Error in handle_chat_request: {str(e)}")
        return f"Error processing media: {str(e)}"