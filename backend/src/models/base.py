from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


def get_utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(SQLModel, table=False):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)
