from llama_cpp import Llama
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize the LLM model
_llm = None

def get_llm():
    """
    Lazy initialization of LLama model to avoid loading at import time
    
    Returns:
        Initialized Llama model instance
    """
    global _llm
    if _llm is None:
        try:
            logger.info(f"Initializing LLM with model path: {settings.LLAMA_MODEL_PATH}")
            _llm = Llama(
                model_path=settings.LLAMA_MODEL_PATH,
                n_ctx=1 << 11,                    # Context window size
                n_gpu_layers=settings.LLAMA_N_GPU_LAYERS,
                n_threads=settings.LLAMA_N_THREADS,
                temperature=0.6,
                top_k=40,
                top_p=0.95,
                repeat_last_n=128,
                repeat_penalty=1.1,
                verbose=False,
            )
            logger.info("LLM successfully initialized")
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {str(e)}")
            raise
    return _llm

def call_llama(prompt: str, max_tokens: int = 256) -> str:
    """
    Generate a response from the LLama model
    
    Args:
        prompt: The input prompt to generate from
        max_tokens: Maximum number of tokens to generate
        
    Returns:
        Generated text response
    """
    try:
        llm = get_llm()
        response = llm.create_completion(
            prompt=prompt,
            max_tokens=max_tokens
            # stop=["<|im_end|>"]
        )
        return response["choices"][0]["text"].strip()   
    
    except Exception as e:
        logger.error(f"LLAMA ERROR: {str(e)}")
        return "Xin lỗi, mình đang gặp chút sự cố. Bạn thử hỏi lại nhé 🥺"  