import requests
import av
import numpy as np
from PIL import Image


def load_image(url: str) -> Image.Image:
    resp = requests.get(url, stream=True)
    resp.raise_for_status()
    return Image.open(resp.raw)


def load_video_frames(path_or_url: str, num_frames: int = 8) -> np.ndarray:
    if path_or_url.startswith("http"):
        resp = requests.get(path_or_url, stream=True)
        resp.raise_for_status()
        container = av.open(resp.raw)
    else:
        container = av.open(path_or_url)

    total = container.streams.video[0].frames
    indices = np.linspace(0, total - 1, num_frames, dtype=int)
    frames = []
    for i, frame in enumerate(container.decode(video=0)):
        if i in indices:
            frames.append(frame.to_ndarray(format="rgb24"))
        if len(frames) == num_frames:
            break
    return np.stack(frames)