"""
Middleware for MCP Orchestrator
"""
from fastapi import Request
import time
import logging
from typing import Callable

logger = logging.getLogger(__name__)

async def logging_middleware(request: Request, call_next: Callable):
    """Log requests and responses"""
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(
        f"Response: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    # Add custom headers
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

async def rate_limit_middleware(request: Request, call_next: Callable):
    """Rate limiting middleware (placeholder)"""
    # TODO: Implement rate limiting logic
    # For now, just pass through
    response = await call_next(request)
    return response
