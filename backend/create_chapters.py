#!/usr/bin/env python3
"""
从现有的大纲内容创建章节数据
"""
import asyncio
import sys
import os
import json
from decimal import Decimal

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.connection import async_session
from app.db.models import Outline, Chapter
from sqlalchemy import select

async def create_chapters_from_outlines():
    """从现有大纲创建章节"""
    async with async_session() as session:
        try:
            # 获取所有大纲
            result = await session.execute(
                select(Outline).where(Outline.id == 1)  # 只处理ID为1的大纲
            )
            outlines = result.scalars().all()
            
            for outline in outlines:
                print(f"处理大纲ID: {outline.id}")
                
                # 检查是否已经有章节
                existing_chapters = await session.execute(
                    select(Chapter).where(Chapter.outline_id == outline.id)
                )
                if existing_chapters.scalars().first():
                    print(f"大纲 {outline.id} 已经有章节，跳过")
                    continue
                
                # 解析大纲内容
                if isinstance(outline.content, str):
                    content = json.loads(outline.content)
                else:
                    content = outline.content
                
                # 创建章节
                if 'chapters' in content:
                    for chapter_data in content['chapters']:
                        chapter = Chapter(
                            outline_id=outline.id,
                            chapter_number=chapter_data['chapter_number'],
                            title=chapter_data['title'],
                            content=chapter_data['content'],
                            quiz_generation_status='pending'
                        )
                        session.add(chapter)
                        print(f"  创建章节: {chapter.chapter_number} - {chapter.title}")
                
            await session.commit()
            print("章节创建完成!")
            
        except Exception as e:
            print(f"创建章节失败: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(create_chapters_from_outlines())