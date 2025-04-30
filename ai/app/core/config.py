from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path
from dotenv import load_dotenv

class Settings(BaseSettings):
    LLAMA_MODEL_PATH: str = "E:/Repos/gugugaga/ai/zephyr-7b-alpha.Q5_K_M.gguf"
    MODEL_IMAGE_PATH: str = "../LLaVA-NeXT-Video-7B-hf"
    LLAMA_N_THREADS: int = 1           # threads cấu hình
    LLAMA_N_GPU_LAYERS: int = 40       # GPU offload layers
    CHROMA_DB_PATH: str = "./chromadb_store"
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    class Config:
        env_file = ".env"



# Load .env if present
env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

# Default model directory/name
MODEL_NAME = os.getenv('MODEL_NAME', 'LLaVA-Next-Video-7B-hf')

settings = Settings()