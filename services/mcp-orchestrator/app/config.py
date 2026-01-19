from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "MCP Orchestrator"
    LOG_LEVEL: str = "INFO"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost"]
    
    # Database
    DATABASE_URL: str = "postgresql://erp_user:erp_password@localhost:5432/erp_mcp"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # External Services
    ERP_CORE_URL: str = "http://localhost:8080"
    AI_ENGINE_URL: str = "http://localhost:8001"
    DOCUMENT_API_URL: str = "http://localhost:8002"
    
    # Gemini / Google Generative AI (multiple keys for rotation)
    GEMINI_API_KEYS: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash-latest"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
