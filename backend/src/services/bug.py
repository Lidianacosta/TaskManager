from datetime import timezone
from typing import Annotated

from fastapi import Depends, HTTPException
from sqlmodel import select
from src.models.base import get_utc_now
from src.models.bug import Bug
from src.schemas.bug import BugIn, BugUpdate
from src.utils.database import AsyncSessionDep


class BugService:
    def __init__(self, session: AsyncSessionDep) -> None:
        self.session = session

    async def create(self, bug_in: BugIn) -> Bug:
        data = bug_in.model_dump()
        if data.get("timestamp") and data["timestamp"].tzinfo is not None:
            data["timestamp"] = data["timestamp"].astimezone(timezone.utc).replace(tzinfo=None)
        bug = Bug(**data)
        self.session.add(bug)
        await self.session.commit()
        await self.session.refresh(bug)
        return bug

    async def read_all(self, offset: int = 0, limit: int = 100) -> list[Bug]:
        statement = select(Bug).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        return list(result.all())

    async def update(self, bug_id: int, bug_in: BugUpdate) -> Bug:
        bug = await self.session.get(Bug, bug_id)
        if not bug:
            raise HTTPException(status_code=404, detail="Bug not found")
        data = bug_in.model_dump(exclude_unset=True)
        if data.get("timestamp") and data["timestamp"].tzinfo is not None:
            data["timestamp"] = data["timestamp"].astimezone(timezone.utc).replace(tzinfo=None)
        for attr, value in data.items():
            setattr(bug, attr, value)
        bug.updated_at = get_utc_now()
        self.session.add(bug)
        await self.session.commit()
        await self.session.refresh(bug)
        return bug

    async def delete(self, bug_id: int) -> None:
        bug = await self.session.get(Bug, bug_id)
        if not bug:
            raise HTTPException(status_code=404, detail="Bug not found")
        await self.session.delete(bug)
        await self.session.commit()


BugServiceDep = Annotated[BugService, Depends(BugService)]
