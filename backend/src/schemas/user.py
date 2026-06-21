from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str | None = None
    email: EmailStr


class UserIn(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = None


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True
