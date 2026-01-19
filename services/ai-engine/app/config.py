from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """AI Engine settings"""
    
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = "postgresql://erp_user:erp_password@localhost:5432/erp_mcp"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Gemini / Google Generative AI (multiple keys for rotation)
    GEMINI_API_KEYS: str = ""
    MODEL_NAME: str = "gemini-2.5-flash-latest"
    
    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
