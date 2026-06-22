from datetime import datetime
from typing import Optional

from sqlmodel import Field

from src.models.base import Base


class Bug(Base, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    status: str = Field(default="open")
    priority: str = Field(default="medium")
    steps_to_reproduce: Optional[str] = None
    environment: Optional[str] = None
    version: Optional[str] = None
    url: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: Optional[datetime] = None
    issue_number: Optional[int] = None
    issue_url: Optional[str] = None
    user_id: int = Field(foreign_key="user.id")
