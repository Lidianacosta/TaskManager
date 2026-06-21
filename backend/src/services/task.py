from typing import Annotated

from fastapi import Depends, HTTPException
from sqlmodel import select

from src.models.category import Category
from src.models.task import Task
from src.schemas.task import TaskIn, TaskOut, TaskUpdate
from src.utils.database import AsyncSessionDep


class TaskService:
    def __init__(self, session: AsyncSessionDep) -> None:
        self.session = session

    async def create(self, task_in: TaskIn) -> Task:
        task = Task(**task_in.model_dump())
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def read(self, task_id: int) -> Task:
        return await self.__get_by_id(task_id)

    async def read_all(self, offset: int = 0, limit: int = 100) -> list[Task]:
        statement = select(Task).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        return list(result.all())

    async def update(self, task_id: int, task_in: TaskUpdate) -> Task:
        task = await self.__get_by_id(task_id)
        data = task_in.model_dump(exclude_unset=True)

        for attr, value in data.items():
            setattr(task, attr, value)

        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def delete(self, task_id: int) -> None:
        task = await self.__get_by_id(task_id)
        await self.session.delete(task)
        await self.session.commit()

    async def get_tasks_with_category(
        self, offset: int = 0, limit: int = 100
    ) -> list[TaskOut]:
        statement = (
            select(Task, Category)
            .join(Category, isouter=True)
            .offset(offset)
            .limit(limit)
        )
        result = await self.session.exec(statement)

        tasks_out = []
        for task, category in result.all():
            task_dict = task.model_dump()
            if category:
                task_dict["category_name"] = category.name
                task_dict["category_color"] = category.color
            tasks_out.append(TaskOut(**task_dict))

        return tasks_out

    async def __get_by_id(self, task_id: int) -> Task:
        task = await self.session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task


TaskServiceDep = Annotated[TaskService, Depends(TaskService)]
