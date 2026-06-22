from typing import Annotated

from fastapi import Depends, HTTPException
from sqlmodel import select, col

from src.models.base import get_utc_now
from src.models.bug import Bug
from src.schemas.bug import BugIn, BugUpdate
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

    async def read(self, bug_id: int, user_id: int) -> Bug:
        return await self.__get_by_id(bug_id, user_id)

    async def read_all(self, user_id: int, offset: int = 0, limit: int = 100) -> list[Bug]:
        statement = select(Bug).where(col(Bug.user_id) == user_id).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        return list(result.all())

    async def update(self, bug_id: int, bug_in: BugUpdate, user_id: int) -> Bug:
        bug = await self.__get_by_id(bug_id, user_id)
        data = bug_in.model_dump(exclude_unset=True)

        for attr, value in data.items():
            setattr(bug, attr, value)

        bug.updated_at = get_utc_now()

        self.session.add(bug)
        await self.session.commit()
        await self.session.refresh(bug)
        return bug

    async def delete(self, bug_id: int, user_id: int) -> None:
        bug = await self.__get_by_id(bug_id, user_id)
        await self.session.delete(bug)
        await self.session.commit()

    async def __get_by_id(self, bug_id: int, user_id: int) -> Bug:
        bug = await self.session.get(Bug, bug_id)
        if not bug or bug.user_id != user_id:
            raise HTTPException(status_code=404, detail="Bug not found")
        return bug


BugServiceDep = Annotated[BugService, Depends(BugService)]
