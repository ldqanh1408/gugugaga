import requests
import av
import numpy as np
import io
import logging
from PIL import Image
from pathlib import Path
from typing import Union, List

logger = logging.getLogger(__name__)

def load_image(url_or_path: str) -> Image.Image:
    """
    Load an image from URL or local path
    
    Args:
        url_or_path: URL or file path to the image
        
    Returns:
        PIL Image object
    """
    try:
        if url_or_path.startswith(('http://', 'https://')):
            resp = requests.get(url_or_path, stream=True, timeout=10)
            resp.raise_for_status()
            return Image.open(io.BytesIO(resp.content))
        else:
            # Handle local file path
            path = Path(url_or_path)
            if not path.exists():
                raise FileNotFoundError(f"Image not found: {url_or_path}")
            return Image.open(path)
    except Exception as e:
        logger.error(f"Error loading image from {url_or_path}: {str(e)}")
        # Return a blank image instead of failing
        return Image.new('RGB', (224, 224), color='gray')


def load_video_frames(path_or_url: str, num_frames: int = 8) -> np.ndarray:
    """
    Load frames from a video file or URL
    
    Args:
        path_or_url: URL or file path to the video
        num_frames: Number of frames to extract
        
    Returns:
        Numpy array of video frames with shape (num_frames, height, width, 3)
    """
    try:
        if path_or_url.startswith(('http://', 'https://')):
            resp = requests.get(path_or_url, stream=True, timeout=30)
            resp.raise_for_status()
            container = av.open(io.BytesIO(resp.content))
        else:
            # Handle local file path
            path = Path(path_or_url)
            if not path.exists():
                raise FileNotFoundError(f"Video not found: {path_or_url}")
            container = av.open(str(path))

        # Get video stream and total frames
        video_stream = container.streams.video[0]
        total_frames = video_stream.frames
        
        # Handle videos with unknown number of frames
        if total_frames == 0:
            # Try to estimate duration
            if video_stream.duration:
                fps = video_stream.average_rate
                total_frames = int(video_stream.duration * fps / video_stream.time_base.denominator)
            else:
                # Just use a reasonable default
                total_frames = 100
        
        # Calculate frame indices to extract
        if total_frames <= num_frames:
            # If video has fewer frames than requested, use all frames
            indices = list(range(total_frames))
        else:
            # Sample evenly spaced frames
            indices = np.linspace(0, total_frames - 1, num_frames, dtype=int).tolist()
        
        frames = []
        frame_idx = 0
        
        # Set some reasonable limits
        max_attempts = min(1000, total_frames * 2)
        attempts = 0
        
        for packet in container.demux(video=0):
            for frame in packet.decode():
                if attempts > max_attempts:
                    break
                    
                attempts += 1
                if frame_idx in indices:
                    # Convert to RGB and add to frames list
                    frames.append(frame.to_ndarray(format="rgb24"))
                
                frame_idx += 1
                
                # Exit loop once we have enough frames
                if len(frames) >= num_frames or frame_idx >= total_frames:
                    break
            
            if len(frames) >= num_frames or attempts > max_attempts:
                break
        
        # If we couldn't get enough frames, duplicate the last one
        while len(frames) < num_frames and frames:
            frames.append(frames[-1])
            
        # If we got no frames at all, create dummy frames
        if not frames:
            dummy_frame = np.zeros((224, 224, 3), dtype=np.uint8)
            frames = [dummy_frame] * num_frames
            
        return np.stack(frames)
        
    except Exception as e:
        logger.error(f"Error loading video from {path_or_url}: {str(e)}")
        # Return dummy frames instead of failing
        dummy_frame = np.zeros((224, 224, 3), dtype=np.uint8)
        return np.stack([dummy_frame] * num_frames)