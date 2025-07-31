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
                # OpenAI GPT-4.1 系列
                {
                    "name": "gpt-4.1",
                    "display_name": "GPT-4.1",
                    "provider": "openai",
                    "version": "2025-04-14",
                    "description": "OpenAI最新的旗舰模型，具有出色的推理能力",
                    "input_price_per_1m": 2.00,
                    "output_price_per_1m": 8.00,
                    "cached_input_price_per_1m": 0.50,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4.1-mini",
                    "display_name": "GPT-4.1 Mini",
                    "provider": "openai",
                    "version": "2025-04-14",
                    "description": "GPT-4.1的轻量版本，性价比更高",
                    "input_price_per_1m": 0.40,
                    "output_price_per_1m": 1.60,
                    "cached_input_price_per_1m": 0.10,
                    "max_tokens": 16384,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4.1-nano",
                    "display_name": "GPT-4.1 Nano",
                    "provider": "openai",
                    "version": "2025-04-14",
                    "description": "最轻量的GPT-4.1版本，适合大规模调用",
                    "input_price_per_1m": 0.10,
                    "output_price_per_1m": 0.40,
                    "cached_input_price_per_1m": 0.025,
                    "max_tokens": 16384,
                    "context_window": 128000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                # OpenAI GPT-4.5 系列
                {
                    "name": "gpt-4.5-preview",
                    "display_name": "GPT-4.5 Preview",
                    "provider": "openai",
                    "version": "2025-02-27",
                    "description": "GPT-4.5的预览版本，具有更强的推理能力",
                    "input_price_per_1m": 75.00,
                    "output_price_per_1m": 150.00,
                    "cached_input_price_per_1m": 37.50,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                # OpenAI GPT-4o 系列
                {
                    "name": "gpt-4o",
                    "display_name": "GPT-4o",
                    "provider": "openai",
                    "version": "2024-08-06",
                    "description": "GPT-4的优化版本，速度更快",
                    "input_price_per_1m": 2.50,
                    "output_price_per_1m": 10.00,
                    "cached_input_price_per_1m": 1.25,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-audio-preview",
                    "display_name": "GPT-4o Audio Preview",
                    "provider": "openai",
                    "version": "2025-06-03",
                    "description": "支持音频输入的GPT-4o预览版",
                    "input_price_per_1m": 2.50,
                    "output_price_per_1m": 10.00,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-realtime-preview",
                    "display_name": "GPT-4o Realtime Preview",
                    "provider": "openai",
                    "version": "2025-06-03",
                    "description": "支持实时音频对话的GPT-4o",
                    "input_price_per_1m": 5.00,
                    "output_price_per_1m": 20.00,
                    "cached_input_price_per_1m": 2.50,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-mini",
                    "display_name": "GPT-4o Mini",
                    "provider": "openai",
                    "version": "2024-07-18",
                    "description": "GPT-4o的轻量版本，性价比极高",
                    "input_price_per_1m": 0.15,
                    "output_price_per_1m": 0.60,
                    "cached_input_price_per_1m": 0.075,
                    "max_tokens": 16384,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-mini-audio-preview",
                    "display_name": "GPT-4o Mini Audio Preview",
                    "provider": "openai",
                    "version": "2024-12-17",
                    "description": "支持音频的GPT-4o Mini版本",
                    "input_price_per_1m": 0.15,
                    "output_price_per_1m": 0.60,
                    "max_tokens": 16384,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-mini-realtime-preview",
                    "display_name": "GPT-4o Mini Realtime Preview",
                    "provider": "openai",
                    "version": "2024-12-17",
                    "description": "支持实时音频的GPT-4o Mini版本",
                    "input_price_per_1m": 0.60,
                    "output_price_per_1m": 2.40,
                    "cached_input_price_per_1m": 0.30,
                    "max_tokens": 16384,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                # OpenAI o1 系列（推理模型）
                {
                    "name": "o1",
                    "display_name": "o1",
                    "provider": "openai",
                    "version": "2024-12-17",
                    "description": "专门用于复杂推理任务的模型",
                    "input_price_per_1m": 15.00,
                    "output_price_per_1m": 60.00,
                    "cached_input_price_per_1m": 7.50,
                    "max_tokens": 100000,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o1-pro",
                    "display_name": "o1 Pro",
                    "provider": "openai",
                    "version": "2025-03-19",
                    "description": "o1系列的专业版本，推理能力更强",
                    "input_price_per_1m": 150.00,
                    "output_price_per_1m": 600.00,
                    "max_tokens": 100000,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o3-pro",
                    "display_name": "o3 Pro",
                    "provider": "openai",
                    "version": "2025-06-10",
                    "description": "o3系列专业版本，具有顶级推理能力",
                    "input_price_per_1m": 20.00,
                    "output_price_per_1m": 80.00,
                    "max_tokens": 100000,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o3",
                    "display_name": "o3",
                    "provider": "openai",
                    "version": "2025-04-16",
                    "description": "o3系列标准版本",
                    "input_price_per_1m": 2.00,
                    "output_price_per_1m": 8.00,
                    "cached_input_price_per_1m": 0.50,
                    "max_tokens": 100000,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o3-deep-research",
                    "display_name": "o3 Deep Research",
                    "provider": "openai",
                    "version": "2025-06-26",
                    "description": "专门用于深度研究的o3版本",
                    "input_price_per_1m": 10.00,
                    "output_price_per_1m": 40.00,
                    "cached_input_price_per_1m": 2.50,
                    "max_tokens": 100000,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o4-mini",
                    "display_name": "o4 Mini",
                    "provider": "openai",
                    "version": "2025-04-16",
                    "description": "o4系列的轻量版本",
                    "input_price_per_1m": 1.10,
                    "output_price_per_1m": 4.40,
                    "cached_input_price_per_1m": 0.275,
                    "max_tokens": 65536,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o4-mini-deep-research",
                    "display_name": "o4 Mini Deep Research",
                    "provider": "openai",
                    "version": "2025-06-26",
                    "description": "用于深度研究的o4 Mini版本",
                    "input_price_per_1m": 2.00,
                    "output_price_per_1m": 8.00,
                    "cached_input_price_per_1m": 0.50,
                    "max_tokens": 65536,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o3-mini",
                    "display_name": "o3 Mini",
                    "provider": "openai",
                    "version": "2025-01-31",
                    "description": "o3系列的轻量版本",
                    "input_price_per_1m": 1.10,
                    "output_price_per_1m": 4.40,
                    "cached_input_price_per_1m": 0.55,
                    "max_tokens": 65536,
                    "context_window": 200000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                {
                    "name": "o1-mini",
                    "display_name": "o1 Mini",
                    "provider": "openai",
                    "version": "2024-09-12",
                    "description": "o1系列的轻量版本",
                    "input_price_per_1m": 1.10,
                    "output_price_per_1m": 4.40,
                    "cached_input_price_per_1m": 0.55,
                    "max_tokens": 65536,
                    "context_window": 128000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                # Codex 系列
                {
                    "name": "codex-mini-latest",
                    "display_name": "Codex Mini Latest",
                    "provider": "openai",
                    "description": "专门用于代码生成的轻量模型",
                    "input_price_per_1m": 1.50,
                    "output_price_per_1m": 6.00,
                    "cached_input_price_per_1m": 0.375,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": False,
                    "supports_audio": False,
                    "supports_function_calling": False,
                    "is_active": True
                },
                # 搜索优化模型
                {
                    "name": "gpt-4o-mini-search-preview",
                    "display_name": "GPT-4o Mini Search Preview",
                    "provider": "openai",
                    "version": "2025-03-11",
                    "description": "针对搜索任务优化的GPT-4o Mini",
                    "input_price_per_1m": 0.15,
                    "output_price_per_1m": 0.60,
                    "max_tokens": 16384,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gpt-4o-search-preview",
                    "display_name": "GPT-4o Search Preview",
                    "provider": "openai",
                    "version": "2025-03-11",
                    "description": "针对搜索任务优化的GPT-4o",
                    "input_price_per_1m": 2.50,
                    "output_price_per_1m": 10.00,
                    "max_tokens": 4096,
                    "context_window": 128000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                
                # Google Gemini 系列
                {
                    "name": "gemini-2.5-flash-lite",
                    "display_name": "Gemini 2.5 Flash Lite",
                    "provider": "google",
                    "description": "Gemini 2.5系列中最经济的版本",
                    "input_price_per_1m": 0.10,
                    "output_price_per_1m": 0.40,
                    "max_tokens": 8192,
                    "context_window": 1000000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gemini-2.5-flash",
                    "display_name": "Gemini 2.5 Flash",
                    "provider": "google",
                    "description": "平衡性能和成本的Gemini 2.5版本",
                    "input_price_per_1m": 0.15,
                    "output_price_per_1m": 0.60,
                    "max_tokens": 8192,
                    "context_window": 1000000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gemini-2.0-flash",
                    "display_name": "Gemini 2.0 Flash",
                    "provider": "google",
                    "description": "Gemini 2.0系列的标准版本",
                    "input_price_per_1m": 0.10,
                    "output_price_per_1m": 0.40,
                    "max_tokens": 8192,
                    "context_window": 1000000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gemini-1.5-pro",
                    "display_name": "Gemini 1.5 Pro",
                    "provider": "google",
                    "description": "Gemini 1.5系列的专业版本",
                    "input_price_per_1m": 1.25,
                    "output_price_per_1m": 5.00,
                    "max_tokens": 8192,
                    "context_window": 2000000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "gemini-1.5-flash",
                    "display_name": "Gemini 1.5 Flash",
                    "provider": "google",
                    "description": "Gemini 1.5系列的快速版本",
                    "input_price_per_1m": 0.075,
                    "output_price_per_1m": 0.30,
                    "max_tokens": 8192,
                    "context_window": 1000000,
                    "supports_vision": True,
                    "supports_audio": True,
                    "supports_function_calling": True,
                    "is_active": True
                },
                
                # Anthropic Claude 系列
                {
                    "name": "claude-3-5-sonnet-20241022",
                    "display_name": "Claude 3.5 Sonnet",
                    "provider": "anthropic",
                    "version": "20241022",
                    "description": "Claude 3.5系列的最新版本，具有出色的写作和推理能力",
                    "input_price_per_1m": 3.00,
                    "output_price_per_1m": 15.00,
                    "max_tokens": 8192,
                    "context_window": 200000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "claude-3-haiku-20240307",
                    "display_name": "Claude 3 Haiku",
                    "provider": "anthropic",
                    "version": "20240307",
                    "description": "Claude 3系列中最轻量和快速的版本",
                    "input_price_per_1m": 0.25,
                    "output_price_per_1m": 1.25,
                    "max_tokens": 4096,
                    "context_window": 200000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                },
                {
                    "name": "claude-3-opus-20240229",
                    "display_name": "Claude 3 Opus",
                    "provider": "anthropic",
                    "version": "20240229",
                    "description": "Claude 3系列的旗舰版本，具有最强的能力",
                    "input_price_per_1m": 15.00,
                    "output_price_per_1m": 75.00,
                    "max_tokens": 4096,
                    "context_window": 200000,
                    "supports_vision": True,
                    "supports_audio": False,
                    "supports_function_calling": True,
                    "is_active": True
                }
            ]
            
            for model_data in default_models:
                # 检查模型是否已存在
                from sqlalchemy import select
                stmt = select(Model).where(Model.name == model_data["name"])
                existing = (await session.execute(stmt)).scalar_one_or_none()
                if not existing:
                    model = Model(**model_data)
                    session.add(model)
                    logger.info(f"添加模型: {model_data['display_name']} ({model_data['name']})")
            
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