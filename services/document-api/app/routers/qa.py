from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from langchain_core.prompts import ChatPromptTemplate
import httpx
from app.config import settings

router = APIRouter()


def _get_vectorstore(embeddings):
    try:
        import chromadb
        from langchain_community.vectorstores import Chroma
    except Exception:
        return None

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

class QARequest(BaseModel):
    """Q&A request model"""
    question: str
    use_google_fallback: bool = True

class QAResponse(BaseModel):
    """Q&A response model"""
    answer: str
    sources: List[dict]
    confidence: float
    source_type: str  # 'internal' or 'google'

@router.post("/query", response_model=QAResponse)
async def document_qa(request: QARequest):
    """
    Answer questions using internal documents
    
    Use Case 5: Khai phá dữ liệu văn bản (Document Q&A)
    
    Flow:
    1. Search in internal documents (RAG)
    2. If no answer found and use_google_fallback=True, search Google
    3. Return answer with sources
    
    Example:
    Q: "Sản phẩm A là gì?"
    A: "Sản phẩm A là dòng cảm biến nhiệt công nghiệp..."
    """
    try:
        # Try internal documents first
        answer, sources, confidence = await query_internal_docs(request.question)
        
        if confidence > 0.6:
            return QAResponse(
                answer=answer,
                sources=sources,
                confidence=confidence,
                source_type="internal"
            )
        
        # Fallback to Google Search if enabled
        if request.use_google_fallback:
            answer, sources = await google_search_fallback(request.question)
            return QAResponse(
                answer=answer,
                sources=sources,
                confidence=0.7,
                source_type="google"
            )
        
        return QAResponse(
            answer="Xin lỗi, tôi không tìm thấy thông tin liên quan.",
            sources=[],
            confidence=0.0,
            source_type="none"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def query_internal_docs(question: str) -> tuple[str, List[dict], float]:
    """
    Query internal documents using RAG
    """
    try:
        if not settings.GEMINI_API_KEY:
            return "GEMINI_API_KEY chưa được cấu hình để truy vấn tài liệu nội bộ.", [], 0.0

        try:
            from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
        except Exception:
            return "Thiếu dependency langchain-google-genai để truy vấn tài liệu nội bộ.", [], 0.0

        # Initialize LLM and embeddings
        llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.1,
        )

        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        vectorstore = _get_vectorstore(embeddings)
        if vectorstore is None:
            return "Thiếu dependency chromadb/langchain-community để truy vấn tài liệu nội bộ.", [], 0.0
        
        # Create RAG chain
        prompt_template = """Use the following pieces of context to answer the question in Vietnamese.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        
        Context: {context}
        
        Question: {question}
        
        Answer in Vietnamese:"""
        
        # Get relevant documents
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        docs = retriever.get_relevant_documents(question)
        
        # Combine context from documents
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Create prompt and get answer
        prompt = ChatPromptTemplate.from_template(prompt_template)
        messages = prompt.format_messages(context=context, question=question)
        
        result = llm.invoke(messages)
        
        # Extract sources
        sources = [
            {
                "content": doc.page_content[:200],
                "metadata": doc.metadata
            }
            for doc in docs
        ]
        
        return result.content, sources, 0.8
    
    except Exception as e:
        return "Không thể truy vấn tài liệu nội bộ.", [], 0.0

async def google_search_fallback(question: str) -> tuple[str, List[dict]]:
    """
    Fallback to Google Search when internal docs don't have answer
    """
    try:
        if not settings.GOOGLE_API_KEY or not settings.GOOGLE_CSE_ID:
            return "Google Search chưa được cấu hình.", []
        
        # Perform Google Custom Search
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/customsearch/v1",
                params={
                    "key": settings.GOOGLE_API_KEY,
                    "cx": settings.GOOGLE_CSE_ID,
                    "q": question,
                    "num": 3
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                
                if items:
                    # Use LLM to synthesize answer from search results
                    try:
                        from langchain_google_genai import ChatGoogleGenerativeAI
                    except Exception as e:
                        return f"Thiếu dependency langchain-google-genai: {e}", []

                    llm = ChatGoogleGenerativeAI(
                        model=settings.GEMINI_MODEL,
                        google_api_key=settings.GEMINI_API_KEY,
                    )
                    
                    context = "\n\n".join([
                        f"Title: {item['title']}\nSnippet: {item['snippet']}"
                        for item in items
                    ])
                    
                    prompt = f"""Based on these search results, answer the question in Vietnamese:
                    
                    {context}
                    
                    Question: {question}
                    
                    Answer:"""
                    
                    answer = llm.invoke(prompt)
                    
                    sources = [
                        {
                            "title": item["title"],
                            "url": item["link"],
                            "snippet": item["snippet"]
                        }
                        for item in items
                    ]
                    
                    return answer.content, sources
        
        return "Không tìm thấy kết quả trên Google.", []
    
    except Exception as e:
        return f"Lỗi khi tìm kiếm: {str(e)}", []

@router.post("/contract-qa")
async def contract_qa(question: str, contract_id: str):
    """
    Q&A specifically for contracts
    
    Allows targeted questions on specific contracts
    """
    # TODO: Implement contract-specific Q&A
    return {
        "question": question,
        "contract_id": contract_id,
        "answer": "Contract Q&A feature coming soon"
    }
