#!/usr/bin/env python3
"""
迁移数据库价格字段从per_1k到per_1m
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import engine
from sqlalchemy import text

async def migrate_price_fields():
    """迁移价格字段名"""
    async with engine.begin() as conn:
        try:
            # 检查是否存在旧字段
            check_columns = await conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'models' 
                AND column_name IN ('input_price_per_1k', 'output_price_per_1k', 'cached_input_price_per_1k')
            """))
            old_columns = [row[0] for row in check_columns.fetchall()]
            
            if old_columns:
                print(f"发现旧字段: {old_columns}")
                
                # 添加新字段
                await conn.execute(text("""
                    ALTER TABLE models 
                    ADD COLUMN IF NOT EXISTS input_price_per_1m DECIMAL(10,2),
                    ADD COLUMN IF NOT EXISTS output_price_per_1m DECIMAL(10,2),
                    ADD COLUMN IF NOT EXISTS cached_input_price_per_1m DECIMAL(10,2)
                """))
                print("已添加新字段")
                
                # 迁移数据
                await conn.execute(text("""
                    UPDATE models SET 
                    input_price_per_1m = input_price_per_1k,
                    output_price_per_1m = output_price_per_1k,
                    cached_input_price_per_1m = cached_input_price_per_1k
                    WHERE input_price_per_1k IS NOT NULL
                """))
                print("已迁移数据")
                
                # 删除旧字段
                await conn.execute(text("""
                    ALTER TABLE models 
                    DROP COLUMN IF EXISTS input_price_per_1k,
                    DROP COLUMN IF EXISTS output_price_per_1k,
                    DROP COLUMN IF EXISTS cached_input_price_per_1k
                """))
                print("已删除旧字段")
            else:
                print("没有发现旧字段，可能已经迁移过了")
                
        except Exception as e:
            print(f"迁移失败: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(migrate_price_fields())