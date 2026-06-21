from datetime import datetime

from pydantic import BaseModel


class BugBase(BaseModel):
    title: str
    description: str | None = None
    status: str = "open"
    priority: str = "medium"
    steps_to_reproduce: str | None = None
    environment: str | None = None
    version: str | None = None
    url: str | None = None
    user_agent: str | None = None
    timestamp: datetime | None = None
    issue_number: int | None = None
    issue_url: str | None = None


class BugIn(BugBase):
    pass


class BugUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    steps_to_reproduce: str | None = None
    environment: str | None = None
    version: str | None = None
    url: str | None = None
    user_agent: str | None = None
    timestamp: datetime | None = None
    issue_number: int | None = None
    issue_url: str | None = None


class BugOut(BugBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
