#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
性能测试脚本 - 测试中英文响应时间差异
根据测试计划表中的"性能（语言）"测试项目

测试目标：GPT-4o + 固定Prompt，测试中文vs英文响应时间差异
控制变量：模型、Prompt相同
改变变量：语言
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

from app.core.config.settings import settings

# 测试配置
API_BASE_URL = "http://localhost:8000/api/v1"
TEST_MODEL = "gpt-4o"
TEST_TEMPERATURE = 0.7
TEST_MAX_TOKENS = 2000
TEST_TOP_P = 1.0

# 测试题目（中英文对照）
TEST_TOPICS = [
    {
        "chinese": "我想学习 JS 的 Event-Loop",
        "english": "I want to learn about JavaScript Event Loop"
    },
    {
        "chinese": "我想学习 FastAPI",
        "english": "I want to learn FastAPI"
    },
    {
        "chinese": "我想学习 LLM 中的语音工具",
        "english": "I want to learn about speech tools in LLM"
    }
]

# 测试用的Prompt模板（确保中英文使用相同的逻辑结构）
OUTLINE_PROMPT_TEMPLATE = """
Please create a comprehensive learning outline for the topic: "{{topic}}"

Requirements:
1. Structure the content into clear chapters
2. Each chapter should have a title and detailed content description
3. Organize from basic to advanced concepts
4. Include practical examples and applications

Please respond in JSON format with the following structure:
{
    "chapters": [
        {
            "chapter_number": 1,
            "title": "Chapter Title",
            "content": "Detailed chapter content description"
        }
    ]
}
"""

class PerformanceTestRunner:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=300.0)
        self.test_results = []
        
    async def close(self):
        """关闭HTTP客户端"""
        await self.client.aclose()
    
    async def get_model_id(self) -> int:
        """获取测试模型的ID"""
        try:
            response = await self.client.get(f"{API_BASE_URL}/models/")
            if response.status_code == 200:
                models = response.json()
                for model in models:
                    if model.get("name") == TEST_MODEL:
                        return model["id"]
            
            print(f"未找到模型 {TEST_MODEL}")
            return None
                
        except Exception as e:
            print(f"获取模型ID失败: {e}")
            return None
    
    async def test_outline_generation(self, topic: str, language: str, model_id: int) -> Dict[str, Any]:
        """
        测试大纲生成的性能
        
        Args:
            topic: 测试主题
            language: 语言标识 ('chinese' 或 'english')
            model_id: 模型ID
            
        Returns:
            测试结果字典
        """
        
        # 准备请求数据
        request_data = {
            "title": topic,
            "model_id": model_id,
            "temperature": TEST_TEMPERATURE,
            "max_tokens": TEST_MAX_TOKENS,
            "top_p": TEST_TOP_P,
            "outline_prompt": OUTLINE_PROMPT_TEMPLATE.replace("{{topic}}", topic)
        }
        
        # 记录开始时间
        start_time = time.time()
        
        try:
            # 发送请求
            response = await self.client.post(
                f"{API_BASE_URL}/generation/outline",
                json=request_data
            )
            
            # 记录结束时间
            end_time = time.time()
            response_time_ms = int((end_time - start_time) * 1000)
            
            if response.status_code == 200:
                result = response.json()
                
                test_result = {
                    "topic": topic,
                    "language": language,
                    "model": TEST_MODEL,
                    "status": "success",
                    "response_time_ms": response_time_ms,
                    "knowledge_id": result.get("knowledge_id"),
                    "outline_id": result.get("id"),
                    "input_tokens": result.get("input_tokens", 0),
                    "output_tokens": result.get("output_tokens", 0),
                    "cost": float(result.get("cost", 0)),
                    "timestamp": datetime.now().isoformat(),
                    "request_params": {
                        "temperature": TEST_TEMPERATURE,
                        "max_tokens": TEST_MAX_TOKENS,
                        "top_p": TEST_TOP_P
                    }
                }
                
                print(f"✅ {language.upper()} - {topic}: {response_time_ms}ms")
                return test_result
                
            else:
                error_result = {
                    "topic": topic,
                    "language": language,
                    "model": TEST_MODEL,
                    "status": "failed",
                    "response_time_ms": response_time_ms,
                    "error": response.text,
                    "timestamp": datetime.now().isoformat()
                }
                
                print(f"❌ {language.upper()} - {topic}: 失败 ({response.status_code})")
                return error_result
                
        except Exception as e:
            end_time = time.time()
            response_time_ms = int((end_time - start_time) * 1000)
            
            error_result = {
                "topic": topic,
                "language": language,
                "model": TEST_MODEL,
                "status": "error",
                "response_time_ms": response_time_ms,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"💥 {language.upper()} - {topic}: 异常 - {str(e)}")
            return error_result
    
    async def run_performance_test(self):
        """运行完整的性能测试"""
        print("🚀 开始性能测试 - 测试中英文响应时间差异")
        print("=" * 60)
        
        # 获取模型ID
        model_id = await self.get_model_id()
        if not model_id:
            print("❌ 无法获取或创建测试模型")
            return
        
        print(f"📋 使用模型: {TEST_MODEL} (ID: {model_id})")
        print(f"🔧 测试参数: temperature={TEST_TEMPERATURE}, max_tokens={TEST_MAX_TOKENS}, top_p={TEST_TOP_P}")
        print()
        
        # 执行测试
        for i, topic_pair in enumerate(TEST_TOPICS, 1):
            print(f"📝 测试 {i}/3:")
            print(f"   中文: {topic_pair['chinese']}")
            print(f"   英文: {topic_pair['english']}")
            
            # 测试中文版本
            chinese_result = await self.test_outline_generation(
                topic_pair['chinese'], 
                'chinese', 
                model_id
            )
            self.test_results.append(chinese_result)
            
            # 等待一秒避免频率限制
            await asyncio.sleep(1)
            
            # 测试英文版本
            english_result = await self.test_outline_generation(
                topic_pair['english'], 
                'english', 
                model_id
            )
            self.test_results.append(english_result)
            
            # 比较结果
            if chinese_result['status'] == 'success' and english_result['status'] == 'success':
                chinese_time = chinese_result['response_time_ms']
                english_time = english_result['response_time_ms']
                diff = chinese_time - english_time
                diff_pct = (diff / english_time) * 100 if english_time > 0 else 0
                
                print(f"   📊 性能对比: 中文 {chinese_time}ms vs 英文 {english_time}ms")
                print(f"      差异: {diff:+d}ms ({diff_pct:+.1f}%)")
            
            print()
            
            # 测试间隔
            if i < len(TEST_TOPICS):
                await asyncio.sleep(2)
    
    def generate_report(self) -> Dict[str, Any]:
        """生成测试报告"""
        if not self.test_results:
            return {"error": "没有测试结果"}
        
        # 统计成功和失败的测试
        successful_tests = [r for r in self.test_results if r['status'] == 'success']
        failed_tests = [r for r in self.test_results if r['status'] != 'success']
        
        # 分析中英文性能
        chinese_tests = [r for r in successful_tests if r['language'] == 'chinese']
        english_tests = [r for r in successful_tests if r['language'] == 'english']
        
        report = {
            "test_summary": {
                "total_tests": len(self.test_results),
                "successful_tests": len(successful_tests),
                "failed_tests": len(failed_tests),
                "success_rate": len(successful_tests) / len(self.test_results) * 100
            },
            "performance_analysis": {}
        }
        
        if chinese_tests and english_tests:
            chinese_avg_time = sum(r['response_time_ms'] for r in chinese_tests) / len(chinese_tests)
            english_avg_time = sum(r['response_time_ms'] for r in english_tests) / len(english_tests)
            
            chinese_total_tokens = sum(r.get('input_tokens', 0) + r.get('output_tokens', 0) for r in chinese_tests)
            english_total_tokens = sum(r.get('input_tokens', 0) + r.get('output_tokens', 0) for r in english_tests)
            
            chinese_total_cost = sum(r.get('cost', 0) for r in chinese_tests)
            english_total_cost = sum(r.get('cost', 0) for r in english_tests)
            
            report["performance_analysis"] = {
                "chinese": {
                    "avg_response_time_ms": round(chinese_avg_time, 2),
                    "total_tokens": chinese_total_tokens,
                    "total_cost": round(chinese_total_cost, 6),
                    "test_count": len(chinese_tests)
                },
                "english": {
                    "avg_response_time_ms": round(english_avg_time, 2),
                    "total_tokens": english_total_tokens,
                    "total_cost": round(english_total_cost, 6),
                    "test_count": len(english_tests)
                },
                "comparison": {
                    "time_difference_ms": round(chinese_avg_time - english_avg_time, 2),
                    "time_difference_pct": round(((chinese_avg_time - english_avg_time) / english_avg_time) * 100, 2) if english_avg_time > 0 else 0,
                    "token_difference": chinese_total_tokens - english_total_tokens,
                    "cost_difference": round(chinese_total_cost - english_total_cost, 6)
                }
            }
        
        report["detailed_results"] = self.test_results
        
        return report
    
    def save_results(self, filename: str = None):
        """保存测试结果到文件"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"performance_test_results_{timestamp}.json"
        
        report = self.generate_report()
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📄 测试结果已保存到: {filename}")
        return filename

async def main():
    """主函数"""
    print("🎯 Quiz-Lib 性能测试工具")
    print("测试项目: 性能（语言）- 中英文响应时间对比")
    print()
    
    runner = PerformanceTestRunner()
    
    try:
        # 运行测试
        await runner.run_performance_test()
        
        # 生成并显示报告
        print("📊 生成测试报告...")
        report = runner.generate_report()
        
        print("=" * 60)
        print("🏁 测试完成!")
        print("=" * 60)
        
        if "performance_analysis" in report:
            analysis = report["performance_analysis"]
            print(f"📈 性能分析结果:")
            print(f"   中文平均响应时间: {analysis['chinese']['avg_response_time_ms']}ms")
            print(f"   英文平均响应时间: {analysis['english']['avg_response_time_ms']}ms")
            print(f"   时间差异: {analysis['comparison']['time_difference_ms']:+.2f}ms ({analysis['comparison']['time_difference_pct']:+.2f}%)")
            print(f"   Token差异: {analysis['comparison']['token_difference']:+d}")
            print(f"   成本差异: ${analysis['comparison']['cost_difference']:+.6f}")
        
        print(f"📋 测试概况:")
        summary = report["test_summary"]
        print(f"   总测试数: {summary['total_tests']}")
        print(f"   成功: {summary['successful_tests']}")
        print(f"   失败: {summary['failed_tests']}")
        print(f"   成功率: {summary['success_rate']:.1f}%")
        
        # 保存结果
        runner.save_results()
        
    except KeyboardInterrupt:
        print("\n⚠️  测试被用户中断")
    except Exception as e:
        print(f"\n💥 测试过程中发生错误: {e}")
    finally:
        await runner.close()

if __name__ == "__main__":
    asyncio.run(main())