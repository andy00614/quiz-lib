#!/usr/bin/env python3
"""
检查和修复依赖问题
"""
import sys
import subprocess

def check_and_install_deps():
    """检查并安装必要的依赖"""
    print("🔍 检查Python环境和依赖...")
    
    # 检查Python版本
    print(f"Python版本: {sys.version}")
    
    # 检查关键依赖
    required_packages = [
        "fastapi",
        "uvicorn", 
        "sqlalchemy",
        "asyncpg",
        "pydantic",
        "pydantic-settings",
        "structlog"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            print(f"✅ {package} - 已安装")
        except ImportError:
            print(f"❌ {package} - 未安装")
            missing_packages.append(package)
    
    # 检查psycopg2冲突
    try:
        import psycopg2
        print("⚠️  检测到 psycopg2，这可能与 asyncpg 冲突")
        print("建议卸载: pip uninstall psycopg2 psycopg2-binary")
    except ImportError:
        print("✅ 没有检测到 psycopg2 冲突")
    
    # 检查asyncpg
    try:
        import asyncpg
        print("✅ asyncpg - 已安装且可用")
    except ImportError:
        print("❌ asyncpg - 未安装或不可用")
        missing_packages.append("asyncpg")
    
    if missing_packages:
        print(f"\n🔧 需要安装以下依赖: {', '.join(missing_packages)}")
        print("运行: pip install -r requirements.txt")
        return False
    
    print("\n🎉 所有依赖检查通过！")
    return True

def test_database_connection():
    """测试数据库连接字符串"""
    try:
        from app.core.config import settings
        print(f"\n🔗 数据库连接字符串: {settings.DATABASE_URL}")
        
        # 检查URL格式
        if "postgresql+asyncpg://" not in settings.DATABASE_URL:
            print("❌ 数据库URL应该使用 postgresql+asyncpg:// 前缀")
            return False
        
        print("✅ 数据库URL格式正确")
        return True
        
    except Exception as e:
        print(f"❌ 配置加载失败: {e}")
        return False

if __name__ == "__main__":
    print("=== Quiz-Lib Backend 依赖检查 ===\n")
    
    deps_ok = check_and_install_deps()
    db_ok = test_database_connection()
    
    if deps_ok and db_ok:
        print("\n✅ 环境检查通过，可以启动应用！")
        sys.exit(0)
    else:
        print("\n❌ 环境检查失败，请解决上述问题后重试")
        sys.exit(1)