from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.routers import forecast, nlp, reporting, csv_processor
from app.utils.api_key_manager import init_key_manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management"""
    logger.info("🚀 Starting AI Engine...")
    
    # Initialize API key manager
    if settings.GEMINI_API_KEYS:
        try:
            key_manager = init_key_manager(settings.GEMINI_API_KEYS)
            logger.info(f"✅ API key manager initialized with {len(key_manager.api_keys)} keys")
        except Exception as e:
            logger.error(f"❌ Failed to initialize API key manager: {e}")
    else:
        logger.warning("⚠️ No Gemini API keys configured")
    
    yield
    logger.info("👋 Shutting down AI Engine...")

app = FastAPI(
    title="AI Engine",
    description="NLP, LLM, Forecasting, and Reporting service",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forecast.router, prefix="/api/forecast", tags=["forecast"])
app.include_router(nlp.router, prefix="/api/nlp", tags=["nlp"])
app.include_router(reporting.router, prefix="/api/reporting", tags=["reporting"])
app.include_router(csv_processor.router, prefix="/api/csv", tags=["csv-processing"])

# Metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AI Engine",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
