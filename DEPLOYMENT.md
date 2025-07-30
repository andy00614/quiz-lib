# Quiz-Lib 部署指南

这个项目由前端（Next.js）和后端（FastAPI）两部分组成，分别部署到 Vercel 和 Render 平台。

## 📋 部署前准备

### 1. 必需的账户
- [Vercel](https://vercel.com) 账户（前端部署）
- [Render](https://render.com) 账户（后端部署）
- GitHub 账户（代码托管）

### 2. API Keys 准备
在部署前，请准备以下 API 密钥：
- OpenAI API Key（必需）
- Anthropic API Key（可选）
- Google Gemini API Key（可选）

## 🚀 后端部署（Render）

### 步骤 1: 创建 Render 服务

1. 登录 [Render](https://render.com)
2. 点击 "New +" → "Web Service"
3. 连接你的 GitHub 仓库
4. 选择 `quiz-lib` 仓库

### 步骤 2: 配置服务设置

**基本设置：**
- Name: `quiz-lib-backend`
- Region: `Oregon (US West)`
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Python 3`

**构建和启动命令：**
- Build Command: `pip install -r requirements.txt && python start.py`
- Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1`

### 步骤 3: 配置环境变量

在 Render 服务的 "Environment" 标签页中，添加以下环境变量：

```bash
# 必需变量
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here

# 可选变量
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# 自动配置的变量（不需要手动设置）
DATABASE_URL=（Render 自动配置）
DEBUG=false
API_V1_STR=/api/v1
ALLOWED_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:3000
```

### 步骤 4: 创建数据库

1. 在 Render Dashboard 中点击 "New +" → "PostgreSQL"
2. 配置数据库：
   - Name: `quiz-lib-db`
   - Database Name: `quiz_lib`
   - User: `quiz_user`
   - Region: `Oregon (US West)`
   - Plan: `Free`

3. 创建后，在 Web Service 的环境变量中，DATABASE_URL 会自动链接到这个数据库

### 步骤 5: 部署

1. 点击 "Create Web Service"
2. Render 会自动开始构建和部署
3. 等待部署完成（通常需要 5-10 分钟）
4. 部署成功后，你会得到一个 URL，类似：`https://quiz-lib-backend.onrender.com`

## 🌐 前端部署（Vercel）

### 步骤 1: 连接 Vercel

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 从 GitHub 导入 `quiz-lib` 仓库

### 步骤 2: 配置项目设置

**项目设置：**
- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `pnpm install`

### 步骤 3: 配置环境变量

在 Vercel 项目的 "Settings" → "Environment Variables" 中添加：

```bash
# 应用 URL
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app

# 后端 API URL（使用步骤 5 中获得的 Render URL）
NEXT_PUBLIC_API_URL=https://quiz-lib-backend.onrender.com

# 数据库（与后端共用同一个数据库）
DATABASE_URL=your_render_database_url

# 认证密钥
BETTER_AUTH_SECRET=your_auth_secret_here

# OAuth 提供商（可选）
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 存储配置（可选）
R2_BUCKET_NAME=your_bucket_name
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ENDPOINT=your_r2_endpoint
R2_PUBLIC_URL=your_public_url

# Stripe 支付（可选）
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# 管理员邮箱
ADMIN_EMAILS=admin@example.com
```

### 步骤 4: 部署

1. 点击 "Deploy"
2. Vercel 会自动构建和部署
3. 等待部署完成（通常需要 2-5 分钟）
4. 部署成功后，你会得到一个 URL，类似：`https://your-project-name.vercel.app`

## 🔄 更新 CORS 配置

部署完成后，需要更新后端的 CORS 配置：

1. 在 Render 后端服务的环境变量中，更新 `ALLOWED_ORIGINS`：
   ```
   ALLOWED_ORIGINS=https://your-actual-vercel-app.vercel.app,http://localhost:3000
   ```

2. 保存并重新部署后端服务

## ✅ 验证部署

### 后端验证
访问 `https://quiz-lib-backend.onrender.com/health`，应该返回：
```json
{"status": "healthy", "service": "quiz-lib-backend"}
```

### 前端验证
访问 `https://your-project-name.vercel.app`，应该能看到应用首页

### 功能测试
1. 创建知识内容
2. 生成大纲
3. 生成题目
4. 查看统计数据

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 是否正确配置
   - 确认数据库服务正在运行

2. **CORS 错误**
   - 确认后端的 ALLOWED_ORIGINS 包含前端域名
   - 检查前端的 NEXT_PUBLIC_API_URL 是否正确

3. **API 调用失败**
   - 检查 OpenAI API Key 是否有效
   - 确认后端服务健康检查通过

4. **构建失败**
   - 检查依赖是否正确安装
   - 查看构建日志中的具体错误信息

### 日志查看

- **Render**: 在服务页面的 "Logs" 标签中查看
- **Vercel**: 在项目页面的 "Functions" 或 "Deployments" 中查看

## 📈 性能优化

### 生产环境建议

1. **升级服务计划**（如果需要）
   - Render: 考虑升级到付费计划获得更好的性能
   - Vercel: Pro 计划提供更多资源和功能

2. **数据库优化**
   - 考虑升级数据库计划
   - 添加适当的索引

3. **缓存策略**
   - 配置 Redis 缓存（需要额外服务）
   - 优化前端静态资源缓存

## 🔐 安全最佳实践

1. **环境变量安全**
   - 使用强密码和随机密钥
   - 定期轮换 API 密钥

2. **HTTPS**
   - 确保所有生产环境都使用 HTTPS
   - 配置正确的 CORS 策略

3. **监控**
   - 启用错误监控
   - 设置关键指标警报

## 💰 成本估算

### 免费方案
- Render Free Plan: 750 小时/月
- Vercel Hobby Plan: 无限静态部署
- PostgreSQL Free Plan: 1GB 存储

### 预计月成本（付费方案）
- Render Starter ($7/月): 更好的性能和正常运行时间
- Vercel Pro ($20/月): 更多功能和资源
- 总计: ~$27/月（基础生产环境）

---

🎉 部署完成后，你的 AI 题库生成系统就可以在线使用了！如果遇到问题，请查看故障排除部分或联系技术支持。