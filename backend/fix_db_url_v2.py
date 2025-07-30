#!/usr/bin/env python3
"""
修复数据库URL - 移除SSL参数
"""
from pathlib import Path
from urllib.parse import urlparse, urlunparse, parse_qs

def clean_database_url():
    """清理数据库URL，移除可能冲突的参数"""
    env_file = Path(".env")
    
    if not env_file.exists():
        print("❌ .env 文件不存在")
        return False
    
    # 读取当前.env文件
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    # 处理DATABASE_URL
    updated_lines = []
    
    for line in lines:
        if line.startswith("DATABASE_URL="):
            current_url = line.strip().split("=", 1)[1]
            
            # 解析URL
            parsed = urlparse(current_url)
            
            # 移除查询参数中的SSL相关设置（我们在代码中处理）
            clean_url = urlunparse((
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                "",  # 移除所有查询参数
                parsed.fragment
            ))
            
            updated_lines.append(f"DATABASE_URL={clean_url}\n")
            print(f"✅ 数据库URL已清理:")
            print(f"   原: {current_url}")
            print(f"   新: {clean_url}")
        else:
            updated_lines.append(line)
    
    # 写回文件
    with open(env_file, 'w') as f:
        f.writelines(updated_lines)
    
    print("✅ .env文件已更新")
    return True

if __name__ == "__main__":
    print("=== 清理数据库URL ===\n")
    
    if clean_database_url():
        print("\n🎉 数据库URL清理完成！")
        print("现在SSL配置由代码处理，应该能正常连接")
    else:
        print("\n❌ 清理失败")