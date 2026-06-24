import asyncio
from contextlib import asynccontextmanager
import subprocess
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.controllers import auth, bugs, categories, tasks, users
from src.core.config import settings
from src.utils.database import async_create_db_and_tables


def check_tables(connection) -> tuple[bool, bool]:
    from sqlalchemy import inspect
    inspector = inspect(connection)
    tables = inspector.get_table_names()
    return "user" in tables, "alembic_version" in tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executa na inicialização
    if settings.environment != "testing":
        try:
            # Verifica se as tabelas já existem sem controle do Alembic
            from src.utils.database import async_engine
            async with async_engine.connect() as conn:
                user_exists, alembic_exists = await conn.run_sync(check_tables)
            
            if user_exists and not alembic_exists:
                print("Database tables exist but alembic_version is missing. Stamping with initial revision...")
                proc = await asyncio.create_subprocess_exec(
                    sys.executable, "-m", "alembic", "stamp", "997a64ea1549"
                )
                await proc.wait()
                if proc.returncode != 0:
                    raise RuntimeError(f"Alembic stamp failed with exit status {proc.returncode}")

            # Executa as migrações do Alembic automaticamente no startup
            proc = await asyncio.create_subprocess_exec(
                sys.executable, "-m", "alembic", "upgrade", "head"
            )
            await proc.wait()
            if proc.returncode != 0:
                raise RuntimeError(f"Alembic upgrade failed with exit status {proc.returncode}")
        except Exception as e:
            print(f"Error running database migrations: {e}")
            raise e
    else:
        await async_create_db_and_tables()
    yield
    # Executa na finalização


app = FastAPI(
    title="Gerenciador de Tarefas API",
    description="API para gerenciamento de tarefas, categorias e bugs.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajuste para o domínio do frontend em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(tasks.router)
app.include_router(bugs.router)


@app.get("/")
def root():
    return {"message": "Welcome to Gerenciador de Tarefas API"}
