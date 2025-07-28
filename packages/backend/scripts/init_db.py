#!/usr/bin/env python3
"""
数据库初始化脚本
"""
import asyncio
import sys
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.database.connection import create_db_and_tables, async_session
from core.database.models import Model, PromptTemplate
import structlog

logger = structlog.get_logger()


async def init_default_data():
    """初始化默认数据"""
    async with async_session() as session:
        # 检查是否已有模型数据
        from sqlalchemy import select
        result = await session.execute(select(Model))
        existing_models = result.scalars().all()
        
        if not existing_models:
            # 创建默认模型
            default_models = [
                Model(
                    name="gpt-4o",
                    provider="openai",
                    version="2024-05-13",
                    input_price_per_1k=0.005,
                    output_price_per_1k=0.015,
                    max_tokens=4096,
                    is_active=True
                ),
                Model(
                    name="gpt-3.5-turbo",
                    provider="openai", 
                    version="0125",
                    input_price_per_1k=0.0005,
                    output_price_per_1k=0.0015,
                    max_tokens=4096,
                    is_active=True
                ),
                Model(
                    name="claude-3-opus-20240229",
                    provider="anthropic",
                    version="20240229",
                    input_price_per_1k=0.015,
                    output_price_per_1k=0.075,
                    max_tokens=4096,
                    is_active=True
                ),
                Model(
                    name="claude-3-sonnet-20240229",
                    provider="anthropic",
                    version="20240229", 
                    input_price_per_1k=0.003,
                    output_price_per_1k=0.015,
                    max_tokens=4096,
                    is_active=True
                ),
            ]
            
            for model in default_models:
                session.add(model)
            
            logger.info(f"Added {len(default_models)} default models")
        
        # 检查是否已有prompt模板数据
        result = await session.execute(select(PromptTemplate))
        existing_templates = result.scalars().all()
        
        if not existing_templates:
            # 创建默认prompt模板
            default_templates = [
                PromptTemplate(
                    type="outline",
                    name="默认大纲生成模板",
                    content="""请根据以下主题生成一个详细的学习大纲：
主题：{{topic}}

要求：
1. 大纲应该包含 4-6 个主要章节
2. 每个章节应该有清晰的学习目标
3. 内容应该由浅入深，循序渐进
4. 适合初学者学习

请以 JSON 格式返回大纲，格式如下：
{
  "chapters": [
    {
      "chapter_number": 1,
      "title": "章节标题",
      "content": "章节内容描述"
    }
  ]
}""",
                    is_default=True,
                    variables=["topic"]
                ),
                PromptTemplate(
                    type="quiz",
                    name="默认题目生成模板", 
                    content="""请根据以下章节内容生成 {{question_count}} 道选择题：
章节标题：{{chapter_title}}
章节内容：{{chapter_content}}

要求：
1. 每道题目应该有 4 个选项（A、B、C、D）
2. 只有一个正确答案
3. 题目难度应该适中
4. 包含答案解析
5. 覆盖章节的关键知识点

请以 JSON 格式返回题目，格式如下：
{
  "quizzes": [
    {
      "question_number": 1,
      "question": "题目内容",
      "options": {
        "A": "选项A",
        "B": "选项B", 
        "C": "选项C",
        "D": "选项D"
      },
      "correct_answer": "A",
      "explanation": "答案解析"
    }
  ]
}""",
                    is_default=True,
                    variables=["chapter_title", "chapter_content", "question_count"]
                ),
            ]
            
            for template in default_templates:
                session.add(template)
                
            logger.info(f"Added {len(default_templates)} default prompt templates")
        
        await session.commit()
        logger.info("Default data initialization completed")


async def init_database():
    """初始化数据库"""
    try:
        logger.info("Starting database initialization...")
        await create_db_and_tables()
        await init_default_data()
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(init_database())