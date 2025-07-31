#!/usr/bin/env python3
"""
检查数据库中的实际数据
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Quiz, Model
from sqlalchemy import select

async def check_db_data():
    """检查数据库数据"""
    async with async_session() as session:
        try:
            # 检查模型数据
            models = await session.execute(select(Model).limit(3))
            print("模型数据:")
            for model in models.scalars().all():
                print(f"  {model.name}: 输入=${model.input_price_per_1m}/1M, 输出=${model.output_price_per_1m}/1M")
            
            # 检查大纲数据
            outlines = await session.execute(select(Outline).limit(2))
            print("\n大纲数据:")
            for outline in outlines.scalars().all():
                print(f"  ID={outline.id}: 成本=${outline.cost}, 输入token={outline.input_tokens}, 输出token={outline.output_tokens}")
            
            # 检查题目数据
            quizzes = await session.execute(select(Quiz).limit(3))
            print("\n题目数据:")
            for quiz in quizzes.scalars().all():
                print(f"  ID={quiz.id}: 成本=${quiz.cost}, 输入token={quiz.input_tokens}, 输出token={quiz.output_tokens}")
            
        except Exception as e:
            print(f"检查失败: {e}")

if __name__ == "__main__":
    asyncio.run(check_db_data())