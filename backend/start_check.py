#!/usr/bin/env python3
"""
启动前检查脚本
"""
import asyncio
import sys

async def test_database_connection():
    """测试数据库连接"""
    try:
        from app.core.config import settings
        from app.db.connection import engine
        
        print(f"🔗 尝试连接数据库...")
        print(f"   URL: {settings.DATABASE_URL.split('@')[0]}@***")
        
        # 测试连接
        async with engine.begin() as conn:
            from sqlalchemy import text
            result = await conn.execute(text("SELECT 1"))
            result.fetchone()
        
        print("✅ 数据库连接成功")
        return True
        
    except Exception as e:
        print(f"❌ 数据库连接失败: {e}")
        print("\n💡 可能的解决方案:")
        print("1. 检查数据库服务是否启动")
        print("2. 检查.env文件中的DATABASE_URL配置")
        print("3. 运行: pnpm init:db 初始化数据库")
        return False
    finally:
        try:
            await engine.dispose()
        except:
            pass

async def main():
    """主检查函数"""
    print("=== Quiz-Lib Backend 启动检查 ===\n")
    
    # 基础依赖检查
    print("1. 检查Python环境...")
    try:
        import fastapi, uvicorn, sqlalchemy, asyncpg
        print("✅ 基础依赖正常")
    except ImportError as e:
        print(f"❌ 依赖缺失: {e}")
        return False
    
    # 配置检查
    print("\n2. 检查配置...")
    try:
        from app.core.config import settings
        if settings.DATABASE_URL.startswith("postgresql+asyncpg://"):
            print("✅ 数据库配置格式正确")
        else:
            print("❌ 数据库URL格式错误")
            return False
    except Exception as e:
        print(f"❌ 配置加载失败: {e}")
        return False
    
    # 数据库连接检查
    print("\n3. 检查数据库连接...")
    db_ok = await test_database_connection()
    
    if db_ok:
        print("\n🎉 所有检查通过！应用可以启动")
        print("\n📋 现在可以访问:")
        print("   • API文档: http://localhost:8000/docs")
        print("   • 健康检查: http://localhost:8000/health")
        print("   • 根路径: http://localhost:8000/")
        return True
    else:
        print("\n❌ 启动检查失败")
        return False

if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)