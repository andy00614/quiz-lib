from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time
import uuid
import structlog

logger = structlog.get_logger()


class LoggingMiddleware(BaseHTTPMiddleware):
    """日志中间件"""
    
    async def dispatch(self, request: Request, call_next):
        # 生成请求ID
        request_id = str(uuid.uuid4())
        
        # 记录请求开始
        start_time = time.time()
        
        # 在上下文中绑定请求ID
        structlog.contextvars.bind_contextvars(request_id=request_id)
        
        # 记录请求信息
        logger.info(
            "request_started",
            method=request.method,
            path=request.url.path,
            client_host=request.client.host if request.client else None
        )
        
        # 处理请求
        response = await call_next(request)
        
        # 计算响应时间
        process_time = (time.time() - start_time) * 1000  # 转换为毫秒
        
        # 添加响应头
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        
        # 记录响应信息
        logger.info(
            "request_completed",
            status_code=response.status_code,
            process_time_ms=process_time
        )
        
        # 清理上下文
        structlog.contextvars.clear_contextvars()
        
        return response