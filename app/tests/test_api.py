from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "threshold" in data
    assert data["threshold"] == 0.10

def test_root_docs_url():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "HealthGluco API"
