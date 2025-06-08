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
                n_ctx=1 << 15,                    # Context window size
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

def call_llama(prompt: str, max_tokens: int = 100) -> str:
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

async def get_llm_response(message: str, context: str = "") -> dict:
    """
    Get a response from the LLM with optional emotion analysis
    
    Args:
        message: User message to respond to
        context: Optional context for the conversation
        
    Returns:
        Dictionary with response text and emotion data
    """
    try:
        # Create the full prompt with context if available
        if context:
            prompt = f"{context}\n<|user|>\n{message}</s>\n<|assistant|>\n"
        else:
            # Simple prompt if no context
            prompt = f"<|user|>\n{message}</s>\n<|assistant|>\n"
        
        # Call the LLM
        response = call_llama(prompt, max_tokens=256)
        
        # Extract an "emotion" from the response (simple heuristic)
        emotion = "happy"
        emotion_score = 0.8
        
        # Check for keywords to determine emotion
        if any(word in response.lower() for word in ["sorry", "sad", "unfortunate", "regret"]):
            emotion = "sad"
            emotion_score = 0.7
        elif any(word in response.lower() for word in ["excited", "wonderful", "great", "fantastic"]):
            emotion = "excited"
            emotion_score = 0.9
        elif any(word in response.lower() for word in ["confused", "unsure", "don't know"]):
            emotion = "confused"
            emotion_score = 0.6
        
        return {
            "response": response,
            "emotion": emotion,
            "emotionScore": emotion_score
        }
        
    except Exception as e:
        logger.error(f"Error getting LLM response: {str(e)}")
        return {
            "response": "I'm having trouble responding right now. Can you try again? 🥺",
            "emotion": "confused",
            "emotionScore": 0.5
        }