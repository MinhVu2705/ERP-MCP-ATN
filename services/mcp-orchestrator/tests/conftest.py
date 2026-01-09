"""
Test configuration and fixtures
"""
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)

@pytest.fixture
def sample_chat_request():
    """Sample chat request fixture"""
    return {
        "message": "Doanh thu tháng 9 là bao nhiêu?",
        "conversation_history": []
    }

@pytest.fixture
def sample_forecast_data():
    """Sample forecast data fixture"""
    return [
        {"date": "2024-01", "revenue": 1.8},
        {"date": "2024-02", "revenue": 1.9},
        {"date": "2024-03", "revenue": 2.1},
        {"date": "2024-04", "revenue": 2.0},
        {"date": "2024-05", "revenue": 2.3},
        {"date": "2024-06", "revenue": 2.5},
        {"date": "2024-07", "revenue": 2.4},
        {"date": "2024-08", "revenue": 2.6},
        {"date": "2024-09", "revenue": 2.1},
    ]
