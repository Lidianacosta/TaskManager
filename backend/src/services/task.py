from typing import Annotated

from fastapi import Depends, HTTPException
from sqlmodel import select, col

from src.models.base import get_utc_now
from src.models.category import Category
from src.models.task import Task
from src.schemas.task import TaskIn, TaskOut, TaskUpdate
from src.utils.database import AsyncSessionDep


class TaskService:
    def __init__(self, session: AsyncSessionDep) -> None:
        self.session = session

    async def create(self, task_in: TaskIn, user_id: int) -> Task:
        task = Task(**task_in.model_dump(), user_id=user_id)
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def read(self, task_id: int, user_id: int) -> Task:
        return await self.__get_by_id(task_id, user_id)

    async def read_all(self, user_id: int, offset: int = 0, limit: int = 100) -> list[Task]:
        statement = select(Task).where(col(Task.user_id) == user_id).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        return list(result.all())

    async def update(self, task_id: int, task_in: TaskUpdate, user_id: int) -> Task:
        task = await self.__get_by_id(task_id, user_id)
        data = task_in.model_dump(exclude_unset=True)

        for attr, value in data.items():
            setattr(task, attr, value)
        
        task.updated_at = get_utc_now() # atualiza o campo updated_at para a data e hora atual

        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def delete(self, task_id: int, user_id: int) -> None:
        task = await self.__get_by_id(task_id, user_id)
        await self.session.delete(task)
        await self.session.commit()

    async def get_tasks_with_category(self, user_id: int, offset: int = 0, limit: int = 100) -> list[TaskOut]:
        statement = select(Task, Category).join(Category, isouter=True).where(col(Task.user_id) == user_id).offset(offset).limit(limit)
        result = await self.session.exec(statement)

        tasks_out = []
        for task, category in result.all():
            task_dict = task.model_dump()
            if category:
                task_dict["category_name"] = category.name
                task_dict["category_color"] = category.color
            tasks_out.append(TaskOut(**task_dict))

        return tasks_out

    async def __get_by_id(self, task_id: int, user_id: int) -> Task:
        task = await self.session.get(Task, task_id)
        if not task or task.user_id != user_id: # verificação para garantir que o usuário só acesse suas próprias tarefas
            raise HTTPException(status_code=404, detail="Task not found")
        return task


TaskServiceDep = Annotated[TaskService, Depends(TaskService)]
