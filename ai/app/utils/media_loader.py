import requests
import numpy as np
import io
import logging
from PIL import Image
from pathlib import Path
from typing import Union
from pydantic import AnyHttpUrl

logger = logging.getLogger(__name__)

def load_image(url_or_path: Union[str, AnyHttpUrl]) -> Image.Image:
    """
    Load an image from URL or local path
    
    Args:
        url_or_path: URL or file path to the image
        
    Returns:
        PIL Image object
    """
    try:
        # Convert to string if it's an AnyHttpUrl object
        url_str = str(url_or_path)
        
        if url_str.startswith(('http://', 'https://')):
            logger.info(f"Loading image from URL: {url_str}")
            resp = requests.get(url_str, stream=True, timeout=10)
            resp.raise_for_status()
            return Image.open(io.BytesIO(resp.content))
        else:
            # Handle local file path
            path = Path(url_str)
            logger.info(f"Loading image from path: {path}")
            if not path.exists():
                raise FileNotFoundError(f"Image not found: {url_str}")
            return Image.open(path)
    except Exception as e:
        logger.error(f"Error loading image from {url_or_path}: {str(e)}")
        # Return a blank image instead of failing
        logger.info("Returning blank image as fallback")
        return Image.new('RGB', (224, 224), color='gray')

def resize_image(img: Image.Image, target_size: tuple = (224, 224)) -> Image.Image:
    """
    Resize an image to the target size while preserving aspect ratio
    
    Args:
        img: PIL Image to resize
        target_size: Target dimensions (width, height)
        
    Returns:
        Resized PIL Image
    """
    if img.size == target_size:
        return img
        
    # Calculate aspect ratios
    target_aspect = target_size[0] / target_size[1]
    img_aspect = img.width / img.height
    
    # Determine dimensions to resize to before cropping
    if img_aspect > target_aspect:
        # Image is wider than target
        new_height = target_size[1]
        new_width = int(new_height * img_aspect)
    else:
        # Image is taller than target
        new_width = target_size[0]
        new_height = int(new_width / img_aspect)
    
    # Resize image
    resized_img = img.resize((new_width, new_height), Image.LANCZOS)
    
    # Center crop to target size
    left = (new_width - target_size[0]) // 2
    top = (new_height - target_size[1]) // 2
    right = left + target_size[0]
    bottom = top + target_size[1]
    
    return resized_img.crop((left, top, right, bottom))