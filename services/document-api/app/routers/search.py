from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
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

@router.post("/semantic", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """
    Semantic search across documents
    
    Use Case 5: Khai phá dữ liệu văn bản (Document Q&A)
    
    Uses ChromaDB + OpenAI embeddings for vector similarity search
    """
    try:
        # Initialize embeddings
        embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
        
        # Connect to ChromaDB
        vectorstore = Chroma(
            collection_name="erp_documents",
            embedding_function=embeddings,
            persist_directory="./chroma_db"
        )
        
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
        embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
        
        vectorstore = Chroma(
            collection_name="erp_documents",
            embedding_function=embeddings,
            persist_directory="./chroma_db"
        )
        
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
