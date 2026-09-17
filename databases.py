from config import settings
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

DATABASE_URL = settings.database_url

engine = create_async_engine(
    DATABASE_URL,
    echo=True
)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session