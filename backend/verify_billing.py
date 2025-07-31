#!/usr/bin/env python3
"""
验证计费计算是否使用1M基数
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_service import llm_service

def verify_billing_calculation():
    """验证计费计算"""
    
    print("=== 验证计费计算 ===")
    
    # 测试案例1: 小量token
    print("\n测试案例1: 小量token")
    input_tokens = 1000
    output_tokens = 2000
    input_price = 0.15  # $0.15/1M
    output_price = 0.60  # $0.60/1M
    
    cost = llm_service.calculate_cost(
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        input_price_per_1m=input_price,
        output_price_per_1m=output_price
    )
    
    # 手动计算验证
    expected_input = (input_tokens / 1000000) * input_price
    expected_output = (output_tokens / 1000000) * output_price
    expected_total = expected_input + expected_output
    
    print(f"输入token: {input_tokens:,}, 价格: ${input_price}/1M")
    print(f"输出token: {output_tokens:,}, 价格: ${output_price}/1M")
    print(f"实际计算成本: ${cost}")
    print(f"手动验证成本: ${expected_total:.6f}")
    print(f"计算是否正确: {'✅' if abs(cost - round(expected_total, 2)) < 0.001 else '❌'}")
    
    # 测试案例2: 中等量token
    print("\n测试案例2: 中等量token")
    input_tokens = 50000
    output_tokens = 100000
    
    cost = llm_service.calculate_cost(
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        input_price_per_1m=input_price,
        output_price_per_1m=output_price
    )
    
    expected_input = (input_tokens / 1000000) * input_price
    expected_output = (output_tokens / 1000000) * output_price
    expected_total = expected_input + expected_output
    
    print(f"输入token: {input_tokens:,}, 价格: ${input_price}/1M")
    print(f"输出token: {output_tokens:,}, 价格: ${output_price}/1M")
    print(f"实际计算成本: ${cost}")
    print(f"手动验证成本: ${expected_total:.6f}")
    print(f"计算是否正确: {'✅' if abs(cost - round(expected_total, 2)) < 0.001 else '❌'}")
    
    # 测试案例3: 大量token (超过1M)
    print("\n测试案例3: 大量token (超过1M)")
    input_tokens = 1500000  # 1.5M tokens
    output_tokens = 800000  # 0.8M tokens
    
    cost = llm_service.calculate_cost(
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        input_price_per_1m=input_price,
        output_price_per_1m=output_price
    )
    
    expected_input = (input_tokens / 1000000) * input_price
    expected_output = (output_tokens / 1000000) * output_price
    expected_total = expected_input + expected_output
    
    print(f"输入token: {input_tokens:,}, 价格: ${input_price}/1M")
    print(f"输出token: {output_tokens:,}, 价格: ${output_price}/1M")
    print(f"实际计算成本: ${cost}")
    print(f"手动验证成本: ${expected_total:.6f}")
    print(f"计算是否正确: {'✅' if abs(cost - round(expected_total, 2)) < 0.001 else '❌'}")
    
    # 对比旧的1K计算方式
    print("\n=== 对比旧的1K计算方式 ===")
    print("如果还是按照1K计算，同样的token数会产生:")
    old_input_cost = (input_tokens / 1000) * input_price
    old_output_cost = (output_tokens / 1000) * output_price
    old_total = old_input_cost + old_output_cost
    print(f"旧方式(错误)成本: ${old_total:.2f}")
    print(f"新方式(正确)成本: ${cost}")
    print(f"差异: ${old_total - cost:.2f} (旧方式比新方式贵 {((old_total/cost - 1) * 100):.0f}倍)")

if __name__ == "__main__":
    verify_billing_calculation()