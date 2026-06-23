import pytest
from httpx import AsyncClient

@pytest.fixture
async def test_category(client: AsyncClient, auth_headers: dict) -> dict:
    category_data = {
        "name": "Work",
        "color": "#FF5733"
    }
    response = await client.post("/categories/", json=category_data, headers=auth_headers)
    return response.json()

@pytest.mark.asyncio
async def test_create_category(client: AsyncClient, auth_headers: dict):
    category_data = {
        "name": "Work",
        "color": "#FF5733"
    }
    response = await client.post("/categories/", json=category_data, headers=auth_headers)
    assert response.status_code == 200
    cat = response.json()
    assert cat["name"] == "Work"
    assert cat["color"] == "#FF5733"
    assert "id" in cat

@pytest.mark.asyncio
async def test_get_categories(client: AsyncClient, auth_headers: dict, test_category: dict):
    response = await client.get("/categories/", headers=auth_headers)
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) > 0
    assert any(c["id"] == test_category["id"] for c in categories)

@pytest.mark.asyncio
async def test_update_category(client: AsyncClient, auth_headers: dict, test_category: dict):
    update_data = {
        "name": "Personal",
        "color": "#33FF57"
    }
    response = await client.patch(f"/categories/{test_category['id']}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    updated_cat = response.json()
    assert updated_cat["name"] == "Personal"
    assert updated_cat["color"] == "#33FF57"

@pytest.mark.asyncio
async def test_delete_category(client: AsyncClient, auth_headers: dict, test_category: dict):
    response = await client.delete(f"/categories/{test_category['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Category deleted successfully"

    response = await client.get("/categories/", headers=auth_headers)
    categories = response.json()
    assert not any(c["id"] == test_category["id"] for c in categories)

