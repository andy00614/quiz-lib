#!/usr/bin/env python3
"""
测试应用启动脚本
"""
import asyncio
from app.main import app

async def test_startup():
    """测试应用启动"""
    try:
        # 模拟生命周期管理
        async with app.router.lifespan_context(app) as _:
            print("✅ 应用启动成功")
            
            # 测试基本路由
            from fastapi.testclient import TestClient
            client = TestClient(app)
            
            # 测试根路径
            response = client.get("/")
            assert response.status_code == 200
            print("✅ 根路径响应正常")
            
            # 测试健康检查
            response = client.get("/health")
            assert response.status_code == 200
            print("✅ 健康检查正常")
            
            print("🎉 所有测试通过，应用功能正常！")
            
    except Exception as e:
        print(f"❌ 应用启动失败: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(test_startup())