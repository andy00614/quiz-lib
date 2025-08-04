#!/usr/bin/env python3
"""
脚本：更新模板类型
将现有的模板类型从三种 (quiz_outline, test_outline, quiz) 
简化为两种 (outline, quiz)
"""

import asyncio
import os
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker


# 数据库配置
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/quiz_lib")

async def update_template_types():
    """更新模板类型"""
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        try:
            print("开始检查现有模板类型...")
            
            # 检查现有模板类型
            result = await session.execute(
                text("SELECT type, COUNT(*) as count FROM prompt_templates GROUP BY type")
            )
            rows = result.fetchall()
            
            print("现有模板类型分布:")
            for row in rows:
                print(f"  {row.type}: {row.count}")
            
            # 1. 将 quiz_outline 更新为 outline
            print("\n将 quiz_outline 类型更新为 outline...")
            result = await session.execute(
                text("UPDATE prompt_templates SET type = 'outline' WHERE type = 'quiz_outline'")
            )
            print(f"已更新 {result.rowcount} 个 quiz_outline 模板")
            
            # 2. 选择处理 test_outline 类型
            test_outline_count = await session.execute(
                text("SELECT COUNT(*) FROM prompt_templates WHERE type = 'test_outline'")
            )
            count = test_outline_count.scalar()
            
            if count > 0:
                print(f"\n发现 {count} 个 test_outline 类型的模板")
                print("选择处理方式:")
                print("1. 删除 test_outline 模板")
                print("2. 将 test_outline 转换为 outline 模板")
                
                choice = input("请输入选择 (1 或 2): ").strip()
                
                if choice == "1":
                    result = await session.execute(
                        text("DELETE FROM prompt_templates WHERE type = 'test_outline'")
                    )
                    print(f"已删除 {result.rowcount} 个 test_outline 模板")
                elif choice == "2":
                    result = await session.execute(
                        text("UPDATE prompt_templates SET type = 'outline' WHERE type = 'test_outline'")
                    )
                    print(f"已将 {result.rowcount} 个 test_outline 模板转换为 outline 类型")
                else:
                    print("无效选择，跳过 test_outline 处理")
            
            # 提交更改
            await session.commit()
            
            # 显示最终结果
            print("\n更新后的模板类型分布:")
            result = await session.execute(
                text("SELECT type, COUNT(*) as count FROM prompt_templates GROUP BY type")
            )
            rows = result.fetchall()
            
            for row in rows:
                print(f"  {row.type}: {row.count}")
            
            print("\n✅ 模板类型更新完成！")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ 更新失败: {e}")
            raise
        finally:
            await engine.dispose()


if __name__ == "__main__":
    print("模板类型更新脚本")
    print("=" * 50)
    
    # 检查数据库连接
    if "DATABASE_URL" not in os.environ:
        print("⚠️  警告: DATABASE_URL 环境变量未设置，使用默认值")
        print(f"   默认连接: {DATABASE_URL}")
        
    confirm = input("\n确定要执行模板类型更新吗? (y/N): ").strip().lower()
    if confirm not in ['y', 'yes']:
        print("已取消操作")
        sys.exit(0)
    
    asyncio.run(update_template_types())