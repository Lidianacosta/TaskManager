import pytest
from fastapi import HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.services.user import UserService
from src.services.bug import BugService
from src.services.category import CategoryService
from src.services.task import TaskService
from src.schemas.user import UserIn, UserUpdate
from src.schemas.bug import BugIn
from src.schemas.category import CategoryIn
from src.schemas.task import TaskIn

@pytest.fixture
async def db_session() -> AsyncSession:
    from src.utils.database import async_engine
    async with AsyncSession(async_engine) as session:
        yield session

@pytest.mark.asyncio
async def test_user_service_methods(db_session: AsyncSession):
    user_service = UserService(db_session)
    
    user_in = UserIn(email="service_user@example.com", name="Service User", password="password123")
    user = await user_service.create(user_in)
    assert user.email == "service_user@example.com"
    
    read_user = await user_service.read(user.id)
    assert read_user.name == "Service User"
    
    users = await user_service.read_all()
    assert len(users) > 0
    
    update_in = UserUpdate(password="newpassword123", name="New Name")
    updated_user = await user_service.update(user.id, update_in)
    assert updated_user.name == "New Name"
    
    await user_service.delete(user.id)
    with pytest.raises(HTTPException) as exc_info:
        await user_service.read(user.id)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "User not found"

@pytest.mark.asyncio
async def test_bug_service_methods(db_session: AsyncSession):
    bug_service = BugService(db_session)
    
    bug_in = BugIn(title="Svc Bug", description="Desc", status="open", priority="high")
    bug = await bug_service.create(bug_in)
    assert bug.title == "Svc Bug"
    
    read_bug = await bug_service.read(bug.id)
    assert read_bug.description == "Desc"
    
    with pytest.raises(HTTPException) as exc_info:
        await bug_service.read(9999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Bug not found"

@pytest.mark.asyncio
async def test_category_service_methods(db_session: AsyncSession):
    cat_service = CategoryService(db_session)
    
    cat_in = CategoryIn(name="Svc Cat", color="#123456")
    cat = await cat_service.create(cat_in)
    assert cat.name == "Svc Cat"
    
    read_cat = await cat_service.read(cat.id)
    assert read_cat.color == "#123456"
    
    with pytest.raises(HTTPException) as exc_info:
        await cat_service.read(9999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Category not found"

@pytest.mark.asyncio
async def test_task_service_methods(db_session: AsyncSession):
    task_service = TaskService(db_session)
    
    task_in = TaskIn(title="Svc Task", description="Desc", status="todo", priority="medium")
    task = await task_service.create(task_in)
    assert task.title == "Svc Task"
    
    read_task = await task_service.read(task.id)
    assert read_task.description == "Desc"
    
    tasks = await task_service.read_all()
    assert len(tasks) > 0
    
    with pytest.raises(HTTPException) as exc_info:
        await task_service.read(9999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Task not found"

