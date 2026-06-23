from typing import Annotated

from fastapi import Depends
from sqlmodel import select
from src.models.bug import Bug
from src.schemas.bug import BugIn
from src.utils.database import AsyncSessionDep


class BugService:
    def __init__(self, session: AsyncSessionDep) -> None:
        self.session = session

    async def create(self, bug_in: BugIn, user_id: int) -> Bug:
        bug = Bug(**bug_in.model_dump(), user_id=user_id)
        self.session.add(bug)
        await self.session.commit()
        await self.session.refresh(bug)
        return bug

    async def read_all(self, offset: int = 0, limit: int = 100) -> list[Bug]:
        statement = select(Bug).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        return list(result.all())


BugServiceDep = Annotated[BugService, Depends(BugService)]
