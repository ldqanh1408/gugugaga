import chromadb
from ..core.config import settings
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Ensure the ChromaDB directory exists
Path(settings.CHROMA_DB_PATH).mkdir(parents=True, exist_ok=True)

# Initialize ChromaDB client
try:
    logger.info(f"Initializing ChromaDB client with path: {settings.CHROMA_DB_PATH}")
    client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
    logger.info("ChromaDB client initialized successfully")
except Exception as e:
    logger.error(f"Error initializing ChromaDB client: {str(e)}")
    raise

# Create or get collection for chat embeddings
try:
    logger.info("Creating/retrieving chat_embeddings collection")
    chat_vectors = client.get_or_create_collection(
        name="chat_embeddings",
        metadata={"description": "Embeddings for chat messages and media descriptions"}
    )
    logger.info("Collection ready")
except Exception as e:
    logger.error(f"Error accessing collection: {str(e)}")
    raise