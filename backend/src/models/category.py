from typing import TYPE_CHECKING

from sqlmodel import Relationship

from src.models.base import Base

if TYPE_CHECKING:
    from src.models.task import Task


class Category(Base, table=True):
    name: str
    color: str
    tasks: list["Task"] = Relationship(back_populates="category")
