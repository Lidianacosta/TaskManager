from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship

from src.models.base import Base

if TYPE_CHECKING:
    from src.models.category import Category


class Task(Base, table=True):
    title: str
    description: Optional[str] = None
    status: str = Field(default="todo")
    priority: str = Field(default="medium")
    due_date: Optional[datetime] = None
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")

    category: Optional["Category"] = Relationship(back_populates="tasks")
