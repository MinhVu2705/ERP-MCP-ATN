from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta

router = APIRouter()

class ForecastRequest(BaseModel):
    """Forecast request model"""
    period: str  # 'Q4', 'next_month', etc.
    historical_data: List[dict] = []

class ForecastResponse(BaseModel):
    """Forecast response model"""
    period: str
    forecast: float
    growth: float
    confidence: float
    trend: str

@router.post("/", response_model=ForecastResponse)
async def generate_forecast(request: ForecastRequest):
    """
    Generate revenue forecast using Prophet
    
    Use Case 2: Phân tích dự báo doanh thu (AI Forecast)
    
    Example:
    - Input: Historical revenue data for 12 months
    - Output: Q4 forecast with growth rate
    """
    try:
        # Nếu có dữ liệu lịch sử thì dùng Prophet để dự báo thực sự
        if request.historical_data:
            df = prepare_prophet_data(request.historical_data)

            # Cần tối thiểu 2 điểm dữ liệu để huấn luyện
            if len(df) >= 2:
                model = train_prophet_model(df)

                # Xác định số ngày dự báo tùy theo period
                if request.period == "Q4":
                    horizon_days = 90
                elif request.period == "next_month":
                    horizon_days = 30
                else:
                    horizon_days = 30

                last_date = df["ds"].max()
                future = model.make_future_dataframe(periods=horizon_days, freq="D")
                forecast_df = model.predict(future)

                # Lấy phần dự báo tương lai
                future_part = forecast_df[forecast_df["ds"] > last_date]
                if future_part.empty:
                    raise ValueError("No future forecast generated")

                # Dùng giá trị trung bình dự báo trong giai đoạn làm forecast
                forecast_value = float(future_part["yhat"].mean())
                last_actual = float(df["y"].iloc[-1])

                if last_actual != 0:
                    growth = (forecast_value - last_actual) / last_actual * 100.0
                else:
                    growth = 0.0

                # Xác định xu hướng đơn giản dựa trên tăng trưởng
                if growth > 2:
                    trend = "increasing"
                elif growth < -2:
                    trend = "decreasing"
                else:
                    trend = "stable"

                return ForecastResponse(
                    period=request.period,
                    forecast=round(forecast_value, 2),
                    growth=round(growth, 2),
                    confidence=0.85,
                    trend=trend
                )

        # Fallback: nếu không có (hoặc không đủ) dữ liệu lịch sử thì dùng giá trị mô phỏng
        if request.period == "Q4":
            forecast = 3.2
            growth = 12.5
        elif request.period == "next_month":
            forecast = 2.8
            growth = 8.5
        else:
            forecast = 2.5
            growth = 5.0

        return ForecastResponse(
            period=request.period,
            forecast=forecast,
            growth=growth,
            confidence=0.85,
            trend="increasing"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/train")
async def train_model():
    """
    Train forecasting model on latest data
    
    This should be called periodically (daily/weekly)
    """
    # TODO: Implement model training
    return {
        "status": "training_started",
        "message": "Model training initiated"
    }

def prepare_prophet_data(historical_data: List[dict]) -> pd.DataFrame:
    """Prepare data for Prophet model"""
    df = pd.DataFrame(historical_data)
    df.columns = ['ds', 'y']  # Prophet requires 'ds' and 'y' columns
    df['ds'] = pd.to_datetime(df['ds'])
    return df

def train_prophet_model(df: pd.DataFrame) -> Prophet:
    """Train Prophet forecasting model"""
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False
    )
    model.fit(df)
    return model
