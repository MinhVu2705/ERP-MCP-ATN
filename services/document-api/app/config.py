from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Document API settings"""
    
    # Database
    DATABASE_URL: str = "postgresql://erp_user:erp_password@localhost:5432/erp_mcp"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # ChromaDB for vector storage
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    
    # OpenAI for embeddings and LLM
    OPENAI_API_KEY: str = ""
    
    # Google Search API
    GOOGLE_API_KEY: str = ""
    GOOGLE_CSE_ID: str = ""
    
    # Document storage
    UPLOAD_DIR: str = "./documents"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"

settings = Settings()
