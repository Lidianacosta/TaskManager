import pytest
from httpx import AsyncClient

@pytest.fixture
async def test_category(client: AsyncClient, auth_headers: dict) -> dict:
    category_data = {
        "name": "Urgent",
        "color": "#FF0000"
    }
    cat_response = await client.post("/categories/", json=category_data, headers=auth_headers)
    return cat_response.json()

@pytest.fixture
async def test_task(client: AsyncClient, auth_headers: dict, test_category: dict) -> dict:
    task_data = {
        "title": "Finish tests",
        "description": "Write and run all integration tests",
        "status": "todo",
        "priority": "high",
        "category_id": test_category["id"]
    }
    response = await client.post("/tasks/", json=task_data, headers=auth_headers)
    return response.json()

@pytest.mark.asyncio
async def test_create_task_with_category(client: AsyncClient, auth_headers: dict, test_category: dict):
    task_data = {
        "title": "Finish tests",
        "description": "Write and run all integration tests",
        "status": "todo",
        "priority": "high",
        "category_id": test_category["id"]
    }
    response = await client.post("/tasks/", json=task_data, headers=auth_headers)
    assert response.status_code == 200
    task = response.json()
    assert task["title"] == "Finish tests"
    assert task["category_id"] == test_category["id"]
    assert "id" in task

@pytest.mark.asyncio
async def test_get_tasks_with_category(client: AsyncClient, auth_headers: dict, test_task: dict):
    response = await client.get("/tasks/", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) > 0
    t = next(task for task in tasks if task["id"] == test_task["id"])
    assert t["category_name"] == "Urgent"
    assert t["category_color"] == "#FF0000"

@pytest.mark.asyncio
async def test_update_task_status_priority(client: AsyncClient, auth_headers: dict, test_task: dict):
    update_data = {
        "status": "done",
        "priority": "low"
    }
    response = await client.patch(f"/tasks/{test_task['id']}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["status"] == "done"
    assert updated_task["priority"] == "low"

@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, auth_headers: dict, test_task: dict):
    response = await client.delete(f"/tasks/{test_task['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted successfully"

    response = await client.get("/tasks/", headers=auth_headers)
    tasks = response.json()
    assert not any(t["id"] == test_task["id"] for t in tasks)

