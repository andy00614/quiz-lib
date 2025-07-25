# Quiz-Lib 后端启动操作手册

这是一个详细的操作手册，帮助你从零开始启动Quiz-Lib后端项目。即使是编程新手也能按照步骤成功运行项目。

## 📋 前置检查清单

在开始之前，请确认以下软件已安装：

- [ ] Python 3.9+ 
- [ ] PostgreSQL 13+
- [ ] Git
- [ ] 代码编辑器（推荐VS Code）

---

## 🛠️ 第一步：环境准备

### 1.1 检查Python版本

```bash
# 检查Python版本（应该是3.9+）
python --version
# 或者
python3 --version

# 如果没有Python，请前往官网下载：https://www.python.org/
```

**期望输出：**
```
Python 3.11.5
```

### 1.2 检查PostgreSQL

```bash
# 检查PostgreSQL是否安装
psql --version

# 如果没有安装，请根据操作系统安装：
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: 下载官方安装包
```

**期望输出：**
```
psql (PostgreSQL) 13.8
```

### 1.3 检查项目目录

确认你在正确的目录：

```bash
# 进入项目后端目录
cd /Users/andy/Documents/code/quiz-lib/packages/backend

# 检查目录内容
ls -la

# 应该看到以下文件：
# - app/
# - core/
# - scripts/
# - requirements.txt
# - .env.example
```

---

## 🐍 第二步：Python环境设置

### 2.1 创建虚拟环境

```bash
# 在后端目录下创建虚拟环境
python -m venv venv

# 检查是否创建成功
ls -la venv/
```

**如果遇到问题：**
- 确认Python路径正确
- 在Windows上可能需要使用 `python3 -m venv venv`

### 2.2 激活虚拟环境

```bash
# macOS/Linux
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

**成功标志：**
终端提示符前面会出现 `(venv)` 标记：
```bash
(venv) user@computer:~/quiz-lib/packages/backend$
```

### 2.3 升级pip

```bash
# 升级pip到最新版本
pip install --upgrade pip

# 验证pip版本
pip --version
```

### 2.4 安装项目依赖

```bash
# 安装所有依赖包
pip install -r requirements.txt

# 这个过程可能需要几分钟，耐心等待
```

**如果安装失败：**
1. 检查网络连接
2. 尝试使用国内镜像：
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

**成功验证：**
```bash
# 检查主要包是否安装成功
pip list | grep fastapi
pip list | grep sqlalchemy
pip list | grep pydantic
```

---

## 🗄️ 第三步：数据库设置

### 3.1 启动PostgreSQL服务

```bash
# macOS (使用Homebrew)
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo systemctl start postgresql

# Windows
# 通过服务管理器启动PostgreSQL服务
```

### 3.2 创建数据库

```bash
# 方法1：使用createdb命令
createdb quiz_lib

# 方法2：使用psql命令行
psql -U postgres
CREATE DATABASE quiz_lib;
\q
```

### 3.3 测试数据库连接

```bash
# 测试能否连接到新创建的数据库
psql -U postgres -d quiz_lib -c "SELECT version();"
```

**期望输出：**
应该显示PostgreSQL版本信息。

---

## ⚙️ 第四步：项目配置

### 4.1 创建环境配置文件

```bash
# 复制示例配置文件
cp .env.example .env

# 查看文件内容
cat .env
```

### 4.2 编辑配置文件

使用文本编辑器打开 `.env` 文件：

```bash
# 使用VS Code编辑
code .env

# 或使用其他编辑器
nano .env
```

**必须修改的配置：**

```env
# 数据库配置 - 根据你的实际情况修改
DATABASE_URL=postgresql+asyncpg://postgres:你的密码@localhost:5432/quiz_lib

# AI API密钥 - 至少配置一个
OPENAI_API_KEY=你的OpenAI密钥
ANTHROPIC_API_KEY=你的Anthropic密钥
GOOGLE_API_KEY=你的Google密钥

# 其他保持默认即可
DEBUG=true
```

**获取AI API密钥：**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Google: https://makersuite.google.com/app/apikey

### 4.3 验证配置

```bash
# 检查环境变量是否正确加载
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DATABASE_URL:', os.getenv('DATABASE_URL'))
print('OPENAI_API_KEY:', 'SET' if os.getenv('OPENAI_API_KEY') else 'NOT SET')
"
```

---

## 🚀 第五步：初始化和启动

### 5.1 初始化数据库

```bash
# 运行数据库初始化脚本
python scripts/init_db.py
```

**期望输出：**
```
Starting database initialization...
Added 4 default models
Added 2 default prompt templates
Default data initialization completed
Database initialization completed successfully
```

**如果出现错误：**
1. 检查数据库是否正在运行
2. 检查DATABASE_URL配置是否正确
3. 检查数据库用户权限

### 5.2 验证数据库初始化

```bash
# 连接数据库查看表
psql -U postgres -d quiz_lib -c "\dt"
```

**期望输出：**
应该看到创建的表列表，包括：
- models
- prompt_templates
- knowledge_records
- outlines
- chapters
- quizzes
- api_request_logs
- model_performance_stats

### 5.3 启动后端服务

```bash
# 启动开发服务器
python run.py
```

**期望输出：**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 5.4 验证服务启动

打开浏览器访问以下地址：

1. **根路径测试：** http://localhost:8000
   - 应该看到API基本信息

2. **健康检查：** http://localhost:8000/health  
   - 应该看到 `{"status": "healthy"}`

3. **API文档：** http://localhost:8000/docs
   - 应该看到Swagger UI界面

4. **模型列表：** http://localhost:8000/api/v1/models
   - 应该看到默认模型列表

---

## 🧪 第六步：功能测试

### 6.1 测试模型管理API

```bash
# 获取模型列表
curl http://localhost:8000/api/v1/models
```

**期望输出：**
```json
[
  {
    "id": 1,
    "name": "GPT-4o",
    "provider": "openai",
    "is_active": true,
    ...
  }
]
```

### 6.2 测试Prompt模板API

```bash
# 获取默认大纲模板
curl http://localhost:8000/api/v1/prompts/type/outline/default
```

### 6.3 测试内容生成（需要AI API密钥）

```bash
# 生成大纲测试
curl -X POST http://localhost:8000/api/v1/generation/outline \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python基础编程",
    "model_id": 1,
    "temperature": 0.7,
    "max_tokens": 2000
  }'
```

---

## 🔧 故障排除

### 常见问题1：虚拟环境激活失败

**症状：** `source venv/bin/activate` 报错

**解决方案：**
```bash
# 删除虚拟环境重新创建
rm -rf venv
python3 -m venv venv
source venv/bin/activate
```

### 常见问题2：pip安装依赖失败

**症状：** 某些包安装失败

**解决方案：**
```bash
# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 或者升级pip和setuptools
pip install --upgrade pip setuptools wheel
```

### 常见问题3：数据库连接失败

**症状：** `connection refused` 或 `authentication failed`

**解决方案：**
1. 检查PostgreSQL是否运行：
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

2. 重置PostgreSQL密码：
```bash
# 进入PostgreSQL命令行
sudo -u postgres psql
\password postgres
# 输入新密码
\q
```

3. 更新.env文件中的DATABASE_URL

### 常见问题4：端口被占用

**症状：** `Address already in use`

**解决方案：**
```bash
# 查找占用8000端口的进程
lsof -i :8000

# 杀死进程
kill -9 进程ID

# 或者使用不同端口启动
uvicorn app.main:app --port 8001
```

### 常见问题5：AI API调用失败

**症状：** 生成接口返回错误

**解决方案：**
1. 检查API密钥是否正确设置
2. 检查网络连接
3. 验证API密钥额度
4. 查看服务器日志获取详细错误信息

---

## 📊 监控和日志

### 查看实时日志

```bash
# 如果服务在后台运行，查看日志
tail -f logs/app.log

# 或者在启动时查看详细输出
uvicorn app.main:app --log-level debug
```

### 数据库监控

```bash
# 查看数据库连接
psql -U postgres -d quiz_lib -c "SELECT * FROM pg_stat_activity;"

# 查看表大小
psql -U postgres -d quiz_lib -c "
SELECT schemaname,tablename,attname,n_distinct,correlation 
FROM pg_stats;
"
```

---

## 🎯 启动成功确认清单

当所有步骤完成后，确认以下功能正常：

- [ ] 虚拟环境激活成功（提示符有`(venv)`）
- [ ] 所有依赖包安装成功
- [ ] 数据库连接正常
- [ ] 8个数据库表创建成功
- [ ] 服务启动在8000端口
- [ ] API文档页面可访问
- [ ] 模型列表API返回数据
- [ ] 健康检查通过

---

## 🚀 下一步建议

1. **熟悉API文档：** 仔细查看 http://localhost:8000/docs
2. **测试核心功能：** 尝试创建知识记录和生成内容
3. **查看数据库：** 使用数据库工具查看数据结构
4. **阅读代码：** 从`app/main.py`开始了解项目结构
5. **前端集成：** 开始前后端联调

---

## 📞 获取帮助

如果遇到问题：

1. **查看日志：** 服务器启动时的控制台输出
2. **检查配置：** 确认.env文件配置正确
3. **重新初始化：** 删除数据库重新运行初始化脚本
4. **重启服务：** 停止服务后重新启动

**记住：** 遇到问题不要慌张，大部分问题都是配置或环境相关的！按照步骤仔细排查即可。🎯