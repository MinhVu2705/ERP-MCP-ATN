from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """AI Engine settings"""
    
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = "postgresql://erp_user:erp_password@localhost:5432/erp_mcp"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Gemini / Google Generative AI
    GEMINI_API_KEY: str = ""
    MODEL_NAME: str = "gemini-1.5-pro"
    
    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
