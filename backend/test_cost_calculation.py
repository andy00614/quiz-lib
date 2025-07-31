#!/usr/bin/env python3
"""
测试成本计算
"""
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_service import llm_service

def test_cost_calculation():
    """测试成本计算"""
    
    # 测试数据：10万输入token，5万输出token
    input_tokens = 100000
    output_tokens = 50000
    
    # 假设价格：$0.1/1M 输入，$0.4/1M 输出
    input_price_per_1m = 0.1
    output_price_per_1m = 0.4
    
    cost = llm_service.calculate_cost(
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        input_price_per_1m=input_price_per_1m,
        output_price_per_1m=output_price_per_1m
    )
    
    print(f"输入token: {input_tokens:,}")
    print(f"输出token: {output_tokens:,}")
    print(f"输入价格: ${input_price_per_1m}/1M")
    print(f"输出价格: ${output_price_per_1m}/1M")
    print(f"计算成本: ${cost}")
    
    # 手动计算验证
    expected_input_cost = (input_tokens / 1000000) * input_price_per_1m
    expected_output_cost = (output_tokens / 1000000) * output_price_per_1m
    expected_total = expected_input_cost + expected_output_cost
    
    print(f"预期输入成本: ${expected_input_cost:.6f}")
    print(f"预期输出成本: ${expected_output_cost:.6f}")
    print(f"预期总成本: ${expected_total:.6f}")
    print(f"四舍五入后: ${round(expected_total, 2)}")

if __name__ == "__main__":
    test_cost_calculation()