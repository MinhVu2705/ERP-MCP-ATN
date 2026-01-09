from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import logging

from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.routers import ocr, search, qa, documents

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Document API",
    description="OCR, Semantic Search, and Document Q&A service",
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
app.include_router(ocr.router, prefix="/api/ocr", tags=["ocr"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(qa.router, prefix="/api/qa", tags=["qa"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])

# Metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Document API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
