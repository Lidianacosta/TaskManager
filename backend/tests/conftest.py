import os
import pytest
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport

os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///test_db.sqlite"

from sqlmodel import SQLModel
from src.main import app
from src.utils.database import async_engine

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
        base_url="http://test",
        headers={"Content-Type": "application/json"}
    ) as ac:
        yield ac




