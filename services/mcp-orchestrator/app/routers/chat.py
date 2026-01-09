from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Tuple
import httpx
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
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
    dashboard_config: Optional[Dict[str, Any]] = None

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    MCP Orchestrator - Process user chat message and orchestrate services
    
    Capabilities:
    - "Doanh thu tháng 9 là bao nhiêu?" -> Query ERP data
    - "Dự báo doanh thu quý 4?" -> Call AI forecasting
    - "Sản phẩm A là gì?" -> Document Q&A
    - "Tạo dashboard doanh thu theo tháng" -> Generate dashboard config
    - "Phân tích top sản phẩm bán chạy" -> Analytics & visualization
    """
    try:
        # Detect intent using LLM
        intent_data = await detect_intent_with_llm(request.message)
        intent = intent_data["intent"]
        params = intent_data.get("parameters", {})
        
        # Route to appropriate service based on intent
        if intent == "revenue_query":
            response = await query_erp_revenue(request.message, params)
            dashboard_config = None
            
        elif intent == "forecast":
            response = await get_forecast(request.message, params)
            dashboard_config = None
            
        elif intent == "document_qa":
            response = await query_documents(request.message)
            dashboard_config = None
            
        elif intent == "create_dashboard":
            response, dashboard_config = await create_dashboard(request.message, params)
            
        elif intent == "analytics":
            response, dashboard_config = await run_analytics(request.message, params)
            
        else:
            response = await general_response(request.message)
            dashboard_config = None
        
        return ChatResponse(
            response=response,
            intent=intent,
            confidence=intent_data.get("confidence", 0.95),
            dashboard_config=dashboard_config
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def detect_intent_with_llm(message: str) -> Dict[str, Any]:
    """Detect user intent using LLM"""
    try:
        llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            temperature=0,
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        prompt = ChatPromptTemplate.from_template("""
        Phân tích câu hỏi của người dùng và xác định intent:
        
        Các intent hợp lệ:
        - revenue_query: Truy vấn doanh thu, chi phí, lợi nhuận (VD: "Doanh thu tháng 9?")
        - forecast: Dự báo doanh thu, xu hướng (VD: "Dự báo Q4")
        - document_qa: Hỏi về sản phẩm, tài liệu (VD: "Sản phẩm X là gì?")
        - analytics: Phân tích dữ liệu, chỉ trả lời bằng text + số liệu (VD: "Phân tích top 10 sản phẩm", "So sánh phòng ban")
        - create_dashboard: Tạo biểu đồ, dashboard, visualization (VD: "Tạo dashboard doanh thu", "Vẽ biểu đồ top sản phẩm")
        - general: Câu hỏi chung
        
        QUAN TRỌNG:
        - Nếu có từ "tạo", "vẽ", "hiển thị", "dashboard", "biểu đồ" → create_dashboard
        - Nếu chỉ hỏi "phân tích", "top", "so sánh", "thống kê" (KHÔNG có "tạo/vẽ") → analytics
        
        Câu hỏi: {message}
        
        Trả về JSON với format:
        {{
            "intent": "...",
            "confidence": 0.95,
            "parameters": {{
                "period": "...",
                "metric": "...",
                "chart_type": "..."
            }}
        }}
        """)
        
        response = llm.invoke(prompt.format_messages(message=message))
        import json
        return json.loads(response.content)
        
    except Exception as e:
        # Fallback to simple keyword matching
        return detect_intent_simple(message)

def detect_intent_simple(message: str) -> Dict[str, Any]:
    """Simple keyword-based intent detection"""
    message_lower = message.lower()
    
    # Check for explicit dashboard creation requests
    if any(word in message_lower for word in ["tạo dashboard", "tạo biểu đồ", "vẽ chart", "vẽ biểu đồ", "hiển thị dashboard"]):
        return {"intent": "create_dashboard", "confidence": 0.85, "parameters": {}}
    
    # Analytics questions (answer with text + evidence, NO dashboard)
    elif any(word in message_lower for word in ["phân tích", "top", "ranking", "xếp hạng", "thống kê", "so sánh"]):
        return {"intent": "analytics", "confidence": 0.85, "parameters": {}}
    
    # Revenue queries
    elif any(word in message_lower for word in ["doanh thu", "revenue", "lợi nhuận", "profit"]):
        return {"intent": "revenue_query", "confidence": 0.9, "parameters": {}}
    
    # Forecast
    elif any(word in message_lower for word in ["dự báo", "forecast", "predict", "xu hướng"]):
        return {"intent": "forecast", "confidence": 0.9, "parameters": {}}
    
    # Document Q&A
    elif any(word in message_lower for word in ["sản phẩm", "product", "là gì", "thông tin"]):
        return {"intent": "document_qa", "confidence": 0.85, "parameters": {}}
    
    else:
        return {"intent": "general", "confidence": 0.7, "parameters": {}}

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

async def create_dashboard(message: str, params: Dict) -> Tuple[str, Dict]:
    """Generate dashboard configuration based on user request"""
    try:
        # Extract dashboard requirements
        llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            temperature=0,
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        prompt = ChatPromptTemplate.from_template("""
        Từ yêu cầu: "{message}"
        
        Tạo cấu hình dashboard với:
        - title: Tên dashboard
        - charts: Danh sách biểu đồ [type, title, dataSource, filters]
        - period: Khoảng thời gian (daily, weekly, monthly, quarterly, yearly)
        - metrics: Các chỉ số cần hiển thị
        
        Trả về JSON format:
        {{
            "title": "...",
            "period": "monthly",
            "charts": [
                {{
                    "type": "line|bar|pie|kpi|table",
                    "title": "...",
                    "dataSource": "transactions",
                    "metrics": ["revenue", "profit"],
                    "groupBy": "department|product|month",
                    "filters": {{}},
                    "aggregation": "sum|avg|count"
                }}
            ]
        }}
        """)
        
        response = llm.invoke(prompt.format_messages(message=message))
        import json
        dashboard_config = json.loads(response.content)
        
        # Generate response message
        chart_count = len(dashboard_config.get("charts", []))
        response_msg = f"✅ Đã tạo dashboard '{dashboard_config['title']}' với {chart_count} biểu đồ:\n"
        
        for i, chart in enumerate(dashboard_config.get("charts", []), 1):
            response_msg += f"\n{i}. {chart['title']} ({chart['type']})"
        
        response_msg += "\n\nDashboard đang được hiển thị bên dưới."
        
        return response_msg, dashboard_config
        
    except Exception as e:
        # Fallback to comprehensive revenue dashboard
        dashboard_config = {
            "title": "Dashboard Doanh Thu Toàn Diện",
            "period": "monthly",
            "charts": [
                {
                    "type": "kpi",
                    "title": "Tổng Doanh Thu",
                    "dataSource": "transactions",
                    "metrics": ["revenue"],
                    "aggregation": "sum"
                },
                {
                    "type": "kpi",
                    "title": "Lợi Nhuận",
                    "dataSource": "transactions",
                    "metrics": ["profit"],
                    "aggregation": "sum"
                },
                {
                    "type": "kpi",
                    "title": "Chi Phí",
                    "dataSource": "transactions",
                    "metrics": ["cost"],
                    "aggregation": "sum"
                },
                {
                    "type": "line",
                    "title": "Xu Hướng Doanh Thu & Lợi Nhuận Theo Tháng",
                    "dataSource": "transactions",
                    "metrics": ["revenue", "profit", "cost"],
                    "groupBy": "month",
                    "aggregation": "sum"
                },
                {
                    "type": "bar",
                    "title": "Doanh Thu Theo Phòng Ban",
                    "dataSource": "transactions",
                    "metrics": ["revenue"],
                    "groupBy": "department",
                    "aggregation": "sum"
                },
                {
                    "type": "pie",
                    "title": "Phân Bổ Doanh Thu Theo Phòng Ban",
                    "dataSource": "transactions",
                    "metrics": ["revenue"],
                    "groupBy": "department",
                    "aggregation": "sum"
                },
                {
                    "type": "table",
                    "title": "Top 10 Sản Phẩm Bán Chạy",
                    "dataSource": "transactions",
                    "metrics": ["revenue"],
                    "groupBy": "product",
                    "aggregation": "sum",
                    "limit": 10,
                    "columns": ["product", "revenue", "change"]
                }
            ]
        }
        
        return "✅ Đã tạo Dashboard Doanh Thu Toàn Diện với 7 góc nhìn:\n\n1. 📊 3 KPI chính (Tổng Doanh Thu, Lợi Nhuận, Chi Phí)\n2. 📈 Xu hướng theo thời gian\n3. 📊 So sánh theo phòng ban (Bar Chart)\n4. 🥧 Phân bổ doanh thu (Pie Chart)\n5. 📋 Top 10 sản phẩm (Table)\n\nDashboard hiển thị tất cả các góc nhìn về doanh thu của doanh nghiệp!", dashboard_config

async def run_analytics(message: str, params: Dict) -> Tuple[str, None]:
    """Run analytics and return TEXT response with evidence (NO dashboard)"""
    try:
        # Detect analytics type from message
        message_lower = message.lower()
        
        analytics_type = "comprehensive"
        if any(word in message_lower for word in ["top", "xếp hạng", "bán chạy", "ranking"]):
            analytics_type = "top_products"
        elif any(word in message_lower for word in ["phòng ban", "department", "bộ phận"]):
            analytics_type = "department_performance"
        elif any(word in message_lower for word in ["tháng", "month", "xu hướng", "trend"]):
            analytics_type = "monthly_trend"
        elif any(word in message_lower for word in ["danh mục", "loại sản phẩm", "category"]):
            analytics_type = "product_category"
        
        # Query transaction data from ERP Core
        async with httpx.AsyncClient(timeout=30.0) as client:
            analytics_response = await client.get(
                f"{settings.ERP_CORE_URL}/api/transactions/analytics",
                params={"type": analytics_type, **params}
            )
            
            if analytics_response.status_code != 200:
                raise Exception(f"Analytics API returned {analytics_response.status_code}")
            
            analytics_result = analytics_response.json()
        
        # Generate TEXT response with evidence (NO dashboard)
        if analytics_type == "top_products":
            return format_top_products_text(analytics_result)
        elif analytics_type == "department_performance":
            return format_department_text(analytics_result)
        elif analytics_type == "monthly_trend":
            return format_monthly_trend_text(analytics_result)
        elif analytics_type == "product_category":
            return format_category_text(analytics_result)
        else:
            return format_comprehensive_text(analytics_result)
        
    except Exception as e:
        # Fallback response
        error_msg = f"❌ Không thể phân tích: {str(e)}\n\nVui lòng thử lại sau hoặc kiểm tra dữ liệu."
        return error_msg, None

def format_top_products_text(analytics_result: Dict) -> Tuple[str, None]:
    """Format TEXT response for top products (NO dashboard)"""
    data = analytics_result.get("data", [])
    total = analytics_result.get("total", 0)
    
    response_lines = ["📊 **Phân Tích Top 10 Sản Phẩm Bán Chạy Nhất:**\n"]
    
    for i, item in enumerate(data[:10], 1):
        name = item.get("name", "N/A")
        value = item.get("value", 0)
        change = item.get("change", 0)
        change_icon = "📈" if change > 0 else "📉"
        
        response_lines.append(
            f"{i}. **{name}**\n   💰 Doanh thu: {value:,.0f} VNĐ\n   {change_icon} Thay đổi: {abs(change):.1f}%"
        )
    
    response_lines.append(f"\n💵 **Tổng doanh thu từ top 10:** {total:,.0f} VNĐ")
    response_lines.append(f"\n📌 **Nhận xét:** Sản phẩm **{data[0].get('name')}** dẫn đầu với {data[0].get('value', 0):,.0f} VNĐ")
    
    return "\n".join(response_lines), None  # NO dashboard

def format_department_text(analytics_result: Dict) -> Tuple[str, None]:
    """Format TEXT response for department performance (NO dashboard)"""
    data = analytics_result.get("data", [])
    
    response_lines = ["📊 **Phân Tích Hiệu Suất Phòng Ban:**\n"]
    
    for i, dept in enumerate(data, 1):
        name = dept.get("name", "N/A")
        revenue = dept.get("revenue", 0)
        profit = dept.get("profit", 0)
        margin = dept.get("profitMargin", 0)
        transactions = dept.get("transactions", 0)
        
        response_lines.append(
            f"{i}. **Phòng {name}**\n"
            f"   💰 Doanh thu: {revenue:,.0f} VNĐ\n"
            f"   💵 Lợi nhuận: {profit:,.0f} VNĐ\n"
            f"   📊 Tỷ suất: {margin:.1f}%\n"
            f"   📝 Giao dịch: {transactions:,}"
        )
    
    # Add insights
    if data:
        best_dept = data[0]
        total_revenue = sum(d.get("revenue", 0) for d in data)
        best_percentage = (best_dept.get("revenue", 0) / total_revenue * 100) if total_revenue > 0 else 0
        
        response_lines.append(
            f"\n📌 **Nhận xét:**\n"
            f"- Phòng **{best_dept.get('name')}** dẫn đầu, chiếm {best_percentage:.1f}% tổng doanh thu\n"
            f"- Tổng doanh thu toàn công ty: {total_revenue:,.0f} VNĐ"
        )
    
    return "\n".join(response_lines), None  # NO dashboard

def format_monthly_trend_text(analytics_result: Dict) -> Tuple[str, None]:
    """Format TEXT response for monthly trend (NO dashboard)"""
    data = analytics_result.get("data", [])
    
    response_lines = ["📈 **Phân Tích Xu Hướng Doanh Thu Theo Tháng:**\n"]
    
    # Show last 6 months
    for month_data in data[-6:]:
        month = month_data.get("name", "N/A")
        revenue = month_data.get("revenue", 0)
        profit = month_data.get("profit", 0)
        cost = month_data.get("cost", 0)
        
        response_lines.append(
            f"📅 **{month}**\n"
            f"   💰 Doanh thu: {revenue:,.0f} VNĐ\n"
            f"   💵 Lợi nhuận: {profit:,.0f} VNĐ\n"
            f"   💸 Chi phí: {cost:,.0f} VNĐ"
        )
    
    # Calculate insights
    if len(data) >= 2:
        latest = data[-1]
        previous = data[-2]
        
        revenue_growth = ((latest.get("revenue", 0) - previous.get("revenue", 0)) / previous.get("revenue", 1) * 100)
        profit_growth = ((latest.get("profit", 0) - previous.get("profit", 0)) / previous.get("profit", 1) * 100)
        
        growth_icon = "📈" if revenue_growth > 0 else "📉"
        
        response_lines.append(
            f"\n📌 **Nhận xét:**\n"
            f"{growth_icon} Doanh thu tháng gần nhất {'tăng' if revenue_growth > 0 else 'giảm'} {abs(revenue_growth):.1f}% so với tháng trước\n"
            f"{'📈' if profit_growth > 0 else '📉'} Lợi nhuận {'tăng' if profit_growth > 0 else 'giảm'} {abs(profit_growth):.1f}%"
        )
    
    return "\n".join(response_lines), None  # NO dashboard

def format_category_text(analytics_result: Dict) -> Tuple[str, None]:
    """Format TEXT response for product category (NO dashboard)"""
    data = analytics_result.get("data", [])
    
    response_lines = ["📦 **Phân Tích Danh Mục Sản Phẩm:**\n"]
    
    total = sum(item.get("value", 0) for item in data)
    
    for i, cat in enumerate(data, 1):
        name = cat.get("name", "N/A")
        value = cat.get("value", 0)
        percentage = (value / total * 100) if total > 0 else 0
        
        response_lines.append(
            f"{i}. **{name}**\n"
            f"   💰 Doanh thu: {value:,.0f} VNĐ\n"
            f"   📊 Tỷ trọng: {percentage:.1f}%"
        )
    
    # Add insights
    if data:
        top_cat = data[0]
        response_lines.append(
            f"\n📌 **Nhận xét:**\n"
            f"- Danh mục **{top_cat.get('name')}** chiếm ưu thế với {(top_cat.get('value', 0) / total * 100):.1f}% thị phần\n"
            f"- Tổng doanh thu: {total:,.0f} VNĐ"
        )
    
    return "\n".join(response_lines), None  # NO dashboard

def format_comprehensive_text(analytics_result: Dict) -> Tuple[str, None]:
    """Format TEXT response for comprehensive analysis (NO dashboard)"""
    response_lines = ["📊 **Phân Tích Tổng Quan Dữ Liệu:**\n"]
    
    total_revenue = analytics_result.get("totalRevenue", 0)
    total_profit = analytics_result.get("totalProfit", 0)
    total_cost = analytics_result.get("totalCost", 0)
    profit_margin = analytics_result.get("profitMargin", 0)
    transaction_count = analytics_result.get("transactionCount", 0)
    
    response_lines.append("**📈 Chỉ số tổng quan:**")
    response_lines.append(f"💰 Tổng doanh thu: {total_revenue:,.0f} VNĐ")
    response_lines.append(f"💵 Lợi nhuận: {total_profit:,.0f} VNĐ")
    response_lines.append(f"💸 Chi phí: {total_cost:,.0f} VNĐ")
    response_lines.append(f"📊 Tỷ suất lợi nhuận: {profit_margin:.1f}%")
    response_lines.append(f"📝 Tổng số giao dịch: {transaction_count:,}")
    
    top_products = analytics_result.get("topProducts", [])
    if top_products:
        response_lines.append("\n**🏆 Top 3 Sản Phẩm:**")
        for i, prod in enumerate(top_products[:3], 1):
            response_lines.append(f"{i}. {prod.get('name', 'N/A')}: {prod.get('value', 0):,.0f} VNĐ")
    
    departments = analytics_result.get("departments", [])
    if departments:
        response_lines.append("\n**🏢 Hiệu Suất Phòng Ban:**")
        for i, dept in enumerate(departments[:3], 1):
            response_lines.append(
                f"{i}. {dept.get('name', 'N/A')}: {dept.get('revenue', 0):,.0f} VNĐ "
                f"(Lợi nhuận: {dept.get('profitMargin', 0):.1f}%)"
            )
    
    response_lines.append(
        f"\n📌 **Kết luận:** Doanh nghiệp đạt tỷ suất lợi nhuận {profit_margin:.1f}% "
        f"với {transaction_count:,} giao dịch. "
        f"{'Hiệu suất tốt' if profit_margin > 15 else 'Cần cải thiện hiệu quả'}."
    )
    
    return "\n".join(response_lines), None  # NO dashboard


async def general_response(message: str) -> str:
    """Handle general queries using LLM"""
    try:
        llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            temperature=0.7,
            google_api_key=settings.GEMINI_API_KEY,
        )
        
        prompt = ChatPromptTemplate.from_template("""
        Bạn là trợ lý AI cho hệ thống ERP-MCP.
        
        Hệ thống có các chức năng:
        - Truy vấn doanh thu, chi phí, lợi nhuận
        - Dự báo doanh thu bằng AI
        - Tạo dashboard và biểu đồ tùy chỉnh
        - Phân tích dữ liệu kinh doanh
        - Hỏi đáp về sản phẩm, tài liệu
        
        Câu hỏi: {message}
        
        Trả lời ngắn gọn, hữu ích, bằng tiếng Việt.
        """)
        
        response = llm.invoke(prompt.format_messages(message=message))
        return response.content
        
    except Exception as e:
        return "Xin chào! Tôi có thể giúp gì cho bạn về hệ thống ERP? Bạn có thể hỏi về doanh thu, tạo dashboard, hoặc phân tích dữ liệu."
