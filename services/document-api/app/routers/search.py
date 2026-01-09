from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.config import settings

router = APIRouter()

class SearchRequest(BaseModel):
    """Search request model"""
    query: str
    top_k: int = 5
    filters: dict = {}

class SearchResult(BaseModel):
    """Search result model"""
    content: str
    score: float
    metadata: dict

class SearchResponse(BaseModel):
    """Search response model"""
    results: List[SearchResult]
    total: int


def _get_vectorstore(embeddings):
    try:
        import chromadb
        from langchain_community.vectorstores import Chroma
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Vector search requires chromadb + langchain-community: {e}")

    try:
        chroma_client = chromadb.HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)
        chroma_client.heartbeat()
        return Chroma(
            client=chroma_client,
            collection_name="erp_documents",
            embedding_function=embeddings,
        )
    except Exception:
        return Chroma(
            collection_name="erp_documents",
            embedding_function=embeddings,
            persist_directory="./chroma_db",
        )

@router.post("/semantic", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """
    Semantic search across documents
    
    Use Case 5: Khai phá dữ liệu văn bản (Document Q&A)
    
    Uses ChromaDB + OpenAI embeddings for vector similarity search
    """
    try:
        if not settings.GEMINI_API_KEY:
            return SearchResponse(results=[], total=0)

        try:
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Gemini embeddings require langchain-google-genai: {e}")

        # Initialize embeddings using Gemini
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        vectorstore = _get_vectorstore(embeddings)
        
        # Perform similarity search
        docs = vectorstore.similarity_search_with_score(
            request.query,
            k=request.top_k
        )
        
        # Format results
        results = [
            SearchResult(
                content=doc.page_content,
                score=float(score),
                metadata=doc.metadata
            )
            for doc, score in docs
        ]
        
        return SearchResponse(
            results=results,
            total=len(results)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/index")
async def index_document(content: str, metadata: dict):
    """
    Index document for semantic search
    
    This should be called when new documents are uploaded
    """
    try:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="GEMINI_API_KEY is not configured")

        try:
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"Gemini embeddings require langchain-google-genai: {e}")

        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        vectorstore = _get_vectorstore(embeddings)
        
        # Add document to vector store
        vectorstore.add_texts(
            texts=[content],
            metadatas=[metadata]
        )
        
        return {
            "status": "indexed",
            "document_id": metadata.get("id", "unknown")
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/index/{document_id}")
async def delete_from_index(document_id: str):
    """Remove document from search index"""
    # TODO: Implement deletion from ChromaDB
    return {
        "status": "deleted",
        "document_id": document_id
    }
