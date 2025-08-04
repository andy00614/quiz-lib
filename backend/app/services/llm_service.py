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
        
        # 记录API调用开始
        logger.info(
            "llm_api_call_started",
            model=model,
            provider=self._get_provider(model),
            temperature=temperature,
            max_tokens=max_tokens,
            prompt_length=len(prompt)
        )
        
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
            response_time_ms = int((time.time() - start_time) * 1000)
            result["response_time_ms"] = response_time_ms
            result["success"] = True
            
            # 记录API调用成功
            logger.info(
                "llm_api_call_completed",
                model=model,
                provider=provider,
                response_time_ms=response_time_ms,
                prompt_tokens=result.get("usage", {}).get("prompt_tokens", 0),
                completion_tokens=result.get("usage", {}).get("completion_tokens", 0),
                total_tokens=result.get("usage", {}).get("total_tokens", 0)
            )
            
            return result
            
        except Exception as e:
            response_time = int((time.time() - start_time) * 1000)
            
            # 记录API调用失败
            logger.error(
                "llm_api_call_failed",
                model=model,
                provider=self._get_provider(model),
                error=str(e),
                response_time_ms=response_time
            )
            
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
            logger.debug("openai_api_request", model=model, max_tokens=max_tokens)
            
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
                usage = {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
                
                logger.debug(
                    "openai_api_response",
                    model=model,
                    prompt_tokens=usage["prompt_tokens"],
                    completion_tokens=usage["completion_tokens"],
                    finish_reason=response.choices[0].finish_reason
                )
                
                return {
                    "content": content,
                    "model": model,
                    "usage": usage,
                    "finish_reason": response.choices[0].finish_reason
                }
        
        except Exception as e:
            logger.error("openai_api_error", error=str(e), model=model)
            raise
    
    async def _generate_anthropic(
        self, prompt: str, model: str, temperature: float,
        max_tokens: int, top_p: float, stream: bool
    ) -> Dict[str, Any]:
        """使用Anthropic生成"""
        try:
            logger.debug("anthropic_api_request", model=model, max_tokens=max_tokens)
            
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
                usage = {
                    "prompt_tokens": message.usage.input_tokens,
                    "completion_tokens": message.usage.output_tokens,
                    "total_tokens": message.usage.input_tokens + message.usage.output_tokens
                }
                
                logger.debug(
                    "anthropic_api_response",
                    model=model,
                    input_tokens=usage["prompt_tokens"],
                    output_tokens=usage["completion_tokens"],
                    stop_reason=message.stop_reason
                )
                
                return {
                    "content": content,
                    "model": model,
                    "usage": usage,
                    "finish_reason": message.stop_reason
                }
        
        except Exception as e:
            logger.error("anthropic_api_error", error=str(e), model=model)
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
            
            # 在线程池中运行同步代码，带重试机制
            loop = asyncio.get_event_loop()
            
            # 处理配额限制的重试机制
            max_retries = 3
            base_delay = 1  # 基础延迟1秒
            
            for attempt in range(max_retries):
                try:
                    logger.debug("google_api_request", model=model, max_tokens=max_tokens, attempt=attempt+1)
                    
                    response = await loop.run_in_executor(None, _sync_generate)
                    
                    # 估算token数量（粗略估算：1个中文字符约等于2个token，1个英文单词约等于1.3个token）
                    prompt_tokens = self._estimate_tokens(prompt)
                    completion_tokens = self._estimate_tokens(response.text)
                    
                    logger.debug(
                        "google_api_response",
                        model=model,
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens
                    )
                    
                    return {
                        "content": response.text,
                        "model": model,
                        "usage": {
                            "prompt_tokens": prompt_tokens,
                            "completion_tokens": completion_tokens,
                            "total_tokens": prompt_tokens + completion_tokens
                        },
                        "finish_reason": "stop"
                    }
                    
                except Exception as e:
                    error_str = str(e)
                    
                    # 检查是否是配额限制错误
                    if "429" in error_str or "quota" in error_str.lower() or "rate limit" in error_str.lower():
                        if attempt < max_retries - 1:
                            # 配额限制时使用指数退避
                            delay = base_delay * (2 ** attempt)
                            logger.warning(
                                "google_api_rate_limit",
                                model=model,
                                delay_seconds=delay,
                                attempt=attempt + 1,
                                max_retries=max_retries
                            )
                            await asyncio.sleep(delay)
                            continue
                        else:
                            logger.error(
                                "google_api_rate_limit_exceeded",
                                model=model,
                                max_retries=max_retries
                            )
                            raise Exception("Gemini API配额已用完，请稍后重试")
                    
                    # 其他错误直接抛出
                    logger.error("google_api_error", error=str(e), model=model, attempt=attempt+1)
                    raise e
        
        except Exception as e:
            logger.error("google_generation_error", error=str(e), model=model)
            raise
    
    def _estimate_tokens(self, text: str) -> int:
        """估算文本的token数量"""
        if not text:
            return 0
        
        # 粗略估算：
        # - 英文：平均每个单词1.3个token
        # - 中文：每个字符约2个token
        # - 标点符号和空格：1个token
        
        import re
        
        # 分离中文字符
        chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
        
        # 分离英文单词
        english_words = len(re.findall(r'\b[a-zA-Z]+\b', text))
        
        # 其他字符（数字、标点、空格等）
        other_chars = len(text) - chinese_chars - sum(len(word) for word in re.findall(r'\b[a-zA-Z]+\b', text))
        
        # 估算token数
        estimated_tokens = int(
            chinese_chars * 2 +           # 中文字符
            english_words * 1.3 +         # 英文单词
            other_chars * 0.5             # 其他字符
        )
        
        return max(1, estimated_tokens)  # 至少1个token
    
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
                    # 如果markdown中的JSON也被截断，尝试修复
                    fixed_content = self._fix_truncated_json(json_content)
                    if fixed_content:
                        try:
                            return json.loads(fixed_content)
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
                    
                    # 尝试修复被截断的JSON
                    fixed_content = self._fix_truncated_json(json_content)
                    if fixed_content:
                        try:
                            return json.loads(fixed_content)
                        except json.JSONDecodeError:
                            logger.error(f"Failed to fix truncated JSON")
            
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
    
    def _fix_truncated_json(self, json_content: str) -> Optional[str]:
        """尝试修复被截断的JSON，特别是题目数组"""
        try:
            # 查找quizzes数组的开始位置
            import re
            
            # 尝试找到完整的题目项
            quiz_pattern = r'\{\s*"question_number"\s*:\s*\d+,\s*"question"\s*:\s*"[^"]*",\s*"options"\s*:\s*\{[^}]*\},\s*"correct_answer"\s*:\s*"[A-D]",\s*"explanation"\s*:\s*"[^"]*"\s*\}'
            complete_quizzes = re.findall(quiz_pattern, json_content, re.DOTALL)
            
            if complete_quizzes:
                # 构建新的JSON结构，只包含完整的题目
                quizzes_json = '[' + ','.join(complete_quizzes) + ']'
                return f'{{"quizzes": {quizzes_json}}}'
            
            # 如果正则表达式方法失败，尝试按行解析
            lines = json_content.split('\n')
            in_quiz_array = False
            quiz_items = []
            current_quiz = {}
            current_field = None
            brace_count = 0
            
            for line in lines:
                line = line.strip()
                
                # 检测是否进入quizzes数组
                if '"quizzes"' in line and '[' in line:
                    in_quiz_array = True
                    continue
                
                if not in_quiz_array:
                    continue
                
                # 计算大括号层级
                brace_count += line.count('{') - line.count('}')
                
                # 如果遇到新的题目开始
                if line.startswith('{') and brace_count >= 1:
                    if current_quiz:  # 保存前一个题目
                        quiz_items.append(current_quiz)
                    current_quiz = {}
                
                # 解析字段
                if ':' in line and brace_count >= 1:
                    if '"question_number"' in line:
                        try:
                            current_quiz['question_number'] = int(re.search(r':\s*(\d+)', line).group(1))
                        except:
                            pass
                    elif '"question"' in line:
                        match = re.search(r':\s*"([^"]*)"', line)
                        if match:
                            current_quiz['question'] = match.group(1)
                    elif '"correct_answer"' in line:
                        match = re.search(r':\s*"([A-D])"', line)
                        if match:
                            current_quiz['correct_answer'] = match.group(1)
                    elif '"explanation"' in line:
                        match = re.search(r':\s*"([^"]*)"', line)
                        if match:
                            current_quiz['explanation'] = match.group(1)
                
                # 如果遇到题目结束
                if line.endswith('}') and brace_count == 1:
                    if current_quiz and len(current_quiz) >= 3:  # 至少有基本字段
                        quiz_items.append(current_quiz)
                    current_quiz = {}
            
            # 添加最后一个题目
            if current_quiz and len(current_quiz) >= 3:
                quiz_items.append(current_quiz)
            
            # 如果找到了一些完整的题目，构建新的JSON
            if quiz_items:
                # 为每个题目添加默认选项（如果缺失）
                for quiz in quiz_items:
                    if 'options' not in quiz:
                        quiz['options'] = {
                            'A': '选项A',
                            'B': '选项B', 
                            'C': '选项C',
                            'D': '选项D'
                        }
                
                return json.dumps({"quizzes": quiz_items}, ensure_ascii=False)
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to fix truncated JSON: {e}")
            return None
    
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