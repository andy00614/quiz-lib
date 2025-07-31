#!/usr/bin/env python3
"""
重新计算现有数据的成本（从1K格式改为1M格式）
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Quiz, Model
from sqlalchemy import select

async def recalculate_costs():
    """重新计算所有成本"""
    async with async_session() as session:
        try:
            # 重新计算大纲成本
            outlines = await session.execute(select(Outline))
            outline_count = 0
            for outline in outlines.scalars().all():
                if outline.cost and outline.input_tokens and outline.output_tokens:
                    # 获取模型价格
                    model = await session.execute(select(Model).where(Model.id == outline.model_id))
                    model = model.scalar_one_or_none()
                    
                    if model and model.input_price_per_1m and model.output_price_per_1m:
                        # 重新计算成本（从1M格式）
                        input_cost = (outline.input_tokens / 1000000) * float(model.input_price_per_1m)
                        output_cost = (outline.output_tokens / 1000000) * float(model.output_price_per_1m)
                        new_cost = round(input_cost + output_cost, 2)
                        
                        outline.cost = new_cost
                        outline_count += 1
            
            # 重新计算题目成本
            quizzes = await session.execute(select(Quiz))
            quiz_count = 0
            for quiz in quizzes.scalars().all():
                if quiz.cost and quiz.input_tokens and quiz.output_tokens:
                    # 获取模型价格
                    model = await session.execute(select(Model).where(Model.id == quiz.model_id))
                    model = model.scalar_one_or_none()
                    
                    if model and model.input_price_per_1m and model.output_price_per_1m:
                        # 重新计算成本（从1M格式）
                        input_cost = (quiz.input_tokens / 1000000) * float(model.input_price_per_1m)
                        output_cost = (quiz.output_tokens / 1000000) * float(model.output_price_per_1m)
                        new_cost = round(input_cost + output_cost, 2)
                        
                        quiz.cost = new_cost
                        quiz_count += 1
            
            await session.commit()
            print(f"重新计算完成: {outline_count} 个大纲, {quiz_count} 个题目")
            
        except Exception as e:
            print(f"重新计算失败: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(recalculate_costs())