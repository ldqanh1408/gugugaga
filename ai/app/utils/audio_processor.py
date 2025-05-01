import os
import time
import tempfile
import requests
import logging
import numpy as np
from pathlib import Path
from typing import Dict, Union, Tuple, List
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

# Initialize the Whisper model - optimized for RTX 4050
_whisper_model = None

def get_whisper_model() -> WhisperModel:
    """
    Lazy-load the Whisper model with settings optimized for RTX 4050
    """
    global _whisper_model
    if _whisper_model is None:
        try:
            # Model size options: "tiny", "base", "small", "medium", "large-v1", "large-v2", "large-v3"
            # Choose "medium" for a good balance of accuracy and performance on RTX 4050
            model_size = "medium"
            
            # RTX 4050 has 6GB VRAM, so we'll use mixed precision to optimize memory usage
            _whisper_model = WhisperModel(
                model_size,
                device="cuda",
                compute_type="float16",  # Use float16 for better performance on RTX 4050
                cpu_threads=4,
                num_workers=2,           # Adjust based on CPU cores
            )
            logger.info(f"Loaded Faster Whisper {model_size} model")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {str(e)}")
            raise
    return _whisper_model

def download_audio(url: str) -> str:
    """
    Download audio from URL to a temporary file
    
    Args:
        url: URL of the audio file
        
    Returns:
        Path to the downloaded temporary file
    """
    try:
        if url.startswith(('http://', 'https://')):
            resp = requests.get(url, stream=True, timeout=30)
            resp.raise_for_status()
            
            # Create a temporary file with the appropriate extension
            # Try to determine extension from URL
            ext = os.path.splitext(url)[1]
            if not ext:
                ext = ".mp3"  # Default to mp3 if no extension
            
            temp_file = tempfile.NamedTemporaryFile(suffix=ext, delete=False)
            with open(temp_file.name, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return temp_file.name
        else:
            # Handle local file path
            path = Path(url)
            if not path.exists():
                raise FileNotFoundError(f"Audio file not found: {url}")
            return str(path)
    except Exception as e:
        logger.error(f"Error downloading audio from {url}: {str(e)}")
        raise

def transcribe_audio(file_path: str) -> Dict[str, Union[str, float]]:
    """
    Transcribe audio file using Faster Whisper
    
    Args:
        file_path: Path to the audio file
        
    Returns:
        Dictionary with transcription text and metadata
    """
    try:
        model = get_whisper_model()
        
        # Run the transcription
        segments, info = model.transcribe(
            file_path,
            beam_size=5,
            language="auto",  # Auto-detect language
            vad_filter=True,  # Voice activity detection to skip silence
            vad_parameters=dict(min_silence_duration_ms=500),  # Adjust silence threshold
            initial_prompt=None,  # Can provide context here if needed
        )
        
        # Collect transcription segments
        transcript = ""
        segments_data = []
        
        for segment in segments:
            transcript += segment.text + " "
            segments_data.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text,
                "confidence": float(segment.avg_logprob),
            })
        
        # Clean up temporary file if it was created
        if os.path.exists(file_path) and file_path.startswith(tempfile.gettempdir()):
            os.unlink(file_path)
        
        return {
            "text": transcript.strip(),
            "language": info.language,
            "language_probability": float(info.language_probability),
            "segments": segments_data,
            "duration": info.duration
        }
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        # Clean up temporary file if it exists
        if os.path.exists(file_path) and file_path.startswith(tempfile.gettempdir()):
            os.unlink(file_path)
        raise

def process_audio(url: str) -> Dict[str, Union[str, float]]:
    """
    Process audio from URL and return transcription
    
    Args:
        url: URL or file path to the audio
        
    Returns:
        Dictionary with transcription text and metadata
    """
    try:
        # Download or locate the audio file
        file_path = download_audio(url)
        
        # Transcribe the audio file
        result = transcribe_audio(file_path)
        
        # Save the full transcript text to a file
        try:
            # Create a filename based on timestamp
            timestamp = int(time.time())
            file_name = f"audio_transcript_{timestamp}.txt"
            file_dir = Path("./audio_transcripts")
            file_dir.mkdir(exist_ok=True)
            
            # Write transcript to file
            with open(file_dir / file_name, "w", encoding="utf-8") as f:
                f.write(result["text"])
                
            # Add file path to result
            result["file_path"] = str(file_dir / file_name)
            logger.info(f"Saved transcript to {file_dir / file_name}")
        except Exception as e:
            logger.warning(f"Could not save transcript to file: {str(e)}")
        
        return result
    except Exception as e:
        logger.error(f"Error processing audio from {url}: {str(e)}")
        return {
            "text": f"Failed to process audio: {str(e)}",
            "error": str(e)
        }