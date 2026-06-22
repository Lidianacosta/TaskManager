import pytest
from httpx import AsyncClient

@pytest.fixture
async def auth_headers(client: AsyncClient) -> dict:
    user_data = {
        "email": "tasks_user@example.com",
        "name": "Tasks User",
        "password": "taskpassword123"
    }
    await client.post("/users/", json=user_data)
    
    login_data = {
        "username": "tasks_user@example.com",
        "password": "taskpassword123"
    }
    response = await client.post("/auth/token", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_tasks_crud_with_category(client: AsyncClient, auth_headers: dict):
    category_data = {
        "name": "Urgent",
        "color": "#FF0000"
    }
    cat_response = await client.post("/categories/", json=category_data, headers=auth_headers)
    cat_id = cat_response.json()["id"]

    task_data = {
        "title": "Finish tests",
        "description": "Write and run all integration tests",
        "status": "todo",
        "priority": "high",
        "category_id": cat_id
    }
    response = await client.post("/tasks/", json=task_data, headers=auth_headers)
    assert response.status_code == 200
    task = response.json()
    assert task["title"] == "Finish tests"
    assert task["category_id"] == cat_id
    task_id = task["id"]

    response = await client.get("/tasks/", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0
    test_task = next(t for t in tasks if t["id"] == task_id)
    assert test_task["category_name"] == "Urgent"
    assert test_task["category_color"] == "#FF0000"

    update_data = {
        "status": "done",
        "priority": "low"
    }
    response = await client.patch(f"/tasks/{task_id}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["status"] == "done"
    assert updated_task["priority"] == "low"

    response = await client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted successfully"

    response = await client.get("/tasks/", headers=auth_headers)
    tasks = response.json()
    assert not any(t["id"] == task_id for t in tasks)

