import pytest
from httpx import AsyncClient
import jwt
from src.core.config import settings

@pytest.mark.asyncio
async def test_create_user_and_login(client: AsyncClient):
    user_data = {
        "email": "testuser@example.com",
        "name": "Test User",
        "password": "testpassword123"
    }
    response = await client.post("/users/", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["name"] == user_data["name"]
    assert "id" in data

    login_data = {
        "username": "testuser@example.com",
        "password": "testpassword123"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    login_data = {
        "username": "nonexistent@example.com",
        "password": "somepassword"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

@pytest.mark.asyncio
async def test_login_incorrect_password(client: AsyncClient):
    user_data = {
        "email": "wrongpass@example.com",
        "name": "Wrong Pass User",
        "password": "correctpassword"
    }
    await client.post("/users/", json=user_data)

    login_data = {
        "username": "wrongpass@example.com",
        "password": "incorrectpassword"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Gerenciador de Tarefas API"}

@pytest.mark.asyncio
async def test_security_token_edge_cases(client: AsyncClient):
    headers = {"Authorization": "Bearer invalid_token_format"}
    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

    payload = {"some_other_field": "test"}
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

    payload = {"sub": "nonexistent_email_in_token@example.com"}
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


