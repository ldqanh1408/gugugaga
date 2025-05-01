import os
import json
import logging
import time
from pathlib import Path
from typing import List, Dict, Union, Optional
from app.db.chromadb_client import chat_vectors

logger = logging.getLogger(__name__)

def get_audio_transcripts(chatId: str, limit: int = 10) -> List[Dict[str, Union[str, float]]]:
    """
    Retrieve audio transcripts for a specific chat
    
    Args:
        chatId: The chat ID to retrieve transcripts for
        limit: Maximum number of transcripts to retrieve
        
    Returns:
        List of transcript metadata with content
    """
    try:
        # Query ChromaDB for audio media entries
        results = chat_vectors.query(
            query_embeddings=None,
            where={"$and": [
                {"chatId": chatId},
                {"role": "media"},
                {"media_type": "audio"}
            ]},
            n_results=limit,
            include=["metadatas", "documents"]
        )
        
        transcripts = []
        
        if results and "metadatas" in results and results["metadatas"]:
            metadatas = results["metadatas"][0]
            documents = results["documents"][0]
            
            for i, metadata in enumerate(metadatas):
                if i < len(documents):
                    # Extract document content
                    doc_text = documents[i]
                    
                    # Create transcript entry
                    transcript = {
                        "timestamp": metadata.get("timestamp", 0),
                        "language": metadata.get("language", "unknown"),
                        "duration": metadata.get("duration", 0),
                        "file_path": metadata.get("file_path", ""),
                        "text": doc_text.replace(f"Media (audio): Transcription ", "", 1)
                    }
                    
                    transcripts.append(transcript)
        
        # Sort by timestamp (newest first)
        transcripts.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
        return transcripts
        
    except Exception as e:
        logger.error(f"Error retrieving audio transcripts: {str(e)}")
        return []

def get_transcript_by_id(transcript_id: str) -> Optional[Dict[str, Union[str, float]]]:
    """
    Retrieve specific transcript by ID
    
    Args:
        transcript_id: The ID of the transcript to retrieve
        
    Returns:
        Transcript data or None if not found
    """
    try:
        # Query ChromaDB for specific transcript
        results = chat_vectors.get(
            ids=[transcript_id],
            include=["metadatas", "documents"]
        )
        
        if results and "metadatas" in results and results["metadatas"]:
            metadata = results["metadatas"][0]
            document = results["documents"][0]
            
            # Check if file exists
            file_path = metadata.get("file_path", "")
            file_content = ""
            
            if file_path and os.path.exists(file_path):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        file_content = f.read()
                except Exception as e:
                    logger.error(f"Error reading transcript file: {str(e)}")
            
            return {
                "id": transcript_id,
                "timestamp": metadata.get("timestamp", 0),
                "language": metadata.get("language", "unknown"),
                "duration": metadata.get("duration", 0),
                "text": file_content or document,
                "file_path": file_path
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Error retrieving transcript by ID: {str(e)}")
        return None

def export_transcript(transcript_id: str, format: str = "txt") -> Optional[str]:
    """
    Export a transcript to a specific format
    
    Args:
        transcript_id: The ID of the transcript to export
        format: Format to export (txt, json, srt)
        
    Returns:
        Path to exported file or None if failed
    """
    transcript = get_transcript_by_id(transcript_id)
    if not transcript:
        return None
    
    try:
        # Create exports directory if it doesn't exist
        export_dir = Path("./exports")
        export_dir.mkdir(exist_ok=True)
        
        timestamp = transcript.get("timestamp", int(time.time() * 1000))
        file_name = f"transcript_{timestamp}"
        
        if format == "txt":
            # Simple text export
            export_path = export_dir / f"{file_name}.txt"
            with open(export_path, "w", encoding="utf-8") as f:
                f.write(transcript.get("text", ""))
            
        elif format == "json":
            # JSON export with metadata
            export_path = export_dir / f"{file_name}.json"
            with open(export_path, "w", encoding="utf-8") as f:
                json.dump(transcript, f, ensure_ascii=False, indent=2)
                
        elif format == "srt":
            # Convert to SRT format (simplified)
            export_path = export_dir / f"{file_name}.srt"
            
            # If transcript has segments, create SRT file
            segments = transcript.get("segments", [])
            if segments:
                with open(export_path, "w", encoding="utf-8") as f:
                    for i, segment in enumerate(segments):
                        start_time = _format_srt_time(segment.get("start", 0))
                        end_time = _format_srt_time(segment.get("end", 0))
                        text = segment.get("text", "")
                        
                        f.write(f"{i+1}\n")
                        f.write(f"{start_time} --> {end_time}\n")
                        f.write(f"{text}\n\n")
            else:
                # No segments, create basic SRT with whole text
                with open(export_path, "w", encoding="utf-8") as f:
                    f.write("1\n")
                    f.write("00:00:00,000 --> 00:10:00,000\n")
                    f.write(transcript.get("text", ""))
        else:
            logger.error(f"Unsupported export format: {format}")
            return None
            
        return str(export_path)
        
    except Exception as e:
        logger.error(f"Error exporting transcript: {str(e)}")
        return None

def _format_srt_time(seconds: float) -> str:
    """Format time for SRT files"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = seconds % 60
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{int(seconds):02d},{milliseconds:03d}"