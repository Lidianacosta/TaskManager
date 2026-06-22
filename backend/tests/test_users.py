import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_users_me_endpoints(client: AsyncClient):
    user_data = {
        "email": "user_me@example.com",
        "name": "Me User",
        "password": "mepassword123"
    }
    await client.post("/users/", json=user_data)

    login_data = {
        "username": "user_me@example.com",
        "password": "mepassword123"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user_me@example.com"
    assert data["name"] == "Me User"

    update_data = {
        "name": "Updated Me User"
    }
    response = await client.patch("/users/me", json=update_data, headers=headers)
    assert response.status_code == 200
    updated_data = response.json()
    assert updated_data["name"] == "Updated Me User"

    response = await client.get("/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Me User"

