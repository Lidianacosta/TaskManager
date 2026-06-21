from typing import Annotated

from fastapi import APIRouter, Depends

from src.models.user import User
from src.schemas.category import CategoryIn, CategoryOut, CategoryUpdate
from src.services.category import CategoryServiceDep
from src.utils.security import get_current_active_user

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=CategoryOut)
async def create_category(
    category_in: CategoryIn,
    category_service: CategoryServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await category_service.create(category_in)


@router.get("/", response_model=list[CategoryOut])
async def read_categories(
    category_service: CategoryServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await category_service.read_all()


@router.patch("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    category_service: CategoryServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return await category_service.update(category_id, category_in)


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    category_service: CategoryServiceDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    await category_service.delete(category_id)
    return {"message": "Category deleted successfully"}
