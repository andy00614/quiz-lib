# Quiz-Lib 项目结构

## 重构完成总结

✅ 已成功将项目重构为前后端分离的 monorepo 结构

## 最终目录结构

```
quiz-lib/                    # 根项目目录
├── frontend/               # Next.js 前端项目
│   ├── src/               # 前端源代码
│   ├── public/            # 静态资源
│   ├── tests/             # 前端测试
│   ├── package.json       # 前端依赖配置
│   └── ...                # 其他前端配置文件
├── backend/               # FastAPI 后端项目
│   ├── app/              # 后端应用代码
│   │   ├── api/         # API 路由
│   │   ├── core/        # 核心配置
│   │   ├── db/          # 数据库相关
│   │   ├── models/      # 数据模型
│   │   ├── schemas/     # Pydantic 模型
│   │   ├── services/    # 业务逻辑
│   │   └── utils/       # 工具函数
│   ├── tests/           # 后端测试
│   ├── requirements.txt # Python 依赖
│   ├── run.py          # 启动脚本
│   └── README.md       # 后端文档
├── package.json         # Monorepo 根配置
├── README.md           # 项目主文档
├── CLAUDE.md           # Claude 配置
└── LICENSE             # 许可证
```

## 项目特点

### ✅ 清晰的目录分离
- **frontend/**: 完整的 Next.js 前端项目，包含所有 React 组件、页面、样式等
- **backend/**: 独立的 FastAPI 后端项目，按照 Python Web 应用最佳实践组织

### ✅ Monorepo 管理
- 使用 pnpm workspaces 管理前端依赖
- 根目录提供统一的脚本命令
- 支持同时启动前后端开发服务器

### ✅ 完整的测试覆盖
- 后端包含完整的单元测试套件
- 前端保留原有的测试结构
- 支持分别运行前后端测试

### ✅ 开发体验优化
- 一键安装所有依赖：`pnpm run install:all`
- 同时启动前后端：`pnpm dev`
- 独立启动：`pnpm dev:frontend` / `pnpm dev:backend`

## 使用指南

### 安装依赖
```bash
pnpm run install:all
```

### 开发模式
```bash
# 同时启动前后端
pnpm dev

# 分别启动
pnpm dev:frontend  # http://localhost:3000
pnpm dev:backend   # http://localhost:8000
```

### 测试
```bash
# 运行所有测试
pnpm test

# 分别测试
pnpm test:frontend
pnpm test:backend
```

### 构建
```bash
# 构建前端
pnpm build
```

## 技术栈

### 前端 (frontend/)
- **框架**: Next.js 15 with App Router
- **UI**: Radix UI + Tailwind CSS
- **状态管理**: Zustand + SWR
- **认证**: Better Auth
- **数据库**: PostgreSQL + Drizzle ORM

### 后端 (backend/)  
- **框架**: FastAPI
- **数据库**: PostgreSQL + SQLAlchemy
- **AI 集成**: OpenAI, Anthropic, Google Gemini
- **测试**: Pytest + AsyncIO
- **监控**: Prometheus + Structlog

## 验证结果

✅ 后端测试: 11/11 通过  
✅ 基本功能: API 路由正常  
✅ 项目结构: 清晰分离  
✅ 文档: 完整更新  

重构完成，功能完全保持不变！