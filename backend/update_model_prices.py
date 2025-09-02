#!/usr/bin/env python3
"""
更新数据库中所有模型的最新价格信息
基于各大模型提供商的最新定价
"""

import asyncio
from decimal import Decimal
from app.db.connection import get_session
from app.db.models import Model
from sqlalchemy import select

# OpenAI 模型价格 (USD per 1M tokens)
# 基于: https://openai.com/api/pricing/
OPENAI_PRICES = {
    "gpt-4o": {"input": 2.5, "output": 10.0},  # 2024年定价
    "gpt-4o-mini": {"input": 0.15, "output": 0.6},
    "gpt-4o-2024-05-13": {"input": 5.0, "output": 15.0},
    "gpt-4-turbo": {"input": 10.0, "output": 30.0},
    "gpt-4-0125-preview": {"input": 10.0, "output": 30.0},
    "gpt-4-turbo-2024-04-09": {"input": 10.0, "output": 30.0},
    "gpt-3.5-turbo": {"input": 0.5, "output": 1.5},
    "gpt-3.5-turbo-0125": {"input": 0.5, "output": 1.5},
    "gpt-3.5-turbo-instruct": {"input": 1.5, "output": 2.0},
    
    # 嵌入模型
    "text-embedding-3-large": {"input": 0.13, "output": 0.0},
    "text-embedding-3-small": {"input": 0.02, "output": 0.0},
    "text-embedding-ada-002": {"input": 0.10, "output": 0.0},
    
    # o1 系列 (预估)
    "o1": {"input": 15.0, "output": 60.0},
    "o1-mini": {"input": 3.0, "output": 12.0},
    "o1-pro": {"input": 60.0, "output": 180.0},
    
    # 未来模型 (预估)
    "gpt-4.1": {"input": 3.0, "output": 12.0},
    "gpt-4.1-mini": {"input": 0.3, "output": 1.2},
    "gpt-4.1-nano": {"input": 0.1, "output": 0.4},
    "gpt-5": {"input": 5.0, "output": 20.0},
    "gpt-5-mini": {"input": 0.5, "output": 2.0},
    "gpt-5-nano": {"input": 0.2, "output": 0.8},
    "gpt-5-chat-latest": {"input": 5.0, "output": 20.0},
    
    # o3/o4 系列 (预估)
    "o3": {"input": 20.0, "output": 80.0},
    "o3-mini": {"input": 4.0, "output": 16.0},
    "o3-pro": {"input": 80.0, "output": 240.0},
    "o3-deep-research": {"input": 100.0, "output": 400.0},
    "o4-mini": {"input": 5.0, "output": 20.0},
    "o4-mini-deep-research": {"input": 50.0, "output": 200.0},
}

# Anthropic 模型价格 (USD per 1M tokens)
# 基于: https://www.anthropic.com/pricing#anthropic-api
ANTHROPIC_PRICES = {
    "claude-3-5-sonnet-20241022": {"input": 3.0, "output": 15.0},
    "claude-3-5-haiku-20241022": {"input": 1.0, "output": 5.0},
    "claude-3-opus-20240229": {"input": 15.0, "output": 75.0},
    "claude-3-sonnet-20240229": {"input": 3.0, "output": 15.0},
    "claude-3-haiku-20240307": {"input": 0.25, "output": 1.25},
}

# Google Gemini 模型价格已在之前脚本中设置过
GOOGLE_PRICES = {
    "gemini-2.5-pro": {"input": 1.25, "output": 10.0},
    "gemini-2.5-flash": {"input": 0.30, "output": 2.50},
    "gemini-2.5-flash-lite": {"input": 0.10, "output": 0.40},
    "gemini-2.0-flash": {"input": 0.10, "output": 0.40},
    "gemini-1.5-flash": {"input": 0.075, "output": 0.30},
    "gemini-1.5-flash-8b": {"input": 0.0375, "output": 0.15},
    "gemini-1.5-pro": {"input": 1.25, "output": 5.0},
    "gemini-pro": {"input": 0.5, "output": 1.5},  # 旧版本
}

async def update_model_prices():
    """更新所有模型的价格"""
    async for db in get_session():
        try:
            updated_models = []
            
            # 更新 OpenAI 模型
            for model_id, prices in OPENAI_PRICES.items():
                result = await db.execute(select(Model).filter(Model.id == model_id))
                model = result.scalar_one_or_none()
                
                if model:
                    old_input = model.input_price_per_1m
                    old_output = model.output_price_per_1m
                    
                    model.input_price_per_1m = Decimal(str(prices["input"]))
                    model.output_price_per_1m = Decimal(str(prices["output"]))
                    
                    updated_models.append(f"OpenAI {model_id}: 输入 {old_input} -> {prices['input']}, 输出 {old_output} -> {prices['output']}")
            
            # 更新 Anthropic 模型
            for model_id, prices in ANTHROPIC_PRICES.items():
                result = await db.execute(select(Model).filter(Model.id == model_id))
                model = result.scalar_one_or_none()
                
                if model:
                    old_input = model.input_price_per_1m
                    old_output = model.output_price_per_1m
                    
                    model.input_price_per_1m = Decimal(str(prices["input"]))
                    model.output_price_per_1m = Decimal(str(prices["output"]))
                    
                    updated_models.append(f"Anthropic {model_id}: 输入 {old_input} -> {prices['input']}, 输出 {old_output} -> {prices['output']}")
            
            # 更新 Google 模型 (补充缺失的)
            for model_id, prices in GOOGLE_PRICES.items():
                result = await db.execute(select(Model).filter(Model.id == model_id))
                model = result.scalar_one_or_none()
                
                if model and (model.input_price_per_1m is None or model.output_price_per_1m is None):
                    old_input = model.input_price_per_1m
                    old_output = model.output_price_per_1m
                    
                    model.input_price_per_1m = Decimal(str(prices["input"]))
                    model.output_price_per_1m = Decimal(str(prices["output"]))
                    
                    updated_models.append(f"Google {model_id}: 输入 {old_input} -> {prices['input']}, 输出 {old_output} -> {prices['output']}")
            
            if updated_models:
                await db.commit()
                print(f"✅ 成功更新 {len(updated_models)} 个模型的价格:")
                for update in updated_models:
                    print(f"  - {update}")
            else:
                print("✅ 没有需要更新价格的模型")
                
        except Exception as e:
            print(f"❌ 更新模型价格时发生错误: {e}")
            await db.rollback()
            raise
        break

async def verify_prices():
    """验证价格更新结果"""
    async for db in get_session():
        try:
            # 检查主要模型的价格
            main_models = ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'gemini-1.5-pro']
            
            result = await db.execute(
                select(Model).filter(Model.id.in_(main_models))
            )
            models = result.scalars().all()
            
            print("\n验证主要模型价格:")
            for model in models:
                status = "✅" if (model.input_price_per_1m and model.output_price_per_1m) else "❌"
                print(f"{status} {model.id} ({model.provider}): 输入=${model.input_price_per_1m}, 输出=${model.output_price_per_1m}")
            
            # 统计有价格的模型数量
            result = await db.execute(
                select(Model).filter(
                    Model.input_price_per_1m.isnot(None),
                    Model.output_price_per_1m.isnot(None)
                )
            )
            models_with_prices = result.scalars().all()
            
            result = await db.execute(select(Model))
            all_models = result.scalars().all()
            
            print(f"\n统计: {len(models_with_prices)}/{len(all_models)} 个模型有价格数据")
            
        except Exception as e:
            print(f"❌ 验证时发生错误: {e}")
        break

if __name__ == "__main__":
    print("开始更新模型价格...")
    asyncio.run(update_model_prices())
    print("\n验证价格更新...")
    asyncio.run(verify_prices())
    print("完成!")