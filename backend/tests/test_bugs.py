import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_bugs_crud(client: AsyncClient, auth_headers: dict):
    bug_data = {
        "title": "Database connection drop",
        "description": "Connection drops randomly",
        "status": "open",
        "priority": "critical",
        "steps_to_reproduce": "Run 100 concurrent queries",
        "environment": "production"
    }
    response = await client.post("/bugs/", json=bug_data, headers=auth_headers)
    assert response.status_code == 200
    bug = response.json()
    assert bug["title"] == "Database connection drop"
    assert bug["priority"] == "critical"
    bug_id = bug["id"]

    response = await client.get("/bugs/", headers=auth_headers)
    assert response.status_code == 200
    bugs = response.json()
    assert len(bugs) > 0
    assert any(b["id"] == bug_id for b in bugs)

    update_data = {
        "status": "resolved"
    }
    response = await client.patch(f"/bugs/{bug_id}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    updated_bug = response.json()
    assert updated_bug["status"] == "resolved"

    response = await client.delete(f"/bugs/{bug_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Bug deleted successfully"

    response = await client.get("/bugs/", headers=auth_headers)
    bugs = response.json()
    assert not any(b["id"] == bug_id for b in bugs)

