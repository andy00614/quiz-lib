#!/usr/bin/env python3
"""
开发版启动脚本（无需数据库）
"""
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 创建简化的开发版应用
app = FastAPI(
    title="Quiz-Lib Backend API (Dev)",
    description="AI驱动的题库生成系统后端API - 开发版",
    version="1.0.0-dev",
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "Quiz-Lib Backend API (Dev Mode)",
        "version": "1.0.0-dev",
        "docs": "/docs",
        "redoc": "/redoc",
        "note": "This is a development version without database connection"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "service": "quiz-lib-backend-dev"}

@app.get("/api/v1/models")
async def list_models():
    """模拟模型列表"""
    return [
        {"id": 1, "name": "gpt-4", "display_name": "GPT-4", "provider": "openai"},
        {"id": 2, "name": "claude-3-sonnet", "display_name": "Claude 3 Sonnet", "provider": "anthropic"},
        {"id": 3, "name": "gemini-pro", "display_name": "Gemini Pro", "provider": "google"},
    ]

if __name__ == "__main__":
    uvicorn.run(
        "run_dev:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )