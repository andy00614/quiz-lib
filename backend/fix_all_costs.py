#!/usr/bin/env python3
"""
修复所有现有数据的成本计算
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Quiz, Model
from sqlalchemy import select

async def fix_all_costs():
    """修复所有数据的成本计算"""
    async with async_session() as session:
        try:
            outline_count = 0
            quiz_count = 0
            
            # 修复所有大纲成本
            print("修复大纲成本...")
            outlines = await session.execute(select(Outline))
            for outline in outlines.scalars().all():
                if outline.input_tokens and outline.output_tokens and outline.model_id:
                    # 获取模型价格
                    model_result = await session.execute(select(Model).where(Model.id == outline.model_id))
                    model = model_result.scalar_one_or_none()
                    
                    if model and model.input_price_per_1m and model.output_price_per_1m:
                        # 重新计算成本（使用1M格式）
                        input_cost = (outline.input_tokens / 1000000) * float(model.input_price_per_1m)
                        output_cost = (outline.output_tokens / 1000000) * float(model.output_price_per_1m)
                        new_cost = round(input_cost + output_cost, 6)  # 保留6位小数
                        
                        outline.cost = new_cost
                        outline_count += 1
                        print(f"  大纲 {outline.id}: {outline.input_tokens}+{outline.output_tokens} tokens -> ${new_cost:.6f}")
            
            # 修复所有题目成本
            print("修复题目成本...")
            quizzes = await session.execute(select(Quiz))
            for quiz in quizzes.scalars().all():
                if quiz.input_tokens and quiz.output_tokens and quiz.model_id:
                    # 获取模型价格
                    model_result = await session.execute(select(Model).where(Model.id == quiz.model_id))
                    model = model_result.scalar_one_or_none()
                    
                    if model and model.input_price_per_1m and model.output_price_per_1m:
                        # 重新计算成本（使用1M格式）
                        input_cost = (quiz.input_tokens / 1000000) * float(model.input_price_per_1m)
                        output_cost = (quiz.output_tokens / 1000000) * float(model.output_price_per_1m)
                        new_cost = round(input_cost + output_cost, 6)  # 保留6位小数
                        
                        quiz.cost = new_cost
                        quiz_count += 1
                        print(f"  题目 {quiz.id}: {quiz.input_tokens}+{quiz.output_tokens} tokens -> ${new_cost:.6f}")
            
            await session.commit()
            print(f"\n修复完成！")
            print(f"大纲: {outline_count} 个")
            print(f"题目: {quiz_count} 个")
            
        except Exception as e:
            print(f"修复失败: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(fix_all_costs())