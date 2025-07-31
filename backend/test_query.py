#!/usr/bin/env python3
"""
测试数据库查询
"""
import asyncio
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Chapter
from sqlalchemy import select

async def test_chapters_query():
    """测试章节查询"""
    async with async_session() as session:
        try:
            # 模拟API中的查询
            knowledge_id = 1
            
            # 先获取大纲
            outline_result = await session.execute(
                select(Outline).where(Outline.knowledge_id == knowledge_id)
            )
            outline = outline_result.scalar_one_or_none()
            
            if not outline:
                print("找不到大纲")
                return
            
            print(f"找到大纲: {outline.id}")
            
            # 获取章节
            result = await session.execute(
                select(Chapter)
                .where(Chapter.outline_id == outline.id)
                .order_by(Chapter.chapter_number)
            )
            chapters = result.scalars().all()
            
            print(f"找到章节数量: {len(chapters)}")
            for chapter in chapters:
                print(f"  章节 {chapter.chapter_number}: {chapter.title}")
            
        except Exception as e:
            print(f"查询失败: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_chapters_query())