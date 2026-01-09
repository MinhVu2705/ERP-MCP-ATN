"""
Unit tests for Document API search endpoints
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

def test_semantic_search_endpoint(client):
    """Test semantic search"""
    request_data = {
        "query": "What is Product A?",
        "top_k": 5
    }
    response = client.post("/api/search/semantic", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "total" in data

def test_semantic_search_invalid_query(client):
    """Test search with invalid query"""
    request_data = {
        "query": "",
        "top_k": 5
    }
    response = client.post("/api/search/semantic", json=request_data)
    assert response.status_code == 422
