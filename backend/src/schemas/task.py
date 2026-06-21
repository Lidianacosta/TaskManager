from datetime import datetime

from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    status: str = "todo"
    priority: str = "medium"
    due_date: datetime | None = None
    category_id: int | None = None


class TaskIn(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    due_date: datetime | None = None
    category_id: int | None = None


class TaskOut(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category_name: str | None = None
    category_color: str | None = None

    class Config:
        from_attributes = True
