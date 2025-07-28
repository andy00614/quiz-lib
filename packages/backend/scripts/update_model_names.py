#!/usr/bin/env python3
"""
更新数据库中的模型名称为标准格式
"""
import asyncio
import sys
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select, update
from core.database import async_session
from core.database.models import Model
import structlog

logger = structlog.get_logger()


async def update_model_names():
    """更新模型名称为标准格式"""
    model_name_mapping = {
        "GPT-4o": "gpt-4o",
        "GPT-3.5-turbo": "gpt-3.5-turbo",
        "Claude 3 Opus": "claude-3-opus-20240229",
        "Claude 3 Sonnet": "claude-3-sonnet-20240229"
    }
    
    async with async_session() as session:
        try:
            # 获取所有模型
            result = await session.execute(select(Model))
            models = result.scalars().all()
            
            logger.info(f"Found {len(models)} models to check")
            
            # 更新需要规范化的模型名称
            for model in models:
                if model.name in model_name_mapping:
                    old_name = model.name
                    new_name = model_name_mapping[old_name]
                    
                    await session.execute(
                        update(Model)
                        .where(Model.id == model.id)
                        .values(name=new_name)
                    )
                    
                    logger.info(f"Updated model {model.id}: '{old_name}' -> '{new_name}'")
            
            await session.commit()
            logger.info("Model names updated successfully")
            
            # 显示更新后的模型列表
            result = await session.execute(select(Model))
            models = result.scalars().all()
            
            logger.info("Current models in database:")
            for model in models:
                logger.info(f"  ID: {model.id}, Name: {model.name}, Provider: {model.provider}")
                
        except Exception as e:
            logger.error(f"Failed to update model names: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(update_model_names())