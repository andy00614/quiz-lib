#!/usr/bin/env python3
"""
数据库初始化脚本
"""
import asyncio
import sys
from pathlib import Path

# 添加项目根目录到Python路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.database import engine, Base
from app.models import *  # 导入所有模型


async def init_database():
    """初始化数据库"""
    print("开始初始化数据库...")
    
    async with engine.begin() as conn:
        # 删除所有表（仅在开发环境使用）
        # await conn.run_sync(Base.metadata.drop_all)
        
        # 创建所有表
        await conn.run_sync(Base.metadata.create_all)
    
    print("数据库初始化完成！")


async def create_sample_data():
    """创建示例数据"""
    from sqlalchemy.ext.asyncio import AsyncSession
    from core.database import async_session
    from app.models import PromptTemplate
    
    async with async_session() as session:
        # 创建示例模板
        templates = [
            PromptTemplate(
                name="Python基础知识大纲生成器",
                description="用于生成Python基础知识的学习大纲",
                category="编程语言",
                template_content="""请为主题"{topic}"生成一个详细的学习大纲。

要求：
1. 包含至少5个主要章节
2. 每个章节包含3-5个小节
3. 内容要由浅入深，循序渐进
4. 适合初学者学习

请以结构化的格式输出。""",
                variables={"topic": "主题名称"},
                default_model="gpt-4o",
                default_temperature=0.7
            ),
            PromptTemplate(
                name="操作系统概念题目生成器",
                description="根据操作系统知识点生成题目",
                category="计算机科学",
                template_content="""基于以下知识点生成10道题目：
知识点：{topic}

要求：
1. 包含5道单选题
2. 包含3道多选题
3. 包含2道判断题
4. 难度适中，覆盖核心概念
5. 每道题都要提供答案和解析

输出格式：
题目类型：[单选/多选/判断]
题目：xxx
选项：（如果适用）
答案：xxx
解析：xxx""",
                variables={"topic": "知识点"},
                default_model="gpt-4o",
                default_temperature=0.8
            )
        ]
        
        for template in templates:
            session.add(template)
        
        await session.commit()
        print(f"创建了 {len(templates)} 个示例模板")


async def main():
    """主函数"""
    # 初始化数据库
    await init_database()
    
    # 询问是否创建示例数据
    create_sample = input("是否创建示例数据？(y/n): ").lower() == 'y'
    if create_sample:
        await create_sample_data()
    
    # 关闭数据库连接
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())