import pytest
from unittest.mock import patch, AsyncMock, MagicMock
import json

from app.services.llm_service import LLMService, llm_service


class TestLLMService:
    """测试LLM服务"""

    @pytest.fixture
    def service(self):
        """创建LLM服务实例"""
        return LLMService()

    def test_parse_json_response_valid_json(self, service):
        """测试解析有效JSON响应"""
        json_string = '{"key": "value", "number": 123}'
        result = service.parse_json_response(json_string)
        
        assert result == {"key": "value", "number": 123}

    def test_parse_json_response_json_with_markdown(self, service):
        """测试解析带Markdown包装的JSON"""
        content = '''```json
        {"chapters": [{"title": "test"}]}
        ```'''
        result = service.parse_json_response(content)
        
        assert result == {"chapters": [{"title": "test"}]}

    def test_parse_json_response_invalid_json(self, service):
        """测试解析无效JSON"""
        invalid_json = "This is not JSON"
        result = service.parse_json_response(invalid_json)
        
        assert result is None

    def test_parse_json_response_empty_string(self, service):
        """测试解析空字符串"""
        result = service.parse_json_response("")
        assert result is None

    def test_calculate_cost(self, service):
        """测试成本计算"""
        cost = service.calculate_cost(
            input_tokens=1000,
            output_tokens=500,
            input_price_per_1k=0.03,
            output_price_per_1k=0.06
        )
        
        expected_cost = (1000 * 0.03 / 1000) + (500 * 0.06 / 1000)
        assert cost == expected_cost

    def test_calculate_cost_zero_tokens(self, service):
        """测试零token的成本计算"""
        cost = service.calculate_cost(
            input_tokens=0,
            output_tokens=0,
            input_price_per_1k=0.03,
            output_price_per_1k=0.06
        )
        
        assert cost == 0.0

    @pytest.mark.asyncio
    async def test_generate_openai_success(self, service):
        """测试OpenAI生成成功"""
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Generated content"
        mock_response.choices[0].finish_reason = "stop"
        mock_response.usage.prompt_tokens = 100
        mock_response.usage.completion_tokens = 50
        mock_response.usage.total_tokens = 150
        
        with patch.object(service, 'openai_client') as mock_client:
            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
            
            with patch('time.time', side_effect=[0, 1.5]):  # Mock response time
                result = await service.generate(
                    prompt="Test prompt",
                    model="gpt-4",
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=0.9
                )
        
        assert result["success"] is True
        assert result["content"] == "Generated content"
        assert result["usage"]["prompt_tokens"] == 100
        assert result["usage"]["completion_tokens"] == 50
        assert result["response_time_ms"] == 1500

    @pytest.mark.asyncio
    async def test_generate_openai_error(self, service):
        """测试OpenAI生成错误"""
        with patch('openai.AsyncOpenAI') as mock_openai:
            mock_client = AsyncMock()
            mock_openai.return_value = mock_client
            mock_client.chat.completions.create.side_effect = Exception("API Error")
            
            with patch('time.time', side_effect=[0, 1.0]):
                result = await service.generate(
                    prompt="Test prompt",
                    model="gpt-4",
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=0.9
                )
        
        assert result["success"] is False
        assert "API Error" in result["error"]
        assert result["response_time_ms"] == 1000

    @pytest.mark.asyncio
    async def test_generate_anthropic_success(self, service):
        """测试Anthropic生成成功"""
        mock_response = AsyncMock()
        mock_response.content = [AsyncMock()]
        mock_response.content[0].text = "Generated content"
        mock_response.usage.input_tokens = 80
        mock_response.usage.output_tokens = 40
        
        with patch('anthropic.AsyncAnthropic') as mock_anthropic:
            mock_client = AsyncMock()
            mock_anthropic.return_value = mock_client
            mock_client.messages.create.return_value = mock_response
            
            with patch('time.time', side_effect=[0, 1.2]):
                result = await service.generate(
                    prompt="Test prompt",
                    model="claude-3-sonnet",
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=0.9
                )
        
        assert result["success"] is True
        assert result["content"] == "Generated content"
        assert result["usage"]["prompt_tokens"] == 80
        assert result["usage"]["completion_tokens"] == 40
        assert result["response_time_ms"] == 1200

    @pytest.mark.asyncio
    async def test_generate_google_success(self, service):
        """测试Google生成成功"""
        mock_response = AsyncMock()
        mock_response.text = "Generated content"
        mock_response.usage_metadata.prompt_token_count = 90
        mock_response.usage_metadata.candidates_token_count = 60
        
        with patch('google.generativeai.GenerativeModel') as mock_google:
            mock_model = AsyncMock()
            mock_google.return_value = mock_model
            mock_model.generate_content_async.return_value = mock_response
            
            with patch('time.time', side_effect=[0, 1.8]):
                result = await service.generate(
                    prompt="Test prompt",
                    model="gemini-pro",
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=0.9
                )
        
        assert result["success"] is True
        assert result["content"] == "Generated content"
        assert result["usage"]["prompt_tokens"] == 90
        assert result["usage"]["completion_tokens"] == 60
        assert result["response_time_ms"] == 1800

    @pytest.mark.asyncio
    async def test_generate_unsupported_model(self, service):
        """测试不支持的模型"""
        result = await service.generate(
            prompt="Test prompt",
            model="unsupported-model",
            temperature=0.7,
            max_tokens=1000,
            top_p=0.9
        )
        
        assert result["success"] is False
        assert "Unsupported model" in result["error"]

    def test_extract_json_from_markdown(self, service):
        """测试从Markdown中提取JSON"""
        markdown_content = '''
        Here is some text
        
        ```json
        {"key": "value"}
        ```
        
        More text here
        '''
        
        result = service._extract_json_from_markdown(markdown_content)
        assert result == '{"key": "value"}'

    def test_extract_json_from_markdown_no_json(self, service):
        """测试从没有JSON的Markdown中提取"""
        markdown_content = '''
        Here is some text without JSON blocks
        '''
        
        result = service._extract_json_from_markdown(markdown_content)
        assert result == markdown_content

    def test_extract_json_from_markdown_multiple_blocks(self, service):
        """测试从包含多个JSON块的Markdown中提取第一个"""
        markdown_content = '''
        ```json
        {"first": "block"}
        ```
        
        Some text
        
        ```json
        {"second": "block"}
        ```
        '''
        
        result = service._extract_json_from_markdown(markdown_content)
        assert result == '{"first": "block"}'