import pytest
from httpx import AsyncClient

@pytest.fixture
async def test_bug(client: AsyncClient, auth_headers: dict) -> dict:
    bug_data = {
        "title": "Database connection drop",
        "description": "Connection drops randomly"
    }
    response = await client.post("/bugs/", json=bug_data, headers=auth_headers)
    return response.json()

@pytest.mark.asyncio
async def test_create_bug(client: AsyncClient, auth_headers: dict):
    bug_data = {
        "title": "Database connection drop",
        "description": "Connection drops randomly"
    }
    response = await client.post("/bugs/", json=bug_data, headers=auth_headers)
    assert response.status_code == 200
    bug = response.json()
    assert bug["title"] == "Database connection drop"
    assert bug["description"] == "Connection drops randomly"
    assert "id" in bug

@pytest.mark.asyncio
async def test_get_bugs(client: AsyncClient, auth_headers: dict, test_bug: dict):
    response = await client.get("/bugs/", headers=auth_headers)
    assert response.status_code == 200
    bugs = response.json()
    assert len(bugs) > 0
    assert any(b["id"] == test_bug["id"] for b in bugs)

