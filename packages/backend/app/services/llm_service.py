from typing import Dict, Any, Optional, AsyncGenerator
import openai
import anthropic
import google.generativeai as genai
from core.config import settings
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
        
        provider = self._get_provider(model)
        
        if provider == "openai":
            return await self._generate_openai(
                prompt, model, temperature, max_tokens, top_p, stream
            )
        elif provider == "anthropic":
            return await self._generate_anthropic(
                prompt, model, temperature, max_tokens, top_p, stream
            )
        elif provider == "google":
            return await self._generate_google(
                prompt, model, temperature, max_tokens, top_p, stream
            )
        else:
            raise ValueError(f"不支持的模型: {model}")
    
    def _get_provider(self, model: str) -> str:
        """获取模型提供商"""
        if model.startswith("gpt"):
            return "openai"
        elif model.startswith("claude"):
            return "anthropic"
        elif model.startswith("gemini"):
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