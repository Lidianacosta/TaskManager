from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship

from src.models.base import Base

if TYPE_CHECKING:
    from src.models.task import Task


class Category(Base, table=True):
    name: str
    color: str
    user_id: int = Field(foreign_key="user.id") # adicionada para relacionar a categoria com o usuário
    tasks: list["Task"] = Relationship(back_populates="category")
