from typing import Annotated

from fastapi import APIRouter, Depends

from src.models.user import User
from src.schemas.task import TaskIn, TaskOut, TaskUpdate
from src.services.task import TaskServiceDep
from src.utils.security import get_current_active_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskOut)
async def create_task(
    task_in: TaskIn,
    task_service: TaskServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await task_service.create(task_in)


@router.get("/", response_model=list[TaskOut])
async def read_tasks(
    task_service: TaskServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await task_service.get_tasks_with_category()


@router.patch("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    task_service: TaskServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await task_service.update(task_id, task_in)


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    task_service: TaskServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    await task_service.delete(task_id)
    return {"message": "Task deleted successfully"}
