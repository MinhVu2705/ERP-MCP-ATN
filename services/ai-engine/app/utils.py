"""
Common utilities for AI Engine
"""
import logging
from typing import List, Dict, Any
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)

def clean_data(data: List[Dict]) -> pd.DataFrame:
    """Clean and prepare data for ML models"""
    df = pd.DataFrame(data)
    
    # Remove nulls
    df = df.dropna()
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    return df

def calculate_metrics(predictions: List[float], actuals: List[float]) -> Dict[str, float]:
    """Calculate prediction metrics"""
    predictions = np.array(predictions)
    actuals = np.array(actuals)
    
    mae = np.mean(np.abs(predictions - actuals))
    mse = np.mean((predictions - actuals) ** 2)
    rmse = np.sqrt(mse)
    mape = np.mean(np.abs((predictions - actuals) / actuals)) * 100
    
    return {
        "mae": float(mae),
        "mse": float(mse),
        "rmse": float(rmse),
        "mape": float(mape)
    }

def extract_keywords(text: str, top_n: int = 5) -> List[str]:
    """Extract keywords from text"""
    # Simple implementation - can be enhanced with NLP
    words = text.lower().split()
    # Filter common words
    stop_words = {'là', 'của', 'và', 'có', 'trong', 'cho', 'được', 'the', 'is', 'are', 'a', 'an'}
    keywords = [w for w in words if w not in stop_words and len(w) > 3]
    return keywords[:top_n]

def format_insights(data: Dict[str, Any]) -> List[str]:
    """Generate insights from data analysis"""
    insights = []
    
    # Check for trends
    if 'growth' in data and data['growth'] > 0:
        insights.append(f"Tăng trưởng {data['growth']:.1f}% so với kỳ trước")
    elif 'growth' in data and data['growth'] < 0:
        insights.append(f"Giảm {abs(data['growth']):.1f}% so với kỳ trước")
    
    # Check for thresholds
    if 'profit_margin' in data:
        margin = data['profit_margin']
        if margin > 30:
            insights.append(f"Tỷ suất lợi nhuận cao ({margin:.1f}%)")
        elif margin < 10:
            insights.append(f"Cảnh báo: Tỷ suất lợi nhuận thấp ({margin:.1f}%)")
    
    return insights
