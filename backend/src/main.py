from contextlib import asynccontextmanager
import subprocess
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.controllers import auth, bugs, categories, tasks, users
from src.core.config import settings
from src.utils.database import async_create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executa na inicialização
    if settings.environment != "testing":
        try:
            # Executa as migrações do Alembic automaticamente no startup
            subprocess.run(
                [sys.executable, "-m", "alembic", "upgrade", "head"],
                check=True
            )
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
