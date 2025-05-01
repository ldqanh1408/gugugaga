import torch
from pathlib import Path
from app.models.chat_models import ChatRequest, MediaItem
from app.utils.media_loader import load_image, load_video_frames
from app.core.prompt_builder import PromptBuilder
from app.core.config import MODEL_NAME
from app.utils.retrieval import save_media_caption
from transformers import LlavaNextForConditionalGeneration
import logging

logger = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).resolve().parents[2]

def _get_model_path() -> str:
    local_dir = ROOT_DIR / MODEL_NAME
    return str(local_dir) if local_dir.exists() else MODEL_NAME


def handle_image_chat(req: ChatRequest) -> str:
    """Process image and generate caption/description using LLaVA model"""
    try:
        model_path = _get_model_path()
        builder = PromptBuilder(model_path)
        data = builder.build(req)
        proc = data["processor"]
        img = load_image(req.media[0].url)

        inputs = proc(text=data["text"], images=img, return_tensors="pt").to("cuda")
        model = LlavaNextForConditionalGeneration.from_pretrained(
            model_path, torch_dtype=torch.float16, low_cpu_mem_usage=True
        ).to("cuda")

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
    """Process video and generate caption/description using LLaVA model"""
    try:
        model_path = _get_model_path()
        builder = PromptBuilder(model_path)
        data = builder.build(req)
        proc = data["processor"]
        clip = load_video_frames(req.media[0].url)

        inputs = proc(text=data["text"], videos=clip, padding=True, return_tensors="pt").to("cuda")
        model = LlavaNextForConditionalGeneration.from_pretrained(
            model_path, torch_dtype=torch.float16, low_cpu_mem_usage=True
        ).to("cuda")

        out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
        response = proc.decode(out[0][2:], skip_special_tokens=True)
        
        # Save the video caption/description to ChromaDB
        save_media_caption(req.chatId, "video", response)
        
        return response
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        save_media_caption(req.chatId, "video", "Failed to process this video")
        return "I couldn't properly analyze this video 🥺"


def handle_mixed_chat(req: ChatRequest) -> str:
    """Process multiple media items (images and/or videos)"""
    replies = []
    # Process each media item one by one
    for index, media in enumerate(req.media):
        try:
            single_req = ChatRequest(
                chatId=req.chatId,
                message=f"{req.message} (media item {index+1})",
                media=[media]
            )
            if media.type == "image":
                replies.append(handle_image_chat(single_req))
            elif media.type == "video":
                replies.append(handle_video_chat(single_req))
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
    """Main entry point for handling chat requests with media"""
    if not req.media:
        return ""
    
    types = {m.type for m in req.media}
    
    if len(req.media) == 1:
        if "image" in types:
            return handle_image_chat(req)
        elif "video" in types:
            return handle_video_chat(req)
    else:
        # Multiple media items
        return handle_mixed_chat(req)