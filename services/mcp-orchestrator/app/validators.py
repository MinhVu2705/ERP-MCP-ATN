"""
Input validation schemas for MCP Orchestrator
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class ChatMessageValidator(BaseModel):
    """Validate chat message"""
    role: str = Field(..., description="Role: user or assistant")
    content: str = Field(..., min_length=1, max_length=5000)
    
    @validator('role')
    def validate_role(cls, v):
        if v not in ['user', 'assistant']:
            raise ValueError('Role must be either "user" or "assistant"')
        return v

class ChatRequestValidator(BaseModel):
    """Validate chat request"""
    message: str = Field(..., min_length=1, max_length=5000)
    conversation_history: Optional[List[ChatMessageValidator]] = []
    
    @validator('conversation_history')
    def validate_history(cls, v):
        if len(v) > 50:
            raise ValueError('Conversation history too long (max 50 messages)')
        return v

class PeriodValidator(BaseModel):
    """Validate period parameter"""
    period: str = Field(..., description="Period: Q1, Q2, Q3, Q4, YYYY-MM, next_month")
    
    @validator('period')
    def validate_period(cls, v):
        # Check quarter format
        if v.startswith('Q'):
            quarter = v[1:]
            if not quarter.isdigit() or int(quarter) not in [1, 2, 3, 4]:
                raise ValueError('Invalid quarter format (use Q1, Q2, Q3, Q4)')
        # Check month format
        elif '-' in v:
            parts = v.split('-')
            if len(parts) != 2:
                raise ValueError('Invalid month format (use YYYY-MM)')
            year, month = parts
            if not year.isdigit() or not month.isdigit():
                raise ValueError('Year and month must be numbers')
            if int(month) < 1 or int(month) > 12:
                raise ValueError('Month must be between 1 and 12')
        # Check special keywords
        elif v not in ['next_month', 'this_month', 'last_month']:
            raise ValueError('Invalid period format')
        
        return v

class ReportRequestValidator(BaseModel):
    """Validate report request"""
    report_type: str = Field(..., description="Report type")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    format: str = Field(default='json', description="Output format")
    
    @validator('report_type')
    def validate_report_type(cls, v):
        allowed_types = ['revenue', 'inventory', 'sales', 'expenses', 'profit']
        if v not in allowed_types:
            raise ValueError(f'Report type must be one of: {", ".join(allowed_types)}')
        return v
    
    @validator('format')
    def validate_format(cls, v):
        if v not in ['json', 'pdf', 'excel', 'csv']:
            raise ValueError('Format must be: json, pdf, excel, or csv')
        return v
