# Docker部署指南

## 快速开始

### 1. 构建镜像
```bash
./docker-build.sh
```

### 2. 运行容器
```bash
./docker-run.sh
```

### 3. 使用docker-compose（推荐）
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 环境配置

确保在backend目录下有`.env`文件，包含以下配置：

```env
# 数据库配置
DATABASE_URL=postgresql+asyncpg://user:password@host/database

# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key

# CORS配置
ALLOWED_ORIGINS=["http://localhost:3000"]

# 安全配置
SECRET_KEY=your_secret_key_here
```

## 生产环境部署

### 1. 构建生产镜像
```bash
docker build -t quiz-lib-backend:prod -f Dockerfile .
```

### 2. 使用环境变量运行
```bash
docker run -d \
    --name quiz-lib-backend \
    -p 8000:8000 \
    --env-file .env.production \
    --restart always \
    quiz-lib-backend:prod
```

### 3. 健康检查
```bash
curl http://localhost:8000/health
```

## 常用命令

```bash
# 查看容器日志
docker logs -f quiz-lib-backend

# 进入容器
docker exec -it quiz-lib-backend bash

# 查看容器状态
docker ps --filter name=quiz-lib-backend

# 重启容器
docker restart quiz-lib-backend

# 停止并删除容器
docker stop quiz-lib-backend && docker rm quiz-lib-backend
```

## 故障排查

1. **容器启动失败**
   - 检查端口8000是否被占用
   - 检查.env文件配置是否正确
   - 查看容器日志：`docker logs quiz-lib-backend`

2. **数据库连接失败**
   - 确认DATABASE_URL配置正确
   - 检查数据库服务是否可访问
   - 容器内测试连接：`docker exec -it quiz-lib-backend python -m scripts.init_db`

3. **API无法访问**
   - 确认容器正在运行：`docker ps`
   - 检查端口映射：`docker port quiz-lib-backend`
   - 测试健康检查：`curl http://localhost:8000/health`