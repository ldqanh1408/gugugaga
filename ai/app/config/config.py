from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    
    # Thêm các config mới
    LLAMA_MODEL_PATH: str = "E:/Repos/gugugaga/ai/zephyr-7b-alpha.Q5_K_M.gguf"
    LLAMA_N_GPU_LAYERS: int = 40  # Số layer chạy trên GPU
    LLAMA_N_THREADS: int = 10     # Số thread CPU
    
    # Giữ nguyên các config cũ
    CHROMA_DB_PATH: str = "./chromadb_store"
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

settings = Settings()