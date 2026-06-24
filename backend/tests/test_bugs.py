import pytest
from httpx import AsyncClient

@pytest.fixture
async def test_bug(client: AsyncClient) -> dict:
    bug_data = {
        "title": "Database connection drop",
        "description": "Connection drops randomly"
    }
    response = await client.post("/bugs/", json=bug_data)
    return response.json()

@pytest.mark.asyncio
async def test_create_bug(client: AsyncClient):
    bug_data = {
        "title": "Database connection drop",
        "description": "Connection drops randomly"
    }
    response = await client.post("/bugs/", json=bug_data)
    assert response.status_code == 200
    bug = response.json()
    assert bug["title"] == "Database connection drop"
    assert bug["description"] == "Connection drops randomly"
    assert "id" in bug

@pytest.mark.asyncio
async def test_get_bugs(client: AsyncClient, test_bug: dict):
    response = await client.get("/bugs/")
    assert response.status_code == 200
    bugs = response.json()
    assert len(bugs) > 0
    assert any(b["id"] == test_bug["id"] for b in bugs)

@pytest.mark.asyncio
async def test_create_bug_with_timezone(client: AsyncClient):
    bug_data = {
        "title": "CORS issue in production",
        "description": "Access-Control-Allow-Origin missing",
        "timestamp": "2026-06-24T00:24:06.107Z"
    }
    response = await client.post("/bugs/", json=bug_data)
    assert response.status_code == 200
    bug = response.json()
    assert bug["title"] == "CORS issue in production"
    assert bug["timestamp"] is not None

@pytest.mark.asyncio
async def test_update_bug(client: AsyncClient, test_bug: dict):
    update_data = {
        "title": "Database connection drop updated",
        "description": "Connection drops randomly and is slow",
        "status": "in_progress"
    }
    response = await client.patch(f"/bugs/{test_bug['id']}", json=update_data)
    assert response.status_code == 200
    bug = response.json()
    assert bug["title"] == "Database connection drop updated"
    assert bug["description"] == "Connection drops randomly and is slow"
    assert bug["status"] == "in_progress"

@pytest.mark.asyncio
async def test_delete_bug(client: AsyncClient, test_bug: dict):
    response = await client.delete(f"/bugs/{test_bug['id']}")
    assert response.status_code == 200
    assert response.json()["message"] == "Bug deleted successfully"

    response = await client.get("/bugs/")
    bugs = response.json()
    assert not any(b["id"] == test_bug["id"] for b in bugs)
