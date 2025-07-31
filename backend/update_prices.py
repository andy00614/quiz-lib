#!/usr/bin/env python3
"""
更新价格从per_1k格式到per_1m格式
"""
import re

def update_init_db_prices():
    """更新初始化脚本中的价格"""
    with open('/Users/andy/Documents/PARA/Project/quiz-lib/backend/scripts/init_db.py', 'r') as f:
        content = f.read()
    
    # 使用正则表达式找到并更新价格
    def convert_price(match):
        price_value = float(match.group(1))
        new_price = price_value * 1000
        # 根据价格大小决定精度
        if new_price >= 1000:
            formatted_price = f"{new_price:.0f}"
        elif new_price >= 100:
            formatted_price = f"{new_price:.1f}"
        else:
            formatted_price = f"{new_price:.1f}"
        return f'"{match.group(0).split(":")[0]}": {formatted_price},'
    
    # 查找并转换所有价格字段
    patterns = [
        r'"input_price_per_1m": (\d+\.\d+)',
        r'"output_price_per_1m": (\d+\.\d+)',
        r'"cached_input_price_per_1m": (\d+\.\d+)'
    ]
    
    for pattern in patterns:
        content = re.sub(pattern, convert_price, content)
    
    with open('/Users/andy/Documents/PARA/Project/quiz-lib/backend/scripts/init_db.py', 'w') as f:
        f.write(content)
    
    print("价格更新完成")

if __name__ == "__main__":
    update_init_db_prices()