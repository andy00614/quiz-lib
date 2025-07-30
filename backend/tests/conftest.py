import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3

from app.main import app
from app.db.connection import get_session
from app.db.models import Base
from app.core.config.settings import settings


# 测试数据库引擎
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)


# 配置SQLite外键约束
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


@pytest.fixture(scope="session")
def event_loop():
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """创建数据库会话"""
    # 创建所有表
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 创建会话
    async with TestingSessionLocal() as session:
        yield session
    
    # 清理表
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """创建测试客户端"""
    def override_get_session():
        return db_session
    
    app.dependency_overrides[get_session] = override_get_session
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


# 测试数据工厂函数
@pytest.fixture
async def sample_model(db_session: AsyncSession):
    """创建示例模型"""
    from app.db.models import Model
    
    model = Model(
        name="gpt-4",
        display_name="GPT-4",
        provider="openai",
        input_price_per_1k=0.03,
        output_price_per_1k=0.06,
        max_tokens=4096,
        is_active=True
    )
    db_session.add(model)
    await db_session.commit()
    await db_session.refresh(model)
    return model


@pytest.fixture
async def sample_knowledge(db_session: AsyncSession, sample_model):
    """创建示例知识记录"""
    from app.db.models import KnowledgeRecord
    
    knowledge = KnowledgeRecord(
        title="Python基础",
        model_id=sample_model.id,
        temperature=0.7,
        max_tokens=2000,
        top_p=0.9,
        status="pending"
    )
    db_session.add(knowledge)
    await db_session.commit()
    await db_session.refresh(knowledge)
    return knowledge


@pytest.fixture
async def sample_outline(db_session: AsyncSession, sample_knowledge, sample_model):
    """创建示例大纲"""
    from app.db.models import Outline
    
    outline_content = {
        "chapters": [
            {
                "chapter_number": 1,
                "title": "Python简介",
                "content": "Python是一种高级编程语言"
            },
            {
                "chapter_number": 2,
                "title": "数据类型",
                "content": "Python有多种数据类型"
            }
        ]
    }
    
    outline = Outline(
        knowledge_id=sample_knowledge.id,
        content=outline_content,
        raw_response="Generated outline response",
        model_id=sample_model.id,
        prompt_used="Generate outline for Python basics",
        input_tokens=100,
        output_tokens=200,
        response_time_ms=1500,
        cost=0.01
    )
    db_session.add(outline)
    await db_session.commit()
    await db_session.refresh(outline)
    return outline


@pytest.fixture
async def sample_chapter(db_session: AsyncSession, sample_outline):
    """创建示例章节"""
    from app.db.models import Chapter
    
    chapter = Chapter(
        outline_id=sample_outline.id,
        chapter_number=1,
        title="Python简介",
        content="Python是一种高级编程语言，由Guido van Rossum创建",
        quiz_generation_status="pending"
    )
    db_session.add(chapter)
    await db_session.commit()
    await db_session.refresh(chapter)
    return chapter


@pytest.fixture
async def sample_quiz(db_session: AsyncSession, sample_chapter, sample_model):
    """创建示例题目"""
    from app.db.models import Quiz
    
    quiz = Quiz(
        chapter_id=sample_chapter.id,
        question_number=1,
        question="Python是什么时候创建的？",
        options={
            "A": "1989年",
            "B": "1990年", 
            "C": "1991年",
            "D": "1992年"
        },
        correct_answer="C",
        explanation="Python由Guido van Rossum在1991年首次发布",
        model_id=sample_model.id,
        prompt_used="Generate quiz for Python introduction",
        input_tokens=50,
        output_tokens=100,
        response_time_ms=800,
        cost=0.005
    )
    db_session.add(quiz)
    await db_session.commit()
    await db_session.refresh(quiz)
    return quiz