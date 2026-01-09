from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.routers import forecast, nlp, reporting

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Engine",
    description="NLP, LLM, Forecasting, and Reporting service",
    version="1.0.0"
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
