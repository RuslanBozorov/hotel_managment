"""
Backend Smoke Tests for HotelPro API
Run with: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestHealthAndRoot:
    """Test basic API availability."""

    def test_root_endpoint(self):
        """API root should return welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "HotelPro" in data["message"]

    def test_health_endpoint(self):
        """Health check should return healthy status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestServicesAPI:
    """Test Services CRUD endpoints."""

    def test_get_services(self):
        """GET /services should return a list."""
        response = client.get("/services")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_and_delete_service(self):
        """POST /services should create, DELETE should remove."""
        payload = {
            "title_en": "Test Service",
            "title_ru": "Тест Сервис",
            "desc_en": "Test description",
            "desc_ru": "Тест описание",
            "icon": "test-icon",
            "is_popular": False,
        }
        # Create
        res = client.post("/services", json=payload)
        assert res.status_code == 200
        created = res.json()
        assert created["title_en"] == "Test Service"
        service_id = created["id"]

        # Delete
        del_res = client.delete(f"/services/{service_id}")
        assert del_res.status_code == 200


class TestCategoriesAPI:
    """Test Categories endpoints."""

    def test_get_categories(self):
        """GET /categories should return a list."""
        response = client.get("/categories")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestProjectsAPI:
    """Test Projects endpoints."""

    def test_get_projects(self):
        """GET /projects should return a list."""
        response = client.get("/projects")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestValidation:
    """Test Pydantic validation layer."""

    def test_invalid_application_phone(self):
        """Application with invalid phone should fail."""
        payload = {
            "fullname": "Test User",
            "phone": "abc",
            "email": "test@test.com",
        }
        res = client.post("/applications", json=payload)
        assert res.status_code == 422  # Validation error

    def test_invalid_email_format(self):
        """Application with invalid email should fail."""
        payload = {
            "fullname": "Test User",
            "phone": "+998901234567",
            "email": "not-an-email",
        }
        res = client.post("/applications", json=payload)
        assert res.status_code == 422
