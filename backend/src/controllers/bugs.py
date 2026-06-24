from fastapi import APIRouter

from src.schemas.bug import BugIn, BugOut, BugUpdate
from src.services.bug import BugServiceDep

router = APIRouter(prefix="/bugs", tags=["bugs"])


@router.post("/", response_model=BugOut)
async def create_bug(
    bug_in: BugIn,
    bug_service: BugServiceDep,
):
    return await bug_service.create(bug_in)


@router.get("/", response_model=list[BugOut])
async def read_bugs(
    bug_service: BugServiceDep,
):
    return await bug_service.read_all()


@router.patch("/{bug_id}", response_model=BugOut)
async def update_bug(
    bug_id: int,
    bug_in: BugUpdate,
    bug_service: BugServiceDep,
):
    return await bug_service.update(bug_id, bug_in)


@router.delete("/{bug_id}")
async def delete_bug(
    bug_id: int,
    bug_service: BugServiceDep,
):
    await bug_service.delete(bug_id)
    return {"message": "Bug deleted successfully"}

