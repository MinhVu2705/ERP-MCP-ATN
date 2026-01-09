"""
Unit tests for analytics endpoints
"""
import pytest

def test_get_revenue(client):
    """Test revenue data endpoint"""
    response = client.get("/api/analytics/revenue")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "month" in data[0]
    assert "revenue" in data[0]

def test_get_kpi(client):
    """Test KPI endpoint"""
    response = client.get("/api/analytics/kpi")
    assert response.status_code == 200
    data = response.json()
    assert "revenue" in data
    assert "profit" in data
    assert "orders" in data
    assert "inventory" in data

def test_get_forecast_data(client):
    """Test forecast data endpoint"""
    response = client.get("/api/analytics/forecast")
    assert response.status_code == 200
    data = response.json()
    assert "period" in data
    assert "forecast" in data
    assert "growth" in data
