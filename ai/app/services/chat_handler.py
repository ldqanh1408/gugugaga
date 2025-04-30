import torch
from pathlib import Path
from app.models.chat_models import ChatRequest, MediaItem
from app.utils.media_loader import load_image, load_video_frames
from app.core.prompt_builder import PromptBuilder
from app.core.config import MODEL_NAME
from transformers import LlavaNextForConditionalGeneration

ROOT_DIR = Path(__file__).resolve().parents[2]

def _get_model_path() -> str:
    local_dir = ROOT_DIR / MODEL_NAME
    return str(local_dir) if local_dir.exists() else MODEL_NAME


def handle_image_chat(req: ChatRequest) -> str:
    model_path = _get_model_path()
    builder = PromptBuilder(model_path)
    data = builder.build(req)
    proc = data["processor"]
    img = load_image(req.media[0].url)

    inputs = proc(text=data["text"], images=img, return_tensors="pt").to("cuda")
    model = LlavaNextForConditionalGeneration.from_pretrained(
        model_path, torch_dtype=torch.float16, low_cpu_mem_usage=True
    ).to("cuda")

    out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
    return proc.decode(out[0][2:], skip_special_tokens=True)


def handle_video_chat(req: ChatRequest) -> str:
    model_path = _get_model_path()
    builder = PromptBuilder(model_path)
    data = builder.build(req)
    proc = data["processor"]
    clip = load_video_frames(req.media[0].url)

    inputs = proc(text=data["text"], videos=clip, padding=True, return_tensors="pt").to("cuda")
    model = LlavaNextForConditionalGeneration.from_pretrained(
        model_path, torch_dtype=torch.float16, low_cpu_mem_usage=True
    ).to("cuda")

    out = model.generate(**inputs, max_new_tokens=100, do_sample=False)
    return proc.decode(out[0][2:], skip_special_tokens=True)


def handle_mixed_chat(req: ChatRequest) -> str:
    replies = []
    # duyệt lần lượt từng MediaItem
    for media in req.media:
        single_req = ChatRequest(
            chatId=req.chatId,
            message=req.message,
            media=[media]  # đưa media này vào list để tái sử dụng handler hiện có
        )
        if media.type == "image":
            replies.append(handle_image_chat(single_req))
        elif media.type == "video":
            replies.append(handle_video_chat(single_req))
        else:
            raise ValueError(f"Unsupported media type: {media.type}")
    # Nối tất cả phần trả lời thành một chuỗi duy nhất
    # Bạn có thể thay '\n\n' bằng bất cứ định dạng nào bạn muốn
    return "\n\n".join(replies)



def handle_chat_request(req: ChatRequest) -> str:
    types = {m.type for m in req.media}
    if types <= {"image"}:
        return handle_image_chat(req)
    elif types <= {"video"}:
        return handle_video_chat(req)
    else:
        # có cả image và video
        return handle_mixed_chat(req)