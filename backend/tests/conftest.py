from src.utils.database import async_engine
from src.main import app
from sqlmodel import SQLModel
import os
import pytest
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport

os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///test_db.sqlite"


@pytest.fixture(autouse=True)
async def setup_test_database():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    await async_engine.dispose()

    if os.path.exists("test_db.sqlite"):
        try:
            os.remove("test_db.sqlite")
        except Exception:
            pass


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="https://test",
        headers={"Content-Type": "application/json"}
    ) as ac:
        yield ac


@pytest.fixture
async def auth_headers(client: AsyncClient) -> dict:
    user_data = {
        "email": "testuser_auth@example.com",
        "name": "Auth User",
        "password": "authpassword123"
    }
    await client.post("/users/", json=user_data)

    login_data = {
        "username": "testuser_auth@example.com",
        "password": "authpassword123"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
