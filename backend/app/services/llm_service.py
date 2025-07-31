from typing import Dict, Any, Optional, AsyncGenerator
import openai
import anthropic
import google.generativeai as genai
import json
import time
import re
from app.core.config import settings
import structlog

logger = structlog.get_logger()


class LLMService:
    """LLM服务统一接口"""
    
    def __init__(self):
        # 初始化客户端
        if settings.OPENAI_API_KEY:
            self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
    
    async def generate(
        self,
        prompt: str,
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        top_p: float = 1.0,
        stream: bool = False
    ) -> Dict[str, Any]:
        """生成内容"""
        start_time = time.time()
        
        try:
            provider = self._get_provider(model)
            
            if provider == "openai":
                result = await self._generate_openai(
                    prompt, model, temperature, max_tokens, top_p, stream
                )
            elif provider == "anthropic":
                result = await self._generate_anthropic(
                    prompt, model, temperature, max_tokens, top_p, stream
                )
            elif provider == "google":
                result = await self._generate_google(
                    prompt, model, temperature, max_tokens, top_p, stream
                )
            else:
                raise ValueError(f"不支持的模型: {model}")
            
            # 添加响应时间
            result["response_time_ms"] = int((time.time() - start_time) * 1000)
            result["success"] = True
            
            return result
            
        except Exception as e:
            response_time = int((time.time() - start_time) * 1000)
            logger.error(f"Generation error: {e}")
            
            return {
                "success": False,
                "error": str(e),
                "response_time_ms": response_time,
                "model": model
            }
    
    def _get_provider(self, model: str) -> str:
        """获取模型提供商"""
        model_lower = model.lower()
        if model_lower.startswith("gpt"):
            return "openai"
        elif model_lower.startswith("claude"):
            return "anthropic"
        elif model_lower.startswith("gemini"):
            return "google"
        else:
            raise ValueError(f"无法识别模型提供商: {model}")
    
    async def _generate_openai(
        self, prompt: str, model: str, temperature: float,
        max_tokens: int, top_p: float, stream: bool
    ) -> Dict[str, Any]:
        """使用OpenAI生成"""
        try:
            response = await self.openai_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=top_p,
                stream=stream
            )
            
            if stream:
                # TODO: 处理流式响应
                pass
            else:
                content = response.choices[0].message.content
                return {
                    "content": content,
                    "model": model,
                    "usage": {
                        "prompt_tokens": response.usage.prompt_tokens,
                        "completion_tokens": response.usage.completion_tokens,
                        "total_tokens": response.usage.total_tokens
                    },
                    "finish_reason": response.choices[0].finish_reason
                }
        
        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            raise
    
    async def _generate_anthropic(
        self, prompt: str, model: str, temperature: float,
        max_tokens: int, top_p: float, stream: bool
    ) -> Dict[str, Any]:
        """使用Anthropic生成"""
        try:
            message = await self.anthropic_client.messages.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=top_p,
                stream=stream
            )
            
            if stream:
                # TODO: 处理流式响应
                pass
            else:
                content = message.content[0].text if message.content else ""
                return {
                    "content": content,
                    "model": model,
                    "usage": {
                        "prompt_tokens": message.usage.input_tokens,
                        "completion_tokens": message.usage.output_tokens,
                        "total_tokens": message.usage.input_tokens + message.usage.output_tokens
                    },
                    "finish_reason": message.stop_reason
                }
        
        except Exception as e:
            logger.error(f"Anthropic generation error: {e}")
            raise
    
    async def _generate_google(
        self, prompt: str, model: str, temperature: float,
        max_tokens: int, top_p: float, stream: bool
    ) -> Dict[str, Any]:
        """使用Google生成"""
        try:
            # Gemini API是同步的，需要在异步环境中运行
            import asyncio
            
            def _sync_generate():
                model_instance = genai.GenerativeModel(model)
                response = model_instance.generate_content(
                    prompt,
                    generation_config={
                        "temperature": temperature,
                        "max_output_tokens": max_tokens,
                        "top_p": top_p,
                    }
                )
                return response
            
            # 在线程池中运行同步代码
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, _sync_generate)
            
            return {
                "content": response.text,
                "model": model,
                "usage": {
                    "prompt_tokens": 0,  # Gemini API不提供token统计
                    "completion_tokens": 0,
                    "total_tokens": 0
                },
                "finish_reason": "stop"
            }
        
        except Exception as e:
            logger.error(f"Google generation error: {e}")
            raise
    
    def parse_json_response(self, content: str) -> Optional[Dict[str, Any]]:
        """解析JSON响应"""
        try:
            # 尝试直接解析
            return json.loads(content)
        except json.JSONDecodeError:
            # 尝试从markdown代码块中提取JSON
            import re
            
            # 尝试匹配```json...```模式
            json_pattern = r'```(?:json)?\s*\n?(.*?)\n?```'
            match = re.search(json_pattern, content, re.DOTALL)
            
            if match:
                json_content = match.group(1).strip()
                try:
                    return json.loads(json_content)
                except json.JSONDecodeError:
                    pass
            
            # 尝试提取JSON内容（从第一个{到最后一个}）
            start_idx = content.find('{')
            end_idx = content.rfind('}')
            
            if start_idx != -1 and end_idx != -1:
                json_content = content[start_idx:end_idx + 1]
                
                # 尝试修复常见的JSON格式问题
                json_content = self._fix_json_format(json_content)
                
                try:
                    return json.loads(json_content)
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error: {e}, content: {json_content[:200]}...")
            
            logger.error(f"Failed to parse JSON response: {content[:200]}...")
            return None
    
    def _fix_json_format(self, json_content: str) -> str:
        """尝试修复常见的JSON格式问题"""
        # 移除尾部的逗号
        json_content = re.sub(r',\s*}', '}', json_content)
        json_content = re.sub(r',\s*]', ']', json_content)
        
        # 尝试补全不完整的JSON
        open_braces = json_content.count('{')
        close_braces = json_content.count('}')
        
        if open_braces > close_braces:
            json_content += '}' * (open_braces - close_braces)
        
        open_brackets = json_content.count('[')
        close_brackets = json_content.count(']')
        
        if open_brackets > close_brackets:
            json_content += ']' * (open_brackets - close_brackets)
            
        return json_content
    
    def calculate_cost(
        self,
        input_tokens: int,
        output_tokens: int,
        input_price_per_1m: float,
        output_price_per_1m: float
    ) -> float:
        """计算API调用成本"""
        input_cost = (input_tokens / 1000000) * input_price_per_1m
        output_cost = (output_tokens / 1000000) * output_price_per_1m
        return round(input_cost + output_cost, 6)


# 全局LLM服务实例
llm_service = LLMService()