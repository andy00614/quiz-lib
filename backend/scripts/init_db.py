#!/usr/bin/env python3
"""
数据库初始化脚本
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.connection import create_db_and_tables, engine
from app.db.models import Base
from app.core.config import settings
import structlog

logger = structlog.get_logger()


async def init_database():
    """初始化数据库"""
    try:
        logger.info("Starting database initialization...")
        logger.info(f"Database URL: {settings.DATABASE_URL}")
        
        # 创建所有表
        await create_db_and_tables()
        
        # 可以在这里添加初始数据
        await insert_default_data()
        
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    finally:
        await engine.dispose()


async def insert_default_data():
    """插入默认数据"""
    from app.db.connection import async_session
    from app.db.models import Model, PromptTemplate
    
    async with async_session() as session:
        try:
            # 插入默认AI模型
            default_models = [
                {
                    "name": "gpt-4o",
                    "display_name": "GPT-4o",
                    "provider": "openai",
                    "input_price_per_1k": 0.005,
                    "output_price_per_1k": 0.015,
                    "max_tokens": 4096,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-mini", 
                    "display_name": "GPT-4o Mini",
                    "provider": "openai",
                    "input_price_per_1k": 0.00015,
                    "output_price_per_1k": 0.0006,
                    "max_tokens": 16384,
                    "is_active": True
                },
                {
                    "name": "claude-3-5-sonnet-20241022",
                    "display_name": "Claude 3.5 Sonnet",
                    "provider": "anthropic", 
                    "input_price_per_1k": 0.003,
                    "output_price_per_1k": 0.015,
                    "max_tokens": 8192,
                    "is_active": True
                },
                {
                    "name": "gemini-1.5-pro",
                    "display_name": "Gemini 1.5 Pro",
                    "provider": "google",
                    "input_price_per_1k": 0.00125,
                    "output_price_per_1k": 0.005,
                    "max_tokens": 8192,
                    "is_active": True
                }
            ]
            
            for model_data in default_models:
                # 检查模型是否已存在
                existing = await session.get(Model, model_data["name"])
                if not existing:
                    model = Model(**model_data)
                    session.add(model)
            
            # 插入默认Prompt模板
            default_templates = [
                {
                    "name": "默认大纲生成模板",
                    "type": "outline",
                    "content": """请为主题"{{topic}}"生成一个详细的学习大纲。

要求：
1. 大纲应包含3-6个主要章节
2. 每个章节应有清晰的标题和简要说明
3. 内容应循序渐进，从基础到进阶
4. 请以JSON格式返回，格式如下：

```json
{
  "chapters": [
    {
      "chapter_number": 1,
      "title": "章节标题",
      "content": "章节详细内容说明"
    }
  ]
}
```""",
                    "is_default": True
                },
                {
                    "name": "默认题目生成模板", 
                    "type": "quiz",
                    "content": """请根据章节"{{chapter_title}}"的内容生成{{question_count}}道选择题。

章节内容：
{{chapter_content}}

要求：
1. 题目应覆盖章节的重要知识点
2. 每题包含4个选项（A、B、C、D）
3. 提供正确答案和详细解析
4. 难度适中，适合学习者检验掌握情况
5. 请以JSON格式返回，格式如下：

```json
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
      "explanation": "详细解析"
    }
  ]
}
```""",
                    "is_default": True
                }
            ]
            
            for template_data in default_templates:
                # 检查模板是否已存在
                from sqlalchemy import select
                stmt = select(PromptTemplate).where(
                    PromptTemplate.name == template_data["name"]
                )
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    template = PromptTemplate(**template_data)
                    session.add(template)
            
            await session.commit()
            logger.info("Default data inserted successfully")
            
        except Exception as e:
            await session.rollback()
            logger.error(f"Failed to insert default data: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(init_database())