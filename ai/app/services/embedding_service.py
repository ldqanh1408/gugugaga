from sentence_transformers import SentenceTransformer 
from app.core.config import settings

_embed_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)

def get_embedding(text: str) -> list[float]:
    return _embed_model.encode(text).tolist()