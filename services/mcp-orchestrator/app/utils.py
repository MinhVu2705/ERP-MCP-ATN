"""
Common utilities and helpers
"""
from typing import Optional, Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class APIError(Exception):
    """Custom API error"""
    def __init__(self, message: str, status_code: int = 500, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

def format_currency(amount: float, currency: str = "VND") -> str:
    """Format currency value"""
    if currency == "VND":
        return f"{amount:,.0f} VNĐ"
    return f"{amount:,.2f} {currency}"

def calculate_growth(current: float, previous: float) -> float:
    """Calculate growth percentage"""
    if previous == 0:
        return 0.0
    return ((current - previous) / previous) * 100

def parse_period(period: str) -> Dict[str, Any]:
    """
    Parse period string to start/end dates
    
    Examples:
    - "Q4" -> {"quarter": 4, "year": current_year}
    - "2024-09" -> {"month": 9, "year": 2024}
    - "next_month" -> next month dates
    """
    now = datetime.now()
    
    if period.startswith("Q"):
        quarter = int(period[1])
        return {
            "quarter": quarter,
            "year": now.year,
            "type": "quarter"
        }
    elif "-" in period:
        year, month = period.split("-")
        return {
            "month": int(month),
            "year": int(year),
            "type": "month"
        }
    elif period == "next_month":
        next_month = now.month + 1 if now.month < 12 else 1
        next_year = now.year if now.month < 12 else now.year + 1
        return {
            "month": next_month,
            "year": next_year,
            "type": "month"
        }
    
    return {"type": "unknown"}

def validate_request(data: Dict[str, Any], required_fields: list) -> None:
    """Validate request data has required fields"""
    missing = [field for field in required_fields if field not in data]
    if missing:
        raise APIError(
            f"Missing required fields: {', '.join(missing)}",
            status_code=400
        )
