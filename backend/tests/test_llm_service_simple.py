import pytest
import json

from app.services.llm_service import LLMService


class TestLLMServiceSimple:
    """测试LLM服务基础功能"""

    @pytest.fixture
    def service(self):
        """创建LLM服务实例"""
        return LLMService()

    def test_get_provider_openai(self, service):
        """测试识别OpenAI模型提供商"""
        assert service._get_provider("gpt-4") == "openai"
        assert service._get_provider("GPT-3.5-turbo") == "openai"

    def test_get_provider_anthropic(self, service):
        """测试识别Anthropic模型提供商"""
        assert service._get_provider("claude-3-sonnet") == "anthropic"
        assert service._get_provider("CLAUDE-2") == "anthropic"

    def test_get_provider_google(self, service):
        """测试识别Google模型提供商"""
        assert service._get_provider("gemini-pro") == "google"
        assert service._get_provider("GEMINI-1.5-pro") == "google"

    def test_get_provider_unsupported(self, service):
        """测试不支持的模型"""
        with pytest.raises(ValueError, match="无法识别模型提供商"):
            service._get_provider("unknown-model")

    def test_parse_json_response_valid_json(self, service):
        """测试解析有效JSON响应"""
        json_string = '{"key": "value", "number": 123}'
        result = service.parse_json_response(json_string)
        
        assert result == {"key": "value", "number": 123}

    def test_parse_json_response_with_extra_text(self, service):
        """测试解析带额外文本的JSON"""
        content = 'Here is the result: {"chapters": [{"title": "test"}]} and some more text'
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

    def test_calculate_cost_precision(self, service):
        """测试成本计算精度"""
        cost = service.calculate_cost(
            input_tokens=123,
            output_tokens=456,
            input_price_per_1k=0.001234,
            output_price_per_1k=0.005678
        )
        
        # 应该保留6位小数
        expected = round((123 * 0.001234 / 1000) + (456 * 0.005678 / 1000), 6)
        assert cost == expected