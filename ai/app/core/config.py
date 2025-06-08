from pydantic_settings import BaseSettings
import os
from pathlib import Path
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    """Application configuration settings using Pydantic"""
    # Model paths
    LLAMA_MODEL_PATH: str = "./zephyr-7b-alpha.Q5_K_M.gguf"
    MODEL_IMAGE_PATH: str = "./blip-image-captioning-base"
    
    # Performance settings
    LLAMA_N_THREADS: int = 1           # CPU threads for inference
    LLAMA_N_GPU_LAYERS: int = 40       # Number of layers to offload to GPU
    
    # Database
    CHROMA_DB_PATH: str = "./chromadb_store"
    
    # Embedding model
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 4000
    
    model_config = {"env_file": ".env"}

# Load .env file if present
env_path = Path(__file__).resolve().parents[2] / '.env'
if env_path.exists():
    logger.info(f"Loading environment from: {env_path}")
    load_dotenv(dotenv_path=env_path)
else:
    logger.warning(f"No .env file found at {env_path}, using defaults")

# Get model name from environment or use default
MODEL_NAME = os.getenv('MODEL_NAME', 'blip-image-captioning-base')
logger.info(f"Using model: {MODEL_NAME}")

# Create settings instance
settings = Settings()