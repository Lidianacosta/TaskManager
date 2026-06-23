import pytest
from httpx import AsyncClient

@pytest.fixture
async def user_a_headers(client: AsyncClient) -> dict:
    user_data = {
        "email": "usera@example.com",
        "name": "User A",
        "password": "password123"
    }
    await client.post("/users/", json=user_data)
    login_data = {
        "username": "usera@example.com",
        "password": "password123"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
async def user_b_headers(client: AsyncClient) -> dict:
    user_data = {
        "email": "userb@example.com",
        "name": "User B",
        "password": "password123"
    }
    await client.post("/users/", json=user_data)
    login_data = {
        "username": "userb@example.com",
        "password": "password123"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
async def category_a(client: AsyncClient, user_a_headers: dict) -> dict:
    category_data = {
        "name": "User A Category",
        "color": "#111111"
    }
    response = await client.post("/categories/", json=category_data, headers=user_a_headers)
    return response.json()

@pytest.fixture
async def category_b(client: AsyncClient, user_b_headers: dict) -> dict:
    category_data = {
        "name": "User B Category",
        "color": "#222222"
    }
    response = await client.post("/categories/", json=category_data, headers=user_b_headers)
    return response.json()

@pytest.fixture
async def task_a(client: AsyncClient, user_a_headers: dict, category_a: dict) -> dict:
    task_data = {
        "title": "User A Task",
        "description": "Task for A",
        "status": "todo",
        "priority": "medium",
        "category_id": category_a["id"]
    }
    response = await client.post("/tasks/", json=task_data, headers=user_a_headers)
    return response.json()

@pytest.fixture
async def task_b(client: AsyncClient, user_b_headers: dict, category_b: dict) -> dict:
    task_data = {
        "title": "User B Task",
        "description": "Task for B",
        "status": "todo",
        "priority": "medium",
        "category_id": category_b["id"]
    }
    response = await client.post("/tasks/", json=task_data, headers=user_b_headers)
    return response.json()

# ==================== Relationship & Isolation Tests ====================

@pytest.mark.asyncio
async def test_user_cannot_access_other_user_category(client: AsyncClient, user_a_headers: dict, category_b: dict):
    # User A tries to view User B's category
    response = await client.get("/categories/", headers=user_a_headers)
    categories = response.json()
    assert not any(c["id"] == category_b["id"] for c in categories)

@pytest.mark.asyncio
async def test_user_cannot_update_other_user_category(client: AsyncClient, user_a_headers: dict, category_b: dict):
    # User A tries to update User B's category
    update_data = {"name": "Hacked Category"}
    response = await client.patch(f"/categories/{category_b['id']}", json=update_data, headers=user_a_headers)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_user_cannot_delete_other_user_category(client: AsyncClient, user_a_headers: dict, category_b: dict):
    # User A tries to delete User B's category
    response = await client.delete(f"/categories/{category_b['id']}", headers=user_a_headers)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_user_cannot_access_other_user_task(client: AsyncClient, user_a_headers: dict, task_b: dict):
    # User A tries to view User B's task
    response = await client.get("/tasks/", headers=user_a_headers)
    tasks = response.json()
    assert not any(t["id"] == task_b["id"] for t in tasks)

@pytest.mark.asyncio
async def test_user_cannot_update_other_user_task(client: AsyncClient, user_a_headers: dict, task_b: dict):
    # User A tries to update User B's task
    update_data = {"title": "Hacked Task"}
    response = await client.patch(f"/tasks/{task_b['id']}", json=update_data, headers=user_a_headers)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_user_cannot_delete_other_user_task(client: AsyncClient, user_a_headers: dict, task_b: dict):
    # User A tries to delete User B's task
    response = await client.delete(f"/tasks/{task_b['id']}", headers=user_a_headers)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_deleted_category_unlinks_from_task(client: AsyncClient, user_a_headers: dict, category_a: dict, task_a: dict):
    # Delete the category
    response = await client.delete(f"/categories/{category_a['id']}", headers=user_a_headers)
    assert response.status_code == 200

    # Retrieve tasks and check that category name/color is returned as null (since category doesn't exist anymore)
    response = await client.get("/tasks/", headers=user_a_headers)
    tasks = response.json()
    t = next(task for task in tasks if task["id"] == task_a["id"])
    assert t["category_name"] is None
    assert t["category_color"] is None
