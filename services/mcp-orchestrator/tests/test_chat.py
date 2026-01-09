"""
Unit tests for MCP Orchestrator chat endpoints
"""
import pytest
from fastapi.testclient import TestClient

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "MCP Orchestrator"
    assert data["status"] == "running"

def test_chat_endpoint_basic(client, sample_chat_request):
    """Test basic chat functionality"""
    response = client.post("/api/chat/", json=sample_chat_request)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "intent" in data
    assert "confidence" in data

def test_chat_endpoint_validation_error(client):
    """Test chat endpoint with invalid input"""
    response = client.post("/api/chat/", json={})
    assert response.status_code == 422  # Validation error

def test_chat_endpoint_empty_message(client):
    """Test chat endpoint with empty message"""
    response = client.post("/api/chat/", json={"message": ""})
    assert response.status_code == 422  # Validation error
