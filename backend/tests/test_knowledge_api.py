import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


class TestKnowledgeAPI:
    """测试知识管理API"""

    @pytest.mark.asyncio
    async def test_list_knowledge_empty(self, client: AsyncClient):
        """测试空知识列表"""
        response = await client.get("/api/v1/knowledge/")
        
        assert response.status_code == 200
        data = response.json()
        assert data == []

    @pytest.mark.asyncio
    async def test_list_knowledge_with_data(self, client: AsyncClient, sample_knowledge):
        """测试有数据的知识列表"""
        response = await client.get("/api/v1/knowledge/")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == sample_knowledge.id
        assert data[0]["title"] == sample_knowledge.title
        assert data[0]["status"] == sample_knowledge.status

    @pytest.mark.asyncio
    async def test_list_knowledge_with_status_filter(self, client: AsyncClient, sample_knowledge, db_session: AsyncSession):
        """测试按状态过滤知识列表"""
        from app.db.models import KnowledgeRecord
        
        # 创建另一个不同状态的记录
        completed_knowledge = KnowledgeRecord(
            title="已完成的知识",
            model_id=sample_knowledge.model_id,
            temperature=0.7,
            max_tokens=2000,
            top_p=0.9,
            status="completed"
        )
        db_session.add(completed_knowledge)
        await db_session.commit()
        
        # 测试过滤pending状态
        response = await client.get("/api/v1/knowledge/?status_filter=pending")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "pending"
        
        # 测试过滤completed状态
        response = await client.get("/api/v1/knowledge/?status_filter=completed")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "completed"

    @pytest.mark.asyncio
    async def test_get_knowledge_success(self, client: AsyncClient, sample_knowledge):
        """测试获取指定知识记录成功"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_knowledge.id
        assert data["title"] == sample_knowledge.title
        assert data["model_id"] == sample_knowledge.model_id

    @pytest.mark.asyncio
    async def test_get_knowledge_not_found(self, client: AsyncClient):
        """测试获取不存在的知识记录"""
        response = await client.get("/api/v1/knowledge/999")
        
        assert response.status_code == 404
        assert "Knowledge record not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_create_knowledge_success(self, client: AsyncClient, sample_model):
        """测试创建知识记录成功"""
        knowledge_data = {
            "title": "新的知识点",
            "model_id": sample_model.id,
            "temperature": 0.8,
            "max_tokens": 3000,
            "top_p": 0.95,
            "status": "pending"
        }
        
        response = await client.post("/api/v1/knowledge/", json=knowledge_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == knowledge_data["title"]
        assert data["model_id"] == knowledge_data["model_id"]
        assert data["temperature"] == knowledge_data["temperature"]
        assert data["status"] == knowledge_data["status"]

    @pytest.mark.asyncio
    async def test_create_knowledge_model_not_found(self, client: AsyncClient):
        """测试创建知识记录时模型不存在"""
        knowledge_data = {
            "title": "测试知识点",
            "model_id": 999,  # 不存在的模型ID
            "temperature": 0.7,
            "max_tokens": 2000,
            "top_p": 0.9,
            "status": "pending"
        }
        
        response = await client.post("/api/v1/knowledge/", json=knowledge_data)
        
        assert response.status_code == 404
        assert "Model not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_update_knowledge_success(self, client: AsyncClient, sample_knowledge):
        """测试更新知识记录成功"""
        update_data = {
            "title": "更新后的标题",
            "status": "completed",
            "temperature": 0.5
        }
        
        response = await client.put(f"/api/v1/knowledge/{sample_knowledge.id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["status"] == update_data["status"]
        assert data["temperature"] == update_data["temperature"]

    @pytest.mark.asyncio
    async def test_update_knowledge_not_found(self, client: AsyncClient):
        """测试更新不存在的知识记录"""
        update_data = {"title": "更新标题"}
        
        response = await client.put("/api/v1/knowledge/999", json=update_data)
        
        assert response.status_code == 404
        assert "Knowledge record not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_delete_knowledge_success(self, client: AsyncClient, sample_knowledge):
        """测试删除知识记录成功"""
        response = await client.delete(f"/api/v1/knowledge/{sample_knowledge.id}")
        
        assert response.status_code == 204
        
        # 验证记录已被删除
        get_response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}")
        assert get_response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_knowledge_not_found(self, client: AsyncClient):
        """测试删除不存在的知识记录"""
        response = await client.delete("/api/v1/knowledge/999")
        
        assert response.status_code == 404
        assert "Knowledge record not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_get_knowledge_outline_success(self, client: AsyncClient, sample_knowledge, sample_outline):
        """测试获取知识大纲成功"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}/outline")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_outline.id
        assert data["knowledge_id"] == sample_knowledge.id
        assert "chapters" in data["content"]

    @pytest.mark.asyncio
    async def test_get_knowledge_outline_not_found(self, client: AsyncClient, sample_knowledge):
        """测试获取不存在的知识大纲"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}/outline")
        
        assert response.status_code == 404
        assert "Outline not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_get_knowledge_chapters_success(self, client: AsyncClient, sample_knowledge, sample_outline, sample_chapter):
        """测试获取知识章节成功"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}/chapters")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == sample_chapter.id
        assert data[0]["title"] == sample_chapter.title
        assert data[0]["chapter_number"] == sample_chapter.chapter_number

    @pytest.mark.asyncio
    async def test_get_knowledge_chapters_no_outline(self, client: AsyncClient, sample_knowledge):
        """测试获取没有大纲的知识章节"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}/chapters")
        
        assert response.status_code == 404
        assert "Outline not found" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_get_chapter_quizzes_success(self, client: AsyncClient, sample_knowledge, sample_chapter, sample_quiz):
        """测试获取章节题目成功"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}/chapters/{sample_chapter.id}/quizzes")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == sample_quiz.id
        assert data[0]["question"] == sample_quiz.question
        assert data[0]["correct_answer"] == sample_quiz.correct_answer

    @pytest.mark.asyncio
    async def test_get_chapter_quizzes_chapter_not_found(self, client: AsyncClient, sample_knowledge):
        """测试获取不存在章节的题目"""
        response = await client.get(f"/api/v1/knowledge/{sample_knowledge.id}/chapters/999/quizzes")
        
        assert response.status_code == 404
        assert "Chapter not found" in response.json()["detail"]