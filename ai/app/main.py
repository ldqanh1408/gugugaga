from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pathlib import Path
import logging

from app.routers.chat import router as chat_router
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Emotional AI Chatbot API",
    description="AI chatbot with multimodal capabilities using LLaMA-cpp and LLaVA",
    version="1.0.0"
)

# Configure CORS - Updated for better compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Consider changing to specific domains for production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "X-Content-Type-Options"]
)

# Include routers
app.include_router(chat_router, tags=["Chat"])

# Try to mount static files if directory exists
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
    
    # Add a root endpoint to redirect to docs
    @app.get("/", include_in_schema=False)
    async def root():
        return RedirectResponse(url="/docs")

# Application startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Emotional AI Chatbot API")
    logger.info(f"Using LLaMA model: {settings.LLAMA_MODEL_PATH}")
    logger.info(f"Using LLaVA model: {settings.MODEL_IMAGE_PATH}")
    logger.info(f"ChromaDB path: {settings.CHROMA_DB_PATH}")

# Application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Emotional AI Chatbot API")

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "app.main:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=True
    )