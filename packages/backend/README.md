# Quiz-Lib 后端服务

基于 FastAPI 构建的 AI 驱动题库生成系统后端服务。

## 功能特性

- **Prompt 配置管理**：支持创建、管理和复用 Prompt 模板
- **多模型支持**：集成 OpenAI、Anthropic、Google 等主流 AI 模型
- **结构化内容生成**：生成大纲、章节内容等结构化数据
- **智能题目生成**：基于内容自动生成多种类型的题目
- **性能监控**：API 调用监控、成本统计、性能分析
- **异步架构**：基于 SQLAlchemy 异步引擎的高性能数据库操作

## 技术栈

- **框架**：FastAPI
- **数据库**：PostgreSQL + SQLAlchemy (异步)
- **AI 集成**：OpenAI、Anthropic、Google Gemini
- **日志**：structlog
- **开发工具**：Black、Ruff、MyPy

## 快速开始

### 1. 环境要求

- Python 3.8+
- PostgreSQL 12+
- Redis (可选，用于缓存)

### 2. 安装依赖

```bash
cd packages/backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 3. 环境配置

复制环境变量模板并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下关键参数：

```env
# 数据库配置
DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/quiz_lib"

# AI 模型 API 密钥（至少配置一个）
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_API_KEY="your-google-api-key"
```

### 4. 初始化数据库

```bash
# 创建数据库（PostgreSQL）
createdb quiz_lib

# 运行数据库初始化脚本
python scripts/init_db.py
```

### 5. 启动服务

开发环境：

```bash
python run.py
```

生产环境：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

服务启动后访问：
- API 文档：http://localhost:8000/docs
- ReDoc 文档：http://localhost:8000/redoc

## 项目结构

```
packages/backend/
├── app/                    # 应用代码
│   ├── api/               # API 路由
│   │   ├── prompts.py     # Prompt 相关接口
│   │   ├── results.py     # 结果管理接口
│   │   ├── quiz.py        # 题目生成接口
│   │   └── monitoring.py  # 监控统计接口
│   ├── models/            # 数据库模型
│   ├── schemas/           # Pydantic 模型
│   ├── services/          # 业务服务
│   ├── middleware/        # 中间件
│   └── main.py           # 应用入口
├── core/                  # 核心模块
│   ├── config/           # 配置管理
│   ├── database/         # 数据库连接
│   └── schemas/          # 基础模型
├── scripts/              # 脚本工具
├── tests/                # 测试代码
└── requirements.txt      # 依赖清单
```

## API 概览

### Prompt 管理

- `GET /api/v1/prompts/models` - 获取可用模型列表
- `POST /api/v1/prompts/templates` - 创建模板
- `GET /api/v1/prompts/templates` - 获取模板列表
- `POST /api/v1/prompts/playground` - Prompt 测试
- `POST /api/v1/prompts/execute` - 执行模板

### 结果管理

- `GET /api/v1/results` - 获取生成结果列表
- `GET /api/v1/results/{result_id}` - 获取结果详情

### 题目生成

- `GET /api/v1/quiz` - 获取题库列表
- `POST /api/v1/quiz/{result_id}/generate` - 生成题目

### 监控统计

- `GET /api/v1/monitoring/metrics` - 获取性能指标
- `GET /api/v1/monitoring/logs` - 获取调用日志

## 数据库模型

### 核心表结构

- `prompt_templates` - Prompt 模板
- `prompt_executions` - 执行记录
- `generation_results` - 生成结果
- `result_blocks` - 结果内容块
- `quizzes` - 题库
- `questions` - 题目
- `question_options` - 选项
- `api_calls` - API 调用记录
- `model_usage_stats` - 模型使用统计

## 开发指南

### 代码规范

```bash
# 格式化代码
black app/ core/

# 代码检查
ruff app/ core/

# 类型检查
mypy app/ core/
```

### 添加新的 API

1. 在 `app/models/` 中定义数据模型
2. 在 `app/schemas/` 中定义请求/响应模型
3. 在 `app/api/` 中创建路由文件
4. 在 `app/main.py` 中注册路由

### 添加新的 AI 模型

1. 在 `app/services/llm_service.py` 中添加新的生成方法
2. 在 `app/api/prompts.py` 的 `list_available_models` 中添加模型信息

## 部署建议

### Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 性能优化

1. 使用 Redis 缓存频繁访问的数据
2. 配置数据库连接池参数
3. 使用 CDN 存储生成的静态内容
4. 启用 API 速率限制

### 监控告警

1. 配置 Prometheus 监控
2. 设置错误率告警
3. 监控 API 响应时间
4. 跟踪 AI 模型调用成本

## 常见问题

### 数据库连接失败

检查 PostgreSQL 服务是否启动，以及 `DATABASE_URL` 配置是否正确。

### AI 模型调用失败

1. 检查 API 密钥是否正确配置
2. 确认账户余额充足
3. 检查网络连接（某些 API 可能需要代理）

### 性能问题

1. 检查数据库索引
2. 启用查询日志分析慢查询
3. 考虑使用缓存

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License