import chromadb
from ..core.config import settings

client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
chat_vectors = client.get_or_create_collection(name="chat_embeddings")