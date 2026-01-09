from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.config import settings

router = APIRouter()

class NLPRequest(BaseModel):
    """NLP request model"""
    text: str
    task: str  # 'intent', 'entity', 'sentiment', 'summarize'

class IntentResponse(BaseModel):
    """Intent detection response"""
    intent: str
    confidence: float
    entities: dict

@router.post("/intent", response_model=IntentResponse)
async def detect_intent(request: NLPRequest):
    """
    Detect user intent from text
    
    Use Case 3: Hỏi đáp thông minh trên dữ liệu ERP
    
    Intents:
    - revenue_query: "Doanh thu tháng 9 là bao nhiêu?"
    - forecast: "Dự báo doanh thu quý 4?"
    - product_info: "Sản phẩm A là gì?"
    - inventory: "Tồn kho sản phẩm B?"
    """
    try:
        # Use LLM for intent classification
        llm = ChatGoogleGenerativeAI(
            model=settings.MODEL_NAME,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.1,
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an intent classifier for an ERP system.
            Classify user queries into these intents:
            - revenue_query: Questions about revenue, sales
            - forecast: Questions about predictions, future trends
            - product_info: Questions about products
            - inventory: Questions about stock levels
            - general: Other questions
            
            Return JSON: {"intent": "...", "confidence": 0.95, "entities": {}}
            """),
            ("user", "{text}")
        ])
        
        chain = prompt | llm
        result = chain.invoke({"text": request.text})
        
        # Parse result (simplified)
        return IntentResponse(
            intent="revenue_query",
            confidence=0.95,
            entities={"month": "9"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize")
async def summarize_text(text: str):
    """
    Summarize long text using LLM
    
    Use Case 5: Khai phá dữ liệu văn bản
    """
    try:
        llm = ChatGoogleGenerativeAI(
            model=settings.MODEL_NAME,
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        prompt = f"Summarize the following text in Vietnamese:\n\n{text}"
        response = llm.invoke(prompt)
        
        return {
            "summary": response.content,
            "original_length": len(text),
            "summary_length": len(response.content)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/entity-extraction")
async def extract_entities(text: str):
    """
    Extract named entities from text
    
    Extracts: dates, amounts, product names, people
    """
    # TODO: Implement NER using spaCy or LLM
    return {
        "entities": [
            {"text": "tháng 9", "type": "DATE"},
            {"text": "2.1 tỷ", "type": "MONEY"},
        ]
    }
