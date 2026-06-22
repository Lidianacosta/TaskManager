from typing import Annotated

from fastapi import APIRouter, Depends

from src.models.user import User
from src.schemas.bug import BugIn, BugOut, BugUpdate
from src.services.bug import BugServiceDep
from src.utils.security import get_current_active_user

router = APIRouter(prefix="/bugs", tags=["bugs"])


@router.post("/", response_model=BugOut)
async def create_bug(
    bug_in: BugIn,
    bug_service: BugServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await bug_service.create(bug_in, current_user.id)


@router.get("/", response_model=list[BugOut])
async def read_bugs(
    bug_service: BugServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await bug_service.read_all(current_user.id)


@router.patch("/{bug_id}", response_model=BugOut)
async def update_bug(
    bug_id: int,
    bug_in: BugUpdate,
    bug_service: BugServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await bug_service.update(bug_id, bug_in, current_user.id)


@router.delete("/{bug_id}")
async def delete_bug(
    bug_id: int,
    bug_service: BugServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    await bug_service.delete(bug_id, current_user.id)
    return {"message": "Bug deleted successfully"}
