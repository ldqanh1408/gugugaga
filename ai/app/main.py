from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pathlib import Path
import logging
import torch

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
    allow_methods=["*"],
    allow_headers=["*"],
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
    
    # Check CUDA availability
    cuda_available = torch.cuda.is_available()
    if cuda_available:
        cuda_device = torch.cuda.get_device_name(0)
        cuda_capability = torch.cuda.get_device_capability(0)
        logger.info(f"CUDA is available: {cuda_device} (Compute capability: {cuda_capability[0]}.{cuda_capability[1]})")
        
        # Print CUDA version
        try:
            cuda_version = torch.version.cuda
            logger.info(f"CUDA version: {cuda_version}")
        except:
            logger.info("CUDA version information not available")
    else:
        logger.warning("CUDA is NOT available - models will run on CPU (significantly slower)")
        logger.warning("For optimal performance, consider installing CUDA and CUDA-enabled PyTorch")
    
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