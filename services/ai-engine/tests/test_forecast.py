"""
Unit tests for AI Engine forecast endpoints
"""
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_forecast_endpoint(client):
    """Test forecast generation"""
    request_data = {
        "period": "Q4",
        "historical_data": []
    }
    response = client.post("/api/forecast/", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "forecast" in data
    assert "growth" in data
    assert "confidence" in data
    assert data["period"] == "Q4"

def test_forecast_invalid_period(client):
    """Test forecast with invalid period"""
    request_data = {
        "period": "",
        "historical_data": []
    }
    response = client.post("/api/forecast/", json=request_data)
    assert response.status_code == 422
