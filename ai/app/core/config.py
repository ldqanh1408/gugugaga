from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    LLAMA_MODEL_PATH: str = "E:/Repos/gugugaga/ai/zephyr-7b-alpha.Q5_K_M.gguf"
    LLAMA_N_THREADS: int = 1           # threads cấu hình
    LLAMA_N_GPU_LAYERS: int = 40       # GPU offload layers
    CHROMA_DB_PATH: str = "./chromadb_store"
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    class Config:
        env_file = ".env"

settings = Settings()