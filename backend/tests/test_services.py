import pytest
from fastapi import HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.services.user import UserService
from src.services.bug import BugService
from src.services.category import CategoryService
from src.services.task import TaskService
from src.schemas.user import UserIn, UserUpdate
from src.schemas.bug import BugIn
from src.schemas.category import CategoryIn, CategoryUpdate
from src.schemas.task import TaskIn, TaskUpdate

@pytest.fixture
async def db_session() -> AsyncSession:
    from src.utils.database import async_engine
    async with AsyncSession(async_engine, expire_on_commit=False) as session:
        yield session

@pytest.fixture
async def service_user(db_session: AsyncSession):
    user_service = UserService(db_session)
    user_in = UserIn(email="svc_user@example.com", name="Svc User", password="password123")
    return await user_service.create(user_in)

@pytest.fixture
async def service_category(db_session: AsyncSession, service_user):
    cat_service = CategoryService(db_session)
    cat_in = CategoryIn(name="Svc Cat", color="#123456")
    return await cat_service.create(cat_in, service_user.id)

@pytest.fixture
async def service_task(db_session: AsyncSession, service_user, service_category):
    task_service = TaskService(db_session)
    task_in = TaskIn(title="Svc Task", description="Desc", status="todo", priority="medium", category_id=service_category.id)
    return await task_service.create(task_in, service_user.id)

# ==================== User Service Tests ====================

@pytest.mark.asyncio
async def test_user_service_create(db_session: AsyncSession):
    user_service = UserService(db_session)
    user_in = UserIn(email="create_user@example.com", name="Create User", password="password123")
    user = await user_service.create(user_in)
    assert user.email == "create_user@example.com"
    assert user.name == "Create User"
    assert user.hashed_password != "password123"

@pytest.mark.asyncio
async def test_user_service_read(db_session: AsyncSession, service_user):
    user_service = UserService(db_session)
    read_user = await user_service.read(service_user.id)
    assert read_user.email == service_user.email
    assert read_user.name == service_user.name

@pytest.mark.asyncio
async def test_user_service_read_nonexistent(db_session: AsyncSession):
    user_service = UserService(db_session)
    with pytest.raises(HTTPException) as exc_info:
        await user_service.read(9999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "User not found"

@pytest.mark.asyncio
async def test_user_service_read_all(db_session: AsyncSession, service_user):
    user_service = UserService(db_session)
    users = await user_service.read_all()
    assert len(users) > 0
    assert any(u.id == service_user.id for u in users)

@pytest.mark.asyncio
async def test_user_service_update(db_session: AsyncSession, service_user):
    user_service = UserService(db_session)
    update_in = UserUpdate(password="newpassword123", name="New Name")
    updated_user = await user_service.update(service_user.id, update_in)
    assert updated_user.name == "New Name"

@pytest.mark.asyncio
async def test_user_service_delete(db_session: AsyncSession, service_user):
    user_service = UserService(db_session)
    await user_service.delete(service_user.id)
    with pytest.raises(HTTPException) as exc_info:
        await user_service.read(service_user.id)
    assert exc_info.value.status_code == 404

# ==================== Bug Service Tests ====================

@pytest.mark.asyncio
async def test_bug_service_create(db_session: AsyncSession, service_user):
    bug_service = BugService(db_session)
    bug_in = BugIn(title="Svc Bug", description="Desc")
    bug = await bug_service.create(bug_in, service_user.id)
    assert bug.title == "Svc Bug"
    assert bug.description == "Desc"

@pytest.mark.asyncio
async def test_bug_service_read_all(db_session: AsyncSession, service_user):
    bug_service = BugService(db_session)
    bug_in = BugIn(title="Svc Bug 2", description="Desc 2")
    bug = await bug_service.create(bug_in, service_user.id)
    bugs = await bug_service.read_all()
    assert len(bugs) > 0
    assert any(b.id == bug.id for b in bugs)

# ==================== Category Service Tests ====================

@pytest.mark.asyncio
async def test_category_service_create(db_session: AsyncSession, service_user):
    cat_service = CategoryService(db_session)
    cat_in = CategoryIn(name="Svc Cat 2", color="#654321")
    cat = await cat_service.create(cat_in, service_user.id)
    assert cat.name == "Svc Cat 2"
    assert cat.color == "#654321"

@pytest.mark.asyncio
async def test_category_service_read(db_session: AsyncSession, service_user, service_category):
    cat_service = CategoryService(db_session)
    read_cat = await cat_service.read(service_category.id, service_user.id)
    assert read_cat.name == service_category.name
    assert read_cat.color == service_category.color

@pytest.mark.asyncio
async def test_category_service_read_nonexistent(db_session: AsyncSession, service_user):
    cat_service = CategoryService(db_session)
    with pytest.raises(HTTPException) as exc_info:
        await cat_service.read(9999, service_user.id)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Category not found"

@pytest.mark.asyncio
async def test_category_service_read_all(db_session: AsyncSession, service_user, service_category):
    cat_service = CategoryService(db_session)
    categories = await cat_service.read_all(service_user.id)
    assert len(categories) > 0
    assert any(c.id == service_category.id for c in categories)

@pytest.mark.asyncio
async def test_category_service_update(db_session: AsyncSession, service_user, service_category):
    cat_service = CategoryService(db_session)
    update_in = CategoryUpdate(name="Updated Name", color="#000000")
    updated_cat = await cat_service.update(service_category.id, update_in, service_user.id)
    assert updated_cat.name == "Updated Name"
    assert updated_cat.color == "#000000"

@pytest.mark.asyncio
async def test_category_service_delete(db_session: AsyncSession, service_user, service_category):
    cat_service = CategoryService(db_session)
    await cat_service.delete(service_category.id, service_user.id)
    with pytest.raises(HTTPException) as exc_info:
        await cat_service.read(service_category.id, service_user.id)
    assert exc_info.value.status_code == 404

# ==================== Task Service Tests ====================

@pytest.mark.asyncio
async def test_task_service_create(db_session: AsyncSession, service_user, service_category):
    task_service = TaskService(db_session)
    task_in = TaskIn(title="Svc Task 2", description="Desc 2", status="todo", priority="medium", category_id=service_category.id)
    task = await task_service.create(task_in, service_user.id)
    assert task.title == "Svc Task 2"
    assert task.category_id == service_category.id

@pytest.mark.asyncio
async def test_task_service_read(db_session: AsyncSession, service_user, service_task):
    task_service = TaskService(db_session)
    read_task = await task_service.read(service_task.id, service_user.id)
    assert read_task.title == service_task.title

@pytest.mark.asyncio
async def test_task_service_read_nonexistent(db_session: AsyncSession, service_user):
    task_service = TaskService(db_session)
    with pytest.raises(HTTPException) as exc_info:
        await task_service.read(9999, service_user.id)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Task not found"

@pytest.mark.asyncio
async def test_task_service_read_all(db_session: AsyncSession, service_user, service_task):
    task_service = TaskService(db_session)
    tasks = await task_service.read_all(service_user.id)
    assert len(tasks) > 0
    assert any(t.id == service_task.id for t in tasks)

@pytest.mark.asyncio
async def test_task_service_update(db_session: AsyncSession, service_user, service_task):
    task_service = TaskService(db_session)
    update_in = TaskUpdate(title="Updated Title", status="in_progress")
    updated_task = await task_service.update(service_task.id, update_in, service_user.id)
    assert updated_task.title == "Updated Title"
    assert updated_task.status == "in_progress"

@pytest.mark.asyncio
async def test_task_service_delete(db_session: AsyncSession, service_user, service_task):
    task_service = TaskService(db_session)
    await task_service.delete(service_task.id, service_user.id)
    with pytest.raises(HTTPException) as exc_info:
        await task_service.read(service_task.id, service_user.id)
    assert exc_info.value.status_code == 404
