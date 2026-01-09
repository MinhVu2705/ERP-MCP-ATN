"""
Exception handlers for MCP Orchestrator
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger(__name__)

class MCPException(Exception):
    """Base exception for MCP Orchestrator"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ServiceUnavailableError(MCPException):
    """Service unavailable exception"""
    def __init__(self, service_name: str):
        super().__init__(
            f"Service {service_name} is currently unavailable",
            status_code=503
        )

class InvalidRequestError(MCPException):
    """Invalid request exception"""
    def __init__(self, message: str):
        super().__init__(message, status_code=400)

class AuthenticationError(MCPException):
    """Authentication error exception"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status_code=401)

async def mcp_exception_handler(request: Request, exc: MCPException):
    """Handle MCP exceptions"""
    logger.error(f"MCP Exception: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "status_code": exc.status_code
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation error",
            "details": exc.errors()
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc)
        }
    )
