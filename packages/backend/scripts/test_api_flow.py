#!/usr/bin/env python3
"""
测试完整的API流程
"""
import asyncio
import aiohttp
import json

API_BASE = "http://localhost:9001/api/v1"

async def test_complete_flow():
    """测试完整的知识生成流程"""
    async with aiohttp.ClientSession() as session:
        print("🧪 开始测试完整的API流程...\n")
        
        # 1. 获取模型列表
        print("1️⃣ 获取模型列表...")
        async with session.get(f"{API_BASE}/models/") as resp:
            models = await resp.json()
            print(f"   ✅ 获取到 {len(models)} 个模型")
            model_id = models[0]["id"] if models else 1
        
        # 2. 生成大纲
        print("\n2️⃣ 生成知识大纲...")
        outline_data = {
            "title": "Node.js 入门教程",
            "model_id": model_id,
            "temperature": 0.7,
            "max_tokens": 2000
        }
        async with session.post(f"{API_BASE}/generation/outline", json=outline_data) as resp:
            outline = await resp.json()
            print(f"   ✅ 大纲生成成功，知识ID: {outline['knowledge_id']}")
            knowledge_id = outline['knowledge_id']
        
        # 3. 获取章节列表
        print("\n3️⃣ 获取章节列表...")
        async with session.get(f"{API_BASE}/knowledge/{knowledge_id}/chapters") as resp:
            chapters = await resp.json()
            print(f"   ✅ 获取到 {len(chapters)} 个章节")
            
            if chapters:
                chapter = chapters[0]
                chapter_id = chapter["id"]
                print(f"   📝 第一章: {chapter['title']}")
        
        # 4. 为第一章生成题目
        print("\n4️⃣ 为第一章生成题目...")
        quiz_data = {
            "chapter_id": chapter_id,
            "model_id": model_id,
            "question_count": 5,
            "temperature": 0.7,
            "max_tokens": 2000
        }
        async with session.post(f"{API_BASE}/generation/quiz", json=quiz_data) as resp:
            quizzes = await resp.json()
            print(f"   ✅ 题目生成成功，共 {len(quizzes)} 道题")
        
        # 5. 获取章节题目
        print("\n5️⃣ 获取章节题目列表...")
        async with session.get(f"{API_BASE}/knowledge/{knowledge_id}/chapters/{chapter_id}/quizzes") as resp:
            quiz_list = await resp.json()
            print(f"   ✅ 获取到 {len(quiz_list)} 道题目")
            
            if quiz_list:
                first_quiz = quiz_list[0]
                print(f"   ❓ 第一题: {first_quiz['question']}")
                print(f"   ✓ 正确答案: {first_quiz['correct_answer']}")
        
        # 6. 获取知识记录详情
        print("\n6️⃣ 获取知识记录详情...")
        async with session.get(f"{API_BASE}/knowledge/{knowledge_id}") as resp:
            knowledge = await resp.json()
            print(f"   ✅ 知识记录: {knowledge['title']}")
            print(f"   📊 状态: {knowledge['status']}")
            print(f"   🤖 模型: {knowledge['model']['name']}")
        
        print("\n🎉 完整流程测试成功！所有API都正常工作。")
        print(f"\n📋 测试结果总结:")
        print(f"   - 知识ID: {knowledge_id}")
        print(f"   - 章节数: {len(chapters)}")
        print(f"   - 题目数: {len(quiz_list)}")
        print(f"   - 使用模型: {knowledge['model']['name']}")

if __name__ == "__main__":
    asyncio.run(test_complete_flow())