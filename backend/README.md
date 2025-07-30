# FastAPI Backend for Quiz-Lib

AI驱动的题库生成系统后端API服务

## 项目结构

```
fastapi-backend/
├── app/                  # 主应用目录
│   ├── __init__.py      # Python包标识文件
│   ├── main.py          # 应用入口
│   ├── api/             # API路由
│   ├── core/            # 核心配置
│   ├── db/              # 数据库相关
│   ├── models/          # 数据模型
│   ├── schemas/         # Pydantic模型
│   ├── services/        # 业务逻辑
│   └── utils/           # 工具函数
├── tests/               # 测试文件
├── requirements.txt     # 依赖列表
├── .env.example        # 环境变量模板
└── run.py              # 启动脚本
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑.env文件，填入你的配置
```

### 3. 启动应用

```bash
python run.py
```

应用将在 http://localhost:8000 启动

### 4. 查看API文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 功能特性

### 1. Prompt配置区
- 支持多种AI模型（GPT-4, Claude, Gemini等）
- 可调节参数（temperature, max_tokens, top_p等）
- Prompt模板管理

### 2. 结构化结果区
- 生成结构化内容大纲
- 支持章节管理
- AI推荐最佳回答机制

### 3. 题目生成区
- 根据章节内容自动生成题目
- 支持选择题、填空题等多种题型
- 提供答案解析

### 4. 性能监控区
- API调用统计
- 成本分析
- 响应时间监控

## 测试

运行所有测试：

```bash
pytest
```

运行特定测试：

```bash
pytest tests/test_knowledge_api.py -v
```

## 开发

### 代码格式化

```bash
black app/ tests/
```

### 类型检查

```bash
mypy app/
```

### 代码质量检查

```bash
ruff app/ tests/
```