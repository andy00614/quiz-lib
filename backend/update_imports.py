#!/usr/bin/env python3
"""
更新导入路径的脚本
"""
import os
import re


def update_imports_in_file(file_path):
    """更新单个文件的导入路径"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 更新导入路径映射
        import_mappings = {
            'from core.database.connection': 'from app.db.connection',
            'from core.database.models': 'from app.db.models',
            'from core.database.base': 'from app.db.base',
            'from core.config.settings': 'from app.core.config.settings',
            'from core.config': 'from app.core.config',
            'from core.schemas': 'from app.core.schemas',
            'from app.middleware.logging': 'from app.utils.logging',
            'from app.middleware.error_handler': 'from app.utils.error_handler',
            'import core.database.models': 'import app.db.models',
            'import core.config.settings': 'import app.core.config.settings',
        }
        
        # 应用替换
        for old_import, new_import in import_mappings.items():
            content = content.replace(old_import, new_import)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated imports in: {file_path}")
        
    except Exception as e:
        print(f"Error updating {file_path}: {e}")


def main():
    """主函数"""
    # 需要更新的目录
    directories = [
        'app/api',
        'app/services', 
        'app/schemas',
        'app/models',
        'app/utils',
        'app/db',
        'app/core',
        'tests'
    ]
    
    for directory in directories:
        if os.path.exists(directory):
            for root, dirs, files in os.walk(directory):
                for file in files:
                    if file.endswith('.py'):
                        file_path = os.path.join(root, file)
                        update_imports_in_file(file_path)


if __name__ == "__main__":
    main()