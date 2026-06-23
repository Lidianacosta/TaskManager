from typing import Annotated

from fastapi import Depends, HTTPException
from sqlmodel import select, col

from src.models.base import get_utc_now
from src.models.category import Category
from src.schemas.category import CategoryIn, CategoryUpdate
from src.utils.database import AsyncSessionDep


class CategoryService:
    def __init__(self, session: AsyncSessionDep) -> None:
        self.session = session

    async def create(self, category_in: CategoryIn, user_id: int) -> Category:
        category = Category(**category_in.model_dump(), user_id=user_id)
        self.session.add(category)
        await self.session.commit()
        await self.session.refresh(category)
        return category

    async def read(self, category_id: int, user_id: int) -> Category:
        return await self.__get_by_id(category_id, user_id)

    async def read_all(self, user_id: int, offset: int = 0, limit: int = 100) -> list[Category]:
        statement = select(Category).where(col(Category.user_id) == user_id).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        return list(result.all())

    async def update(self, category_id: int, category_in: CategoryUpdate, user_id: int) -> Category:
        category = await self.__get_by_id(category_id, user_id)
        data = category_in.model_dump(exclude_unset=True)

        for attr, value in data.items():
            setattr(category, attr, value)

        category.updated_at = get_utc_now() # atualiza o campo updated_at para a data e hora atual

        self.session.add(category)
        await self.session.commit()
        await self.session.refresh(category)
        return category

    async def delete(self, category_id: int, user_id: int) -> None:
        category = await self.__get_by_id(category_id, user_id)
        await self.session.delete(category)
        await self.session.commit()

    async def __get_by_id(self, category_id: int, user_id: int) -> Category:
        category = await self.session.get(Category, category_id)
        if not category or category.user_id != user_id:
            raise HTTPException(status_code=404, detail="Category not found") # verificação para garantir que o usuário só acesse suas próprias categorias
        return category


CategoryServiceDep = Annotated[CategoryService, Depends(CategoryService)]
