from sentence_transformers import SentenceTransformer 
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Lazy loading of embedding model
_embed_model = None

def _get_embed_model():
    """
    Lazy initialization of the embedding model
    
    Returns:
        Initialized SentenceTransformer model
    """
    global _embed_model
    if _embed_model is None:
        try:
            logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL_NAME}")
            _embed_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading embedding model: {str(e)}")
            raise
    return _embed_model

def get_embedding(text: str) -> list[float]:
    """
    Generate embeddings for text using SentenceTransformer
    
    Args:
        text: Input text to embed
        
    Returns:
        List of embedding values as floats
    """
    if not text or not text.strip():
        logger.warning("Empty text provided for embedding")
        # Return zero vector with correct dimensions
        model = _get_embed_model()
        return [0.0] * model.get_sentence_embedding_dimension()
    
    try:
        model = _get_embed_model()
        return model.encode(text).tolist()
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        # Return zero vector with correct dimensions as fallback
        return [0.0] * model.get_sentence_embedding_dimension()