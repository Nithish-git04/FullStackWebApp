from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app
from databases import get_session as real_get_session
from routers.auth import get_current_user as real_get_current_user
from models import User

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False
)

async def get_session():
    async with AsyncSession(test_engine) as session:
        yield session


async def fake_get_current_user():
    return User(username="Nithish123", password="Nithish**0405")

@pytest_asyncio.fixture
async def prepare_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

@pytest_asyncio.fixture
async def client(prepare_database):
    app.dependency_overrides[real_get_session] = get_session
    app.dependency_overrides[real_get_current_user] = fake_get_current_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()