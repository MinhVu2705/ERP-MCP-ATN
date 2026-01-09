from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging

from prometheus_fastapi_instrumentator import Instrumentator

from app.config import settings
from app.routers import chat, analytics, workflow
from app.exceptions import (
    MCPException, 
    mcp_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from app.middleware import logging_middleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management"""
    logger.info("🚀 Starting MCP Orchestrator...")
    logger.info(f"Environment: {getattr(settings, 'ENVIRONMENT', 'production')}")
    logger.info(f"ERP Core URL: {settings.ERP_CORE_URL}")
    yield
    logger.info("👋 Shutting down MCP Orchestrator...")

app = FastAPI(
    title="MCP Orchestrator",
    description="Intent understanding, workflow execution, and API orchestration",
    version="1.0.0",
    lifespan=lifespan
)

# Exception handlers
app.add_exception_handler(MCPException, mcp_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Middleware
app.middleware("http")(logging_middleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(workflow.router, prefix="/api/workflow", tags=["workflow"])

# Metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "MCP Orchestrator",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time chat"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process message
            response = f"Echo: {data}"
            await websocket.send_text(response)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
