from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Document API settings"""
    
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = "postgresql://erp_user:erp_password@localhost:5432/erp_mcp"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # ChromaDB for vector storage
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    
    # Gemini / Google Generative AI for embeddings and LLM
    GEMINI_API_KEY: str = ""
    
    # Google Search API (Custom Search)
    GOOGLE_API_KEY: str = ""
    GOOGLE_CSE_ID: str = ""
    
    # Document storage
    UPLOAD_DIR: str = "./documents"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    # MinIO (S3 compatible)
    MINIO_ENDPOINT: str = "http://localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET: str = "erp-documents"
    MINIO_REGION: str = "us-east-1"
    MINIO_SECURE: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
