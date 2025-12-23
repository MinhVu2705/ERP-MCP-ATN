from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
from app.config import settings

router = APIRouter()

class ChatMessage(BaseModel):
    """Chat message model"""
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    """Chat request model"""
    message: str
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    intent: str
    confidence: float

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process user chat message and return AI response
    
    Use cases:
    - "Doanh thu tháng 9 là bao nhiêu?" -> Query ERP data
    - "Dự báo doanh thu quý 4?" -> Call AI forecasting
    - "Sản phẩm A là gì?" -> Document Q&A
    """
    try:
        # TODO: Implement intent detection
        intent = detect_intent(request.message)
        
        # Route to appropriate service based on intent
        if intent == "revenue_query":
            response = await query_erp_revenue(request.message)
        elif intent == "forecast":
            response = await get_forecast(request.message)
        elif intent == "document_qa":
            response = await query_documents(request.message)
        else:
            response = "Xin lỗi, tôi chưa hiểu câu hỏi của bạn."
        
        return ChatResponse(
            response=response,
            intent=intent,
            confidence=0.95
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def detect_intent(message: str) -> str:
    """Detect user intent from message"""
    # TODO: Implement proper intent detection using LLM
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["doanh thu", "revenue"]):
        return "revenue_query"
    elif any(word in message_lower for word in ["dự báo", "forecast"]):
        return "forecast"
    elif any(word in message_lower for word in ["sản phẩm", "product", "là gì"]):
        return "document_qa"
    else:
        return "general"

async def query_erp_revenue(message: str) -> str:
    """Query ERP Core for revenue data"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.ERP_CORE_URL}/api/revenue/september")
            if response.status_code == 200:
                data = response.json()
                return f"Doanh thu tháng 9 đạt {data['revenue']} tỷ VND, tăng {data['growth']}% so với tháng 8."
            else:
                return "Không thể truy xuất dữ liệu doanh thu."
    except Exception as e:
        return f"Lỗi khi truy vấn dữ liệu: {str(e)}"

async def get_forecast(message: str) -> str:
    """Get revenue forecast from AI Engine"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.AI_ENGINE_URL}/api/forecast",
                json={"period": "Q4"}
            )
            if response.status_code == 200:
                data = response.json()
                return f"Dự kiến tăng {data['growth']}% so với Q3, khoảng {data['amount']} tỷ VND."
            else:
                return "Không thể tạo dự báo."
    except Exception as e:
        return f"Lỗi khi dự báo: {str(e)}"

async def query_documents(message: str) -> str:
    """Query Document API for information"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.DOCUMENT_API_URL}/api/query",
                json={"question": message}
            )
            if response.status_code == 200:
                data = response.json()
                return data['answer']
            else:
                return "Không tìm thấy thông tin trong tài liệu."
    except Exception as e:
        return f"Lỗi khi tìm kiếm tài liệu: {str(e)}"
