from sqlmodel import Field

from src.models.base import Base


class User(Base, table=True):
    name: str | None
    email: str = Field(unique=True)
    hashed_password: str
