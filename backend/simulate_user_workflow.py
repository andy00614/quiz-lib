#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模拟用户点击"生成知识内容和题目"按钮的完整后端流程
复现前端 handleGenerate 函数的所有后端调用
"""

import asyncio
import httpx
import json
import time
from typing import Dict, List, Any
from datetime import datetime
import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 测试配置
API_BASE_URL = "http://localhost:8000/api/v1"

# 模拟用户输入的数据
SIMULATION_DATA = {
    "question": "我想学习 React Hooks 的使用和最佳实践",
    "model_name": "gpt-4o",  # 使用存在的模型
    "temperature": 0.7,
    "max_tokens": 2000,
    "top_p": 1.0,
    "outline_prompt": """请为主题"{{topic}}"创建一个详细的学习大纲。

要求：
1. 将内容组织成清晰的章节
2. 每个章节都应该有标题和详细的内容描述
3. 从基础概念到高级应用逐步组织
4. 包含实践示例和应用场景

请以以下JSON格式回复：
{
    "chapters": [
        {
            "chapter_number": 1,
            "title": "章节标题",
            "content": "详细的章节内容描述"
        }
    ]
}"""
}

class UserWorkflowSimulator:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=300.0)
        self.workflow_log = []
        
    async def close(self):
        """关闭HTTP客户端"""
        await self.client.aclose()
    
    def log_step(self, step: str, message: str, data: Any = None):
        """记录工作流程步骤"""
        log_entry = {
            "step": step,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        self.workflow_log.append(log_entry)
        print(f"🔄 [{step}] {message}")
        if data:
            print(f"   💾 数据: {json.dumps(data, ensure_ascii=False, indent=2)[:200]}...")
    
    async def get_model_id(self, model_name: str) -> int:
        """获取模型ID（模拟前端获取模型列表）"""
        self.log_step("INIT", f"获取模型 {model_name} 的ID")
        
        try:
            response = await self.client.get(f"{API_BASE_URL}/models/")
            if response.status_code == 200:
                models = response.json()
                for model in models:
                    if model.get("name") == model_name:
                        model_id = model["id"]
                        self.log_step("INIT", f"找到模型 {model_name}, ID: {model_id}")
                        return model_id
            
            raise Exception(f"未找到模型: {model_name}")
            
        except Exception as e:
            self.log_step("ERROR", f"获取模型ID失败: {e}")
            raise
    
    async def step1_generate_outline(self, model_id: int) -> Dict[str, Any]:
        """
        第一步：生成大纲
        对应前端的 apiClient.generateOutline() 调用
        """
        self.log_step("OUTLINE", "开始生成学习大纲")
        
        # 处理Prompt模板，替换变量（模拟前端的processPromptWithVariables）
        final_prompt = SIMULATION_DATA["outline_prompt"].replace(
            "{{topic}}", 
            SIMULATION_DATA["question"]
        )
        
        request_data = {
            "title": SIMULATION_DATA["question"],
            "model_id": model_id,
            "temperature": SIMULATION_DATA["temperature"],
            "max_tokens": SIMULATION_DATA["max_tokens"],
            "top_p": SIMULATION_DATA["top_p"],
            "outline_prompt": final_prompt
        }
        
        self.log_step("OUTLINE", "发送大纲生成请求", {
            "api": "/generation/outline",
            "model_id": model_id,
            "title": request_data["title"]
        })
        
        try:
            start_time = time.time()
            response = await self.client.post(
                f"{API_BASE_URL}/generation/outline",
                json=request_data
            )
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                
                self.log_step("OUTLINE", f"大纲生成成功，耗时: {int((end_time - start_time) * 1000)}ms", {
                    "knowledge_id": result.get("knowledge_id"),
                    "outline_id": result.get("id"),
                    "input_tokens": result.get("input_tokens"),
                    "output_tokens": result.get("output_tokens"),
                    "cost": result.get("cost"),
                    "chapters_count": len(result.get("content", {}).get("chapters", []))
                })
                
                return result
            else:
                raise Exception(f"大纲生成失败: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_step("ERROR", f"大纲生成异常: {e}")
            raise
    
    async def step2_generate_batch_quiz(self, knowledge_id: int) -> Dict[str, Any]:
        """
        第二步：批量生成题目
        对应前端的 apiClient.generateBatchQuiz() 调用
        """
        self.log_step("QUIZ", f"开始为知识记录 {knowledge_id} 批量生成题目")
        
        try:
            start_time = time.time()
            response = await self.client.post(
                f"{API_BASE_URL}/generation/quiz/batch?knowledge_id={knowledge_id}"
            )
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                
                self.log_step("QUIZ", f"批量题目生成完成，耗时: {int((end_time - start_time) * 1000)}ms", {
                    "total_chapters": result.get("total_chapters"),
                    "success_count": result.get("success_count"),
                    "failed_count": result.get("failed_count"),
                    "total_cost": result.get("total_cost"),
                    "total_tokens": result.get("total_input_tokens", 0) + result.get("total_output_tokens", 0),
                    "total_time_ms": result.get("total_time_ms")
                })
                
                return result
            else:
                raise Exception(f"批量题目生成失败: {response.status_code} - {response.text}")
                
        except Exception as e:
            self.log_step("ERROR", f"批量题目生成异常: {e}")
            raise
    
    async def step3_verify_results(self, knowledge_id: int) -> Dict[str, Any]:
        """
        第三步：验证生成结果
        查看生成的知识记录、大纲和题目详情
        """
        self.log_step("VERIFY", f"验证知识记录 {knowledge_id} 的生成结果")
        
        try:
            # 获取知识记录详情
            response = await self.client.get(f"{API_BASE_URL}/knowledge/{knowledge_id}")
            if response.status_code == 200:
                knowledge_detail = response.json()
                
                # 统计信息
                chapters = knowledge_detail.get("outline", {}).get("chapters", [])
                total_quizzes = sum(len(chapter.get("quizzes", [])) for chapter in chapters)
                
                verification_result = {
                    "knowledge_id": knowledge_id,
                    "title": knowledge_detail.get("title"),
                    "status": knowledge_detail.get("status"),
                    "chapters_count": len(chapters),
                    "total_quizzes": total_quizzes,
                    "outline_cost": knowledge_detail.get("outline", {}).get("cost"),
                    "total_quiz_cost": sum(
                        sum(quiz.get("cost", 0) for quiz in chapter.get("quizzes", []))
                        for chapter in chapters
                    ),
                    "chapter_details": [
                        {
                            "chapter_number": chapter.get("chapter_number"),
                            "title": chapter.get("title"),
                            "quiz_count": len(chapter.get("quizzes", [])),
                            "quiz_status": chapter.get("quiz_generation_status")
                        }
                        for chapter in chapters
                    ]
                }
                
                self.log_step("VERIFY", "验证完成", verification_result)
                return verification_result
            else:
                raise Exception(f"获取知识记录详情失败: {response.status_code}")
                
        except Exception as e:
            self.log_step("ERROR", f"验证结果异常: {e}")
            raise
    
    async def simulate_complete_workflow(self):
        """模拟完整的用户工作流程"""
        print("🎭 开始模拟用户点击'生成知识内容和题目'按钮的完整流程")
        print("=" * 80)
        
        workflow_start_time = time.time()
        
        try:
            # 前置步骤：获取模型ID
            model_id = await self.get_model_id(SIMULATION_DATA["model_name"])
            
            print(f"\n📝 模拟用户输入:")
            print(f"   问题: {SIMULATION_DATA['question']}")
            print(f"   模型: {SIMULATION_DATA['model_name']} (ID: {model_id})")
            print(f"   参数: temperature={SIMULATION_DATA['temperature']}, max_tokens={SIMULATION_DATA['max_tokens']}")
            print()
            
            # 🔄 步骤1：生成大纲
            print("📋 第一步：生成学习大纲")
            outline_result = await self.step1_generate_outline(model_id)
            knowledge_id = outline_result.get("knowledge_id")
            
            if not knowledge_id:
                raise Exception("未能获取知识记录ID")
            
            print()
            
            # 🔄 步骤2：批量生成题目
            print("❓ 第二步：批量生成题目")
            batch_quiz_result = await self.step2_generate_batch_quiz(knowledge_id)
            
            print()
            
            # 🔄 步骤3：验证结果
            print("✅ 第三步：验证生成结果")
            verification_result = await self.step3_verify_results(knowledge_id)
            
            # 计算总耗时
            workflow_end_time = time.time()
            total_time_ms = int((workflow_end_time - workflow_start_time) * 1000)
            
            print()
            print("=" * 80)
            print("🏁 工作流程完成!")
            print("=" * 80)
            
            # 生成最终报告
            final_report = {
                "workflow_summary": {
                    "knowledge_id": knowledge_id,
                    "title": SIMULATION_DATA["question"],
                    "model_used": SIMULATION_DATA["model_name"],
                    "total_time_ms": total_time_ms,
                    "workflow_status": "success"
                },
                "outline_generation": {
                    "input_tokens": outline_result.get("input_tokens"),
                    "output_tokens": outline_result.get("output_tokens"),
                    "cost": outline_result.get("cost"),
                    "chapters_generated": len(outline_result.get("content", {}).get("chapters", []))
                },
                "quiz_generation": {
                    "total_chapters": batch_quiz_result.get("total_chapters"),
                    "success_count": batch_quiz_result.get("success_count"),
                    "failed_count": batch_quiz_result.get("failed_count"),
                    "total_cost": batch_quiz_result.get("total_cost"),
                    "total_input_tokens": batch_quiz_result.get("total_input_tokens"),
                    "total_output_tokens": batch_quiz_result.get("total_output_tokens"),
                    "generation_time_ms": batch_quiz_result.get("total_time_ms")
                },
                "final_verification": verification_result,
                "detailed_workflow_log": self.workflow_log
            }
            
            # 显示汇总信息
            print(f"📊 工作流程汇总:")
            print(f"   ✅ 知识记录ID: {knowledge_id}")
            print(f"   📋 生成章节数: {verification_result['chapters_count']}")
            print(f"   ❓ 生成题目数: {verification_result['total_quizzes']}")
            outline_cost = float(outline_result.get('cost', 0))
            quiz_cost = float(batch_quiz_result.get('total_cost', 0))
            total_cost = outline_cost + quiz_cost
            print(f"   💰 总费用: ${total_cost:.6f}")
            print(f"   ⏱️  总耗时: {total_time_ms}ms")
            print(f"   📍 前端将跳转到: /knowledge/{knowledge_id}")
            
            # 保存详细报告
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_filename = f"user_workflow_simulation_{timestamp}.json"
            with open(report_filename, 'w', encoding='utf-8') as f:
                json.dump(final_report, f, ensure_ascii=False, indent=2)
            
            print(f"\n📄 详细报告已保存到: {report_filename}")
            
            return final_report
            
        except Exception as e:
            workflow_end_time = time.time()
            total_time_ms = int((workflow_end_time - workflow_start_time) * 1000)
            
            self.log_step("WORKFLOW_ERROR", f"工作流程失败: {e}")
            print(f"\n💥 工作流程在 {total_time_ms}ms 后失败: {e}")
            raise

async def main():
    """主函数"""
    print("🚀 Quiz-Lib 用户工作流程模拟器")
    print("模拟用户点击'生成知识内容和题目'按钮的完整后端行为")
    print()
    
    simulator = UserWorkflowSimulator()
    
    try:
        await simulator.simulate_complete_workflow()
        
    except KeyboardInterrupt:
        print("\n⚠️  模拟被用户中断")
    except Exception as e:
        print(f"\n💥 模拟过程中发生错误: {e}")
    finally:
        await simulator.close()

if __name__ == "__main__":
    asyncio.run(main())