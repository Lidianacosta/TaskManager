from typing import Annotated

from fastapi import APIRouter, Depends

from src.models.user import User
from src.schemas.user import UserIn, UserOut, UserUpdate
from src.services.user import UserServiceDep
from src.utils.security import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserOut)
async def create_user(user_in: UserIn, user_service: UserServiceDep):
    return await user_service.create(user_in)


@router.get("/me", response_model=UserOut)
async def read_user_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@router.patch("/me", response_model=UserOut)
async def update_user_me(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    user_service: UserServiceDep,
):
    return await user_service.update(current_user.id, user_update)
