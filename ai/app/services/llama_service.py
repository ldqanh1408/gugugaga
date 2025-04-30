from llama_cpp import Llama
from app.core.config import settings
import logging

# Khởi tạo model
_llm = Llama(
    model_path=settings.LLAMA_MODEL_PATH,
    n_ctx=2048,                    # Context window size
    n_gpu_layers=settings.LLAMA_N_GPU_LAYERS,
    n_threads=settings.LLAMA_N_THREADS,
    temperature=0.6,
    top_k=40,
    top_p=0.95,
    repeat_last_n=128,
    repeat_penalty=1.1,
    verbose=False,
    # flash_attn=True,  # Tăng tốc độ xử lý
    # mmap=True,        # Giảm RAM usage
    # tensor_split=[0.9, 0.1]  # Phân bổ VRAM cho multi-GPU
)

def call_llama(prompt: str) -> str:
    try:
        response = _llm.create_completion(
            prompt=prompt,
            max_tokens=50
            # stop=["<|im_end|>"]
        )
        return response["choices"][0]["text"].strip()
    
    except Exception as e:
        logging.error(f"LLAMA ERROR: {str(e)}")
        return "Xin lỗi, mình đang gặp chút sự cố. Bạn thử hỏi lại nhé 🥺"