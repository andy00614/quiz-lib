from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import structlog

from app.api import models, knowledge, generation, prompts, analytics
from app.utils.logging import LoggingMiddleware
from app.utils.error_handler import error_handler_middleware
from app.core.config.settings import settings
from app.db.connection import create_db_and_tables, close_db_connection

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("Starting up quiz-lib backend service")
    # 启动时创建数据库表
    await create_db_and_tables()
    yield
    # 关闭时清理资源
    await close_db_connection()
    logger.info("Shutting down quiz-lib backend service")


app = FastAPI(
    title="Quiz-Lib Backend API",
    description="AI驱动的题库生成系统后端API",
    version="1.0.0",
    lifespan=lifespan,
)

# 添加受信任的主机中间件
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["quiz-lib-production.up.railway.app", "*.railway.app", "localhost", "127.0.0.1"]
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 添加自定义中间件
app.add_middleware(LoggingMiddleware)
app.middleware("http")(error_handler_middleware)

# 添加中间件来处理代理头部和CORS
@app.middleware("http")
async def proxy_headers_middleware(request, call_next):
    # 信任来自反向代理的头部
    if "x-forwarded-proto" in request.headers:
        request.scope["scheme"] = request.headers["x-forwarded-proto"]
    if "x-forwarded-host" in request.headers:
        request.scope["server"] = (request.headers["x-forwarded-host"], request.scope["server"][1])
    
    response = await call_next(request)
    
    # 确保所有响应都有CORS头部
    if "access-control-allow-origin" not in response.headers:
        origin = request.headers.get("origin")
        if origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
            response.headers["access-control-allow-origin"] = origin
        else:
            response.headers["access-control-allow-origin"] = "*"
    
    response.headers["access-control-allow-credentials"] = "true"
    response.headers["access-control-allow-methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    response.headers["access-control-allow-headers"] = "*"
    
    return response

# 注册路由
app.include_router(models.router, prefix="/api/v1")
app.include_router(knowledge.router, prefix="/api/v1")
app.include_router(generation.router, prefix="/api/v1")
app.include_router(prompts.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "Quiz-Lib Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "service": "quiz-lib-backend"}