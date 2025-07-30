import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


class TestGenerationAPI:
    """测试生成API"""

    @pytest.mark.asyncio
    async def test_generate_outline_success(self, client: AsyncClient, sample_model, db_session: AsyncSession):
        """测试成功生成大纲"""
        # Mock LLM service response
        mock_llm_response = {
            "success": True,
            "content": '{"chapters": [{"chapter_number": 1, "title": "测试章节", "content": "测试内容"}]}',
            "usage": {"prompt_tokens": 100, "completion_tokens": 200},
            "response_time_ms": 1500
        }
        
        with patch('app.services.llm_service.llm_service.generate', new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = mock_llm_response
            
            with patch('app.services.llm_service.llm_service.parse_json_response') as mock_parse:
                mock_parse.return_value = {
                    "chapters": [
                        {
                            "chapter_number": 1,
                            "title": "测试章节",
                            "content": "测试内容"
                        }
                    ]
                }
                
                with patch('app.services.llm_service.llm_service.calculate_cost') as mock_cost:
                    mock_cost.return_value = 0.01
                    
                    response = await client.post(
                        "/api/v1/generation/outline",
                        json={
                            "title": "测试主题",
                            "model_id": sample_model.id,
                            "temperature": 0.7,
                            "max_tokens": 2000,
                            "top_p": 0.9,
                            "outline_prompt": "生成大纲"
                        }
                    )
        
        assert response.status_code == 200
        data = response.json()
        assert data["knowledge_id"] is not None
        assert data["content"]["chapters"][0]["title"] == "测试章节"
        assert data["input_tokens"] == 100
        assert data["output_tokens"] == 200
        assert data["cost"] == 0.01

    @pytest.mark.asyncio
    async def test_generate_outline_model_not_found(self, client: AsyncClient):
        """测试模型不存在的情况"""
        response = await client.post(
            "/api/v1/generation/outline",
            json={
                "title": "测试主题",
                "model_id": 999,  # 不存在的模型ID
                "temperature": 0.7,
                "max_tokens": 2000,
                "top_p": 0.9
            }
        )
        
        assert response.status_code == 404
        assert "Model not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_generate_outline_llm_failure(self, client: AsyncClient, sample_model):
        """测试LLM调用失败的情况"""
        mock_llm_response = {
            "success": False,
            "error": "API调用失败",
            "response_time_ms": 1000
        }
        
        with patch('app.services.llm_service.llm_service.generate', new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = mock_llm_response
            
            response = await client.post(
                "/api/v1/generation/outline",
                json={
                    "title": "测试主题",
                    "model_id": sample_model.id,
                    "temperature": 0.7,
                    "max_tokens": 2000,
                    "top_p": 0.9
                }
            )
        
        assert response.status_code == 500
        assert "Failed to generate outline" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_generate_quiz_success(self, client: AsyncClient, sample_chapter, sample_model):
        """测试成功生成题目"""
        mock_llm_response = {
            "success": True,
            "content": '{"quizzes": [{"question_number": 1, "question": "测试题目", "options": {"A": "选项A", "B": "选项B"}, "correct_answer": "A", "explanation": "解析"}]}',
            "usage": {"prompt_tokens": 80, "completion_tokens": 150},
            "response_time_ms": 1200
        }
        
        with patch('app.services.llm_service.llm_service.generate', new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = mock_llm_response
            
            with patch('app.services.llm_service.llm_service.parse_json_response') as mock_parse:
                mock_parse.return_value = {
                    "quizzes": [
                        {
                            "question_number": 1,
                            "question": "测试题目",
                            "options": {"A": "选项A", "B": "选项B"},
                            "correct_answer": "A",
                            "explanation": "解析"
                        }
                    ]
                }
                
                with patch('app.services.llm_service.llm_service.calculate_cost') as mock_cost:
                    mock_cost.return_value = 0.008
                    
                    response = await client.post(
                        "/api/v1/generation/quiz",
                        json={
                            "chapter_id": sample_chapter.id,
                            "model_id": sample_model.id,
                            "question_count": 1,
                            "temperature": 0.7,
                            "max_tokens": 1000,
                            "top_p": 0.9,
                            "quiz_prompt": "生成题目"
                        }
                    )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["question"] == "测试题目"
        assert data[0]["correct_answer"] == "A"
        assert data[0]["explanation"] == "解析"

    @pytest.mark.asyncio
    async def test_generate_quiz_chapter_not_found(self, client: AsyncClient, sample_model):
        """测试章节不存在的情况"""
        response = await client.post(
            "/api/v1/generation/quiz",
            json={
                "chapter_id": 999,  # 不存在的章节ID
                "model_id": sample_model.id,
                "question_count": 5,
                "temperature": 0.7,
                "max_tokens": 1000,
                "top_p": 0.9
            }
        )
        
        assert response.status_code == 404
        assert "Chapter not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_generate_quiz_parse_failure(self, client: AsyncClient, sample_chapter, sample_model):
        """测试解析响应失败的情况"""
        mock_llm_response = {
            "success": True,
            "content": "invalid json response",
            "usage": {"prompt_tokens": 80, "completion_tokens": 150},
            "response_time_ms": 1200
        }
        
        with patch('app.services.llm_service.llm_service.generate', new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = mock_llm_response
            
            with patch('app.services.llm_service.llm_service.parse_json_response') as mock_parse:
                mock_parse.return_value = None  # 解析失败
                
                response = await client.post(
                    "/api/v1/generation/quiz",
                    json={
                        "chapter_id": sample_chapter.id,
                        "model_id": sample_model.id,
                        "question_count": 5,
                        "temperature": 0.7,
                        "max_tokens": 1000,
                        "top_p": 0.9
                    }
                )
        
        assert response.status_code == 400
        assert "Failed to parse quiz response" in response.json()["detail"]