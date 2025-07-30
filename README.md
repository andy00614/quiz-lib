# Quiz-Lib - AI驱动的题库生成系统

这是一个基于AI的智能题库生成系统，支持多种AI模型，能够根据用户输入的主题自动生成结构化的学习大纲和配套题目。

## 项目结构

```
quiz-lib/
├── frontend/           # Next.js前端应用
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   ├── components/    # React组件
│   └── package.json   # 前端依赖
├── backend/           # FastAPI后端服务
│   ├── app/          # 应用代码
│   ├── tests/        # 测试文件
│   ├── requirements.txt # Python依赖
│   ├── run.py        # 启动脚本
│   └── README.md     # 后端文档
├── package.json      # Monorepo配置
└── README.md        # 项目说明
```

## 功能特性

### 1. Prompt 配置区（Prompt Playground）
- **主题输入**：支持中英文输入，可附带标签
- **模型选择**：支持GPT-4o, Gemini Pro, Claude等主流模型
- **参数控制**：温度、最大token数、top-p等参数调节
- **模板管理**：内置多种Prompt模板，支持变量占位符

### 2. 结构化结果区（Result Block View）
- **结构化显示**：以内容块形式展示生成结果
- **元信息展示**：显示使用的模型、Token数、响应时间等
- **AI推荐机制**：自动评分并推荐最佳回答
- **版本对比**：支持多版本结果对比和选择

### 3. 题目生成区（Quiz Generator）
- **章节联动**：根据大纲章节自动生成对应题目
- **题型多样**：支持选择题、填空题等多种题型
- **批量生成**：默认每章节10题，支持自定义数量
- **导出功能**：支持CSV、JSON、Markdown格式导出

### 4. 性能监控区（Performance Dashboard）
- **实时监控**：响应时间、Token消耗、错误率统计
- **请求日志**：详细的API调用记录
- **成本分析**：不同模型的费用对比和趋势分析
- **可视化图表**：响应时间趋势、成本分布等图表

## 技术栈

### 前端
- **框架**：Next.js 15 (App Router)
- **UI库**：Radix UI + Tailwind CSS
- **状态管理**：Zustand + SWR
- **认证**：Better Auth
- **数据库**：PostgreSQL + Drizzle ORM
- **部署**：Vercel

### 后端
- **框架**：FastAPI
- **数据库**：PostgreSQL + SQLAlchemy
- **AI集成**：OpenAI, Anthropic, Google Gemini
- **监控**：Prometheus + Structlog
- **测试**：Pytest + AsyncIO

## 快速开始

### 1. 环境要求
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- pnpm (推荐)

### 2. 安装依赖
```bash
# 安装所有依赖（前端 + 后端）
pnpm run install:all
```

### 3. 环境配置
```bash
# 前端环境变量
cp frontend/env.example frontend/.env.local

# 后端环境变量  
cp backend/.env.example backend/.env
```

### 4. 启动开发服务器
```bash
# 同时启动前后端（推荐）
pnpm dev

# 或分别启动
pnpm dev:frontend       # 前端：http://localhost:3000
pnpm dev:backend        # 后端（完整模式，包含所有API）：http://localhost:8000
pnpm dev:backend:simple # 后端（简化模式，无需数据库）：http://localhost:8000
```

**注意**: 默认的 `pnpm dev:backend` 使用完整模式，包含所有quiz相关的API。需要确保PostgreSQL已启动并正确配置环境变量。如果只是测试基本功能，可以使用 `pnpm dev:backend:simple`。

### 5. 数据库初始化

**首次使用需要初始化数据库：**

```bash
# 1. 确保PostgreSQL已启动
# 2. 创建数据库（如果还没有的话）
createdb quiz_lib

# 3. 配置后端环境变量
cd backend
cp .env.example .env
# 编辑 .env 文件，填入您的数据库连接信息

# 4. 初始化数据库表和默认数据
python scripts/init_db.py

# 5. 初始化前端数据库（如果需要）
cd ../frontend && pnpm db:migrate
```

## 开发指南

### 前端开发
```bash
cd frontend
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm test         # 运行测试
pnpm typecheck    # 类型检查
```

### 后端开发
```bash
cd backend
python run.py     # 启动开发服务器
pytest           # 运行测试
black app/       # 代码格式化
mypy app/        # 类型检查
```

## API文档

后端API文档可在以下地址查看：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 贡献指南

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。