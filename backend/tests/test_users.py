import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, auth_headers: dict):
    response = await client.get("/users/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testuser_auth@example.com"
    assert data["name"] == "Auth User"

@pytest.mark.asyncio
async def test_update_current_user(client: AsyncClient, auth_headers: dict):
    update_data = {
        "name": "Updated Me User"
    }
    response = await client.patch("/users/me", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Me User"

    response = await client.get("/users/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Me User"

