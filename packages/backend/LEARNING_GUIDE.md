# Python & FastAPI 学习指南

基于Quiz-Lib后端项目的实战学习指南，从基础到进阶，逐步掌握Python和FastAPI开发。

## 📚 学习路径

### 第一阶段：Python基础 (1-2周)
### 第二阶段：FastAPI基础 (1-2周)  
### 第三阶段：数据库操作 (1周)
### 第四阶段：项目实战 (1周)

---

## 🐍 第一阶段：Python基础

### 1.1 环境和包管理

#### 虚拟环境的重要性
```bash
# 为什么需要虚拟环境？
# 1. 隔离项目依赖，避免版本冲突
# 2. 方便部署和协作
# 3. 保持系统Python环境干净

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装项目依赖
pip install -r requirements.txt
```

**📖 学习要点：**
- 理解虚拟环境的作用
- 学会使用pip管理包
- 了解requirements.txt的作用

#### 实战练习
在项目中查看 `requirements.txt`，理解每个包的作用：
```python
# packages/backend/requirements.txt
fastapi==0.110.0      # Web框架
uvicorn[standard]==0.27.1  # ASGI服务器
pydantic==2.6.3       # 数据验证
sqlalchemy==2.0.27    # ORM数据库操作
asyncpg==0.29.0       # PostgreSQL异步驱动
```

### 1.2 Python语法基础

#### 类型注解 (Type Hints)
在我们的项目中大量使用了类型注解，这是现代Python的最佳实践：

```python
# 查看文件：app/schemas/models.py
from typing import Optional, List, Dict

# 基础类型注解
def get_model(model_id: int) -> Optional[str]:
    return "GPT-4o"

# 复杂类型注解
models: List[Dict[str, Any]] = [
    {"id": 1, "name": "GPT-4o"},
    {"id": 2, "name": "Claude-3"}
]
```

**📖 学习要点：**
- 基础类型：`int`, `str`, `bool`, `float`
- 容器类型：`List`, `Dict`, `Tuple`
- 特殊类型：`Optional`, `Union`, `Any`

#### 异步编程 (Async/Await)
现代Web开发的核心概念：

```python
# 查看文件：core/database/connection.py
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

# 异步函数定义
async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

# 异步函数调用
async def main():
    session = await get_session()
    # 处理数据库操作
```

**📖 学习要点：**
- `async def` 定义异步函数
- `await` 等待异步操作完成
- `async with` 异步上下文管理器

#### 数据类和装饰器
```python
# 查看文件：app/schemas/models.py
from pydantic import BaseModel, Field

class ModelCreate(BaseModel):
    name: str = Field(..., max_length=100)
    provider: str = Field(..., max_length=50)
    is_active: bool = True
    
    # 配置类
    class Config:
        from_attributes = True
```

**📖 学习要点：**
- 类的定义和继承
- 装饰器的使用
- 特殊方法（如`__init__`）

### 1.3 错误处理和日志

```python
# 查看文件：app/api/models.py
from fastapi import HTTPException, status
import structlog

logger = structlog.get_logger()

try:
    # 业务逻辑
    result = await some_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Operation failed: {str(e)}"
    )
```

**📖 学习要点：**
- `try/except` 异常处理
- 自定义异常
- 日志记录最佳实践

---

## 🚀 第二阶段：FastAPI基础

### 2.1 FastAPI应用结构

#### 应用创建和配置
```python
# 查看文件：app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 创建FastAPI应用
app = FastAPI(
    title="Quiz-Lib Backend API",
    description="AI驱动的题库生成系统后端API",
    version="1.0.0"
)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**📖 学习要点：**
- FastAPI应用实例化
- 中间件的概念和使用
- CORS配置的重要性

### 2.2 路由和API端点

#### 基础路由定义
```python
# 查看文件：app/api/models.py
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/models", tags=["models"])

@router.get("/")
async def list_models():
    """获取模型列表"""
    return {"models": []}

@router.post("/")
async def create_model(model_data: ModelCreate):
    """创建新模型"""
    return {"message": "Model created"}
```

**📖 学习要点：**
- `APIRouter` 用于组织路由
- 装饰器定义HTTP方法
- 路径参数和查询参数

#### 依赖注入系统
```python
# 数据库依赖
async def get_db_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

# 在路由中使用依赖
@router.get("/{model_id}")
async def get_model(
    model_id: int,
    session: AsyncSession = Depends(get_db_session)
):
    # 使用session进行数据库操作
    pass
```

**📖 学习要点：**
- `Depends()` 依赖注入
- 数据库会话管理
- 依赖的复用和组合

### 2.3 请求和响应处理

#### 请求验证
```python
# 查看文件：app/schemas/models.py
from pydantic import BaseModel, Field

class KnowledgeRecordCreate(BaseModel):
    title: str
    model_id: int
    temperature: Optional[Decimal] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(2000, gt=0)
```

**📖 学习要点：**
- Pydantic模型用于数据验证
- 字段约束（ge=大于等于, le=小于等于）
- 可选字段和默认值

#### 响应模型
```python
@router.get("/", response_model=List[ModelResponse])
async def list_models():
    # FastAPI自动序列化响应
    return models
```

**📖 学习要点：**
- `response_model` 指定响应格式
- 自动序列化和反序列化
- 响应状态码

### 2.4 错误处理

```python
# 统一错误处理
if not model:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Model not found"
    )
```

**📖 学习要点：**
- `HTTPException` 标准错误响应
- 状态码的正确使用
- 错误信息的国际化

---

## 🗄️ 第三阶段：数据库操作

### 3.1 SQLAlchemy模型定义

```python
# 查看文件：core/database/models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Model(Base):
    __tablename__ = "models"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # 关系定义
    knowledge_records = relationship("KnowledgeRecord", back_populates="model")
```

**📖 学习要点：**
- 表结构定义
- 字段类型和约束
- 关系映射（一对多、多对多）

### 3.2 异步数据库操作

```python
# 查看文件：app/api/models.py
# 查询操作
result = await session.execute(
    select(Model).where(Model.id == model_id)
)
model = result.scalar_one_or_none()

# 创建操作
model = Model(**model_data.model_dump())
session.add(model)
await session.commit()
await session.refresh(model)

# 更新操作
for field, value in update_data.items():
    setattr(model, field, value)
await session.commit()
```

**📖 学习要点：**
- `select()` 查询构造器
- `session.add()` 添加对象
- `session.commit()` 提交事务
- `session.refresh()` 刷新对象

### 3.3 复杂查询

```python
# 查看文件：app/api/analytics.py
# 聚合查询
query = select(
    Model.name,
    func.avg(APIRequestLog.response_time_ms).label("avg_time"),
    func.count(APIRequestLog.id).label("total_requests")
).select_from(
    APIRequestLog.join(Model)
).group_by(
    Model.name
)
```

**📖 学习要点：**
- JOIN操作
- 聚合函数（COUNT, AVG, SUM）
- GROUP BY和HAVING
- 复杂条件查询

---

## 🛠️ 第四阶段：项目实战

### 4.1 业务逻辑分层

我们的项目采用了清晰的分层架构：

```
app/
├── api/          # 路由层 - 处理HTTP请求
├── services/     # 服务层 - 业务逻辑
├── schemas/      # 数据层 - 验证和序列化
└── models/       # 持久层 - 数据库模型
```

#### 服务层示例
```python
# 查看文件：app/services/llm_service.py
class LLMService:
    async def generate(self, prompt: str, model: str) -> Dict[str, Any]:
        # 1. 参数验证
        # 2. 调用外部API
        # 3. 处理响应
        # 4. 错误处理
        return result
```

### 4.2 配置管理

```python
# 查看文件：core/config/settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    OPENAI_API_KEY: Optional[str] = None
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"
```

**📖 学习要点：**
- 环境变量管理
- 配置的分层和继承
- 敏感信息保护

### 4.3 测试编写

虽然项目中还没有完整的测试，但这里是测试的基本模式：

```python
# 测试示例
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_model():
    response = client.post("/api/v1/models", json={
        "name": "Test Model",
        "provider": "test"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "Test Model"
```

---

## 📝 实践建议

### 1. 阅读代码顺序
1. 先看 `app/main.py` 了解应用结构
2. 再看 `core/config/settings.py` 了解配置
3. 然后看 `core/database/models.py` 了解数据结构
4. 接着看 `app/api/` 下的路由文件
5. 最后看 `app/services/` 下的业务逻辑

### 2. 动手练习
1. 修改一个简单的API端点
2. 添加一个新的数据库字段
3. 创建一个新的API端点
4. 调试和测试API

### 3. 学习资源
- [FastAPI官方文档](https://fastapi.tiangolo.com/)
- [SQLAlchemy文档](https://docs.sqlalchemy.org/)
- [Pydantic文档](https://docs.pydantic.dev/)
- [Python异步编程指南](https://docs.python.org/3/library/asyncio.html)

### 4. 常见问题解决
- 使用IDE的类型检查功能
- 阅读错误信息和堆栈跟踪
- 使用日志调试问题
- 查看FastAPI自动生成的文档

---

## 🎯 学习目标检查

完成学习后，你应该能够：

- [ ] 理解Python虚拟环境和包管理
- [ ] 掌握Python类型注解和异步编程
- [ ] 创建FastAPI应用和API端点
- [ ] 使用SQLAlchemy进行数据库操作
- [ ] 理解项目的整体架构
- [ ] 独立添加新功能和修复问题

记住：**学习编程最好的方法就是动手实践！** 🚀