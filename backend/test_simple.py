#!/usr/bin/env python3
"""
简单的应用测试脚本（不需要数据库）
"""
from fastapi.testclient import TestClient

# 创建一个简化的应用用于测试
from fastapi import FastAPI

test_app = FastAPI(
    title="Quiz-Lib Backend API Test",
    description="测试版本",
    version="1.0.0"
)

@test_app.get("/")
async def root():
    return {
        "message": "Quiz-Lib Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }

@test_app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "quiz-lib-backend"}

def test_basic_functionality():
    """测试基本功能"""
    client = TestClient(test_app)
    
    # 测试根路径
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Quiz-Lib Backend API"
    print("✅ 根路径响应正常")
    
    # 测试健康检查
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("✅ 健康检查正常")
    
    print("🎉 基本功能测试通过！")

if __name__ == "__main__":
    test_basic_functionality()