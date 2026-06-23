from datetime import datetime
from typing import Optional

from sqlmodel import Field

from src.models.base import Base


class Bug(Base, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    timestamp: Optional[datetime] = None
