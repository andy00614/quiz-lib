#!/usr/bin/env python3
"""
测试实际API调用的计费
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Model
from sqlalchemy import select

async def test_real_billing():
    """测试实际的计费数据"""
    async with async_session() as session:
        try:
            # 获取最新的大纲记录
            result = await session.execute(
                select(Outline).order_by(Outline.created_at.desc()).limit(1)
            )
            outline = result.scalar_one_or_none()
            
            if outline:
                # 获取对应的模型
                model_result = await session.execute(
                    select(Model).where(Model.id == outline.model_id)
                )
                model = model_result.scalar_one_or_none()
                
                if model:
                    print("=== 实际计费数据验证 ===")
                    print(f"大纲ID: {outline.id}")
                    print(f"使用模型: {model.name}")
                    print(f"输入token: {outline.input_tokens}")
                    print(f"输出token: {outline.output_tokens}")
                    print(f"模型输入价格: ${model.input_price_per_1m}/1M")
                    print(f"模型输出价格: ${model.output_price_per_1m}/1M")
                    print(f"记录的成本: ${outline.cost}")
                    
                    # 手动验证计算
                    if outline.input_tokens and outline.output_tokens:
                        expected_input = (outline.input_tokens / 1000000) * float(model.input_price_per_1m)
                        expected_output = (outline.output_tokens / 1000000) * float(model.output_price_per_1m)
                        expected_total = round(expected_input + expected_output, 2)
                        
                        print(f"手动计算验证:")
                        print(f"  输入成本: ({outline.input_tokens}/1M) * ${model.input_price_per_1m} = ${expected_input:.6f}")
                        print(f"  输出成本: ({outline.output_tokens}/1M) * ${model.output_price_per_1m} = ${expected_output:.6f}")
                        print(f"  总成本: ${expected_total}")
                        
                        is_correct = abs(float(outline.cost) - expected_total) < 0.001
                        print(f"计费是否正确: {'✅' if is_correct else '❌'}")
                        
                        if not is_correct:
                            print(f"差异: ${abs(float(outline.cost) - expected_total):.6f}")
                else:
                    print("找不到对应的模型")
            else:
                print("没有找到大纲记录")
                
        except Exception as e:
            print(f"测试失败: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_real_billing())