.PHONY: help install dev test lint format clean init-db run

help:
	@echo "可用命令："
	@echo "  make install   - 安装依赖"
	@echo "  make dev       - 启动开发服务器"
	@echo "  make test      - 运行测试"
	@echo "  make lint      - 代码检查"
	@echo "  make format    - 代码格式化"
	@echo "  make init-db   - 初始化数据库"
	@echo "  make clean     - 清理缓存文件"

install:
	pip install -r requirements.txt

dev:
	python run.py

test:
	pytest tests/

lint:
	ruff app/ core/
	mypy app/ core/

format:
	black app/ core/

init-db:
	python scripts/init_db.py

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name ".coverage" -delete
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/

run: dev