#!/usr/bin/env python3
"""
调试成本计算问题
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Quiz, Model
from sqlalchemy import select

async def debug_cost():
    """调试成本计算"""
    async with async_session() as session:
        try:
            # 查看第一个大纲的详细信息
            outline = await session.execute(select(Outline).limit(1))
            outline = outline.scalar_one_or_none()
            
            if outline:
                print(f"大纲ID: {outline.id}")
                print(f"模型ID: {outline.model_id}")
                print(f"输入token: {outline.input_tokens}")
                print(f"输出token: {outline.output_tokens}")
                print(f"当前成本: {outline.cost}")
                
                # 查找对应的模型
                model = await session.execute(select(Model).where(Model.id == outline.model_id))
                model = model.scalar_one_or_none()
                
                if model:
                    print(f"模型名称: {model.name}")
                    print(f"输入价格: {model.input_price_per_1m}")
                    print(f"输出价格: {model.output_price_per_1m}")
                    
                    # 手动计算成本
                    if outline.input_tokens and outline.output_tokens:
                        input_cost = (outline.input_tokens / 1000000) * float(model.input_price_per_1m or 0)
                        output_cost = (outline.output_tokens / 1000000) * float(model.output_price_per_1m or 0)
                        total_cost = round(input_cost + output_cost, 2)
                        
                        print(f"手动计算:")
                        print(f"  输入成本: ({outline.input_tokens}/1000000) * {model.input_price_per_1m} = {input_cost}")
                        print(f"  输出成本: ({outline.output_tokens}/1000000) * {model.output_price_per_1m} = {output_cost}")
                        print(f"  总成本: {total_cost}")
                        
                        # 更新成本
                        outline.cost = total_cost
                        await session.commit()
                        print(f"已更新成本为: {total_cost}")
                else:
                    print("找不到对应的模型")
            else:
                print("找不到大纲数据")
            
        except Exception as e:
            print(f"调试失败: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_cost())