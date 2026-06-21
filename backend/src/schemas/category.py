from datetime import datetime

from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    color: str


class CategoryIn(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    color: str | None = None


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
