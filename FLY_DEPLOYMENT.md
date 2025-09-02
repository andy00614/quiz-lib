# Quiz-Lib Fly.io 部署指南

## 🚀 快速部署

### 前置要求
1. 安装 flyctl CLI: https://fly.io/docs/hands-on/install-flyctl/
2. 注册并登录 Fly.io 账户: `flyctl auth login`
3. 准备环境变量 (API 密钥等)

### 一键部署
```bash
./deploy-fly.sh
```

## 📋 手动部署步骤

### 1. 设置环境变量
```bash
# 数据库连接 (使用 Fly.io Postgres 或外部数据库)
flyctl secrets set DATABASE_URL="postgresql://username:password@host:port/database"

# AI API 密钥
flyctl secrets set OPENAI_API_KEY="sk-..."
flyctl secrets set ANTHROPIC_API_KEY="sk-ant-..."
flyctl secrets set GOOGLE_API_KEY="AI..."

# 可选: 其他配置
flyctl secrets set SECRET_KEY="your-secret-key"
flyctl secrets set DB_ECHO="false"
```

### 2. 创建应用 (如果还没有)
```bash
flyctl apps create quiz-lib
```

### 3. 部署
```bash
flyctl deploy
```

### 4. 分配专用IPv4 (如果需要)
```bash
flyctl ips allocate-v4
```

## 🔧 配置文件说明

### fly.toml
主要的 Fly.io 配置文件，包含:
- 应用名称和区域设置
- HTTP 服务配置 (端口 8000)
- 健康检查配置 (`/health` 端点)
- VM 规格 (1GB 内存)
- 环境变量

### nixpacks.toml
构建配置文件，定义:
- Python 3.11 运行环境
- 依赖安装流程
- 启动命令

## 🏥 健康检查

应用包含健康检查端点:
- **路径**: `/health`
- **返回**: `{"status": "healthy", "service": "quiz-lib-backend"}`

## 📊 监控和日志

### 查看应用状态
```bash
flyctl status
```

### 查看实时日志
```bash
flyctl logs
```

### SSH 到容器
```bash
flyctl ssh console
```

## 🔍 故障排除

### 常见问题

1. **构建失败**
   - 检查 `backend/requirements.txt` 是否存在
   - 确认所有依赖版本兼容

2. **启动失败**
   - 检查环境变量是否正确设置
   - 查看日志: `flyctl logs`

3. **数据库连接失败**
   - 确认 `DATABASE_URL` 格式正确
   - 检查数据库服务是否可达

4. **健康检查失败**
   - 确认应用在端口 8000 上监听
   - 检查 `/health` 端点是否正常响应

### 调试命令
```bash
# 查看环境变量
flyctl ssh console -C "env | grep -E '(DATABASE|API|SECRET)'"

# 测试健康检查
flyctl ssh console -C "curl -f http://localhost:8000/health"

# 检查进程
flyctl ssh console -C "ps aux"

# 查看端口监听
flyctl ssh console -C "netstat -tlnp"
```

## 🔄 更新部署

对于代码更改，只需重新部署:
```bash
flyctl deploy
```

对于配置更改，可能需要重启:
```bash
flyctl apps restart quiz-lib
```

## 💡 性能优化建议

1. **资源调整**: 根据使用情况调整 VM 规格
2. **区域优化**: 选择离用户最近的区域
3. **自动扩缩容**: 配置基于负载的扩缩容
4. **CDN**: 对于静态资源使用 CDN

## 🔗 有用链接

- [Fly.io 文档](https://fly.io/docs/)
- [Fly.io Python 部署指南](https://fly.io/docs/languages-and-frameworks/python/)
- [nixpacks 配置参考](https://nixpacks.com/docs/configuration/file)