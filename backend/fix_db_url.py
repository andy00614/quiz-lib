#!/usr/bin/env python3
"""
修复数据库URL格式
"""
import os
from pathlib import Path

def fix_database_url():
    """修复.env文件中的数据库URL"""
    env_file = Path(".env")
    
    if not env_file.exists():
        print("❌ .env 文件不存在")
        print("请先运行: cp .env.example .env")
        print("然后编辑 .env 文件设置您的数据库连接信息")
        return False
    
    # 读取当前.env文件
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    # 修复DATABASE_URL
    updated_lines = []
    url_fixed = False
    
    for line in lines:
        if line.startswith("DATABASE_URL="):
            current_url = line.strip().split("=", 1)[1]
            
            # 如果是普通的postgresql://，转换为postgresql+asyncpg://
            if current_url.startswith("postgresql://") and not current_url.startswith("postgresql+asyncpg://"):
                new_url = current_url.replace("postgresql://", "postgresql+asyncpg://", 1)
                updated_lines.append(f"DATABASE_URL={new_url}\n")
                print(f"✅ 数据库URL已修复:")
                print(f"   原: {current_url}")
                print(f"   新: {new_url}")
                url_fixed = True
            else:
                updated_lines.append(line)
                if current_url.startswith("postgresql+asyncpg://"):
                    print("✅ 数据库URL格式已正确")
                    url_fixed = True
        else:
            updated_lines.append(line)
    
    if url_fixed:
        # 写回文件
        with open(env_file, 'w') as f:
            f.writelines(updated_lines)
        print("✅ .env文件已更新")
        return True
    else:
        print("❌ 未找到DATABASE_URL配置")
        return False

if __name__ == "__main__":
    print("=== 修复数据库URL格式 ===\n")
    
    if fix_database_url():
        print("\n🎉 数据库URL修复完成！")
        print("现在可以尝试启动应用: python run.py")
    else:
        print("\n❌ 修复失败，请手动检查.env文件")