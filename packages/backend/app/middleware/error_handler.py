from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import structlog
import traceback
from datetime import datetime

logger = structlog.get_logger()


async def error_handler_middleware(request: Request, call_next):
    """全局错误处理中间件"""
    try:
        response = await call_next(request)
        return response
    
    except RequestValidationError as e:
        # 处理请求验证错误
        logger.warning(
            "validation_error",
            errors=e.errors(),
            body=e.body
        )
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "请求参数验证失败",
                "error": "Validation Error",
                "details": e.errors(),
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    except SQLAlchemyError as e:
        # 处理数据库错误
        logger.error(
            "database_error",
            error=str(e),
            traceback=traceback.format_exc()
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "数据库操作失败",
                "error": "Database Error",
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    except Exception as e:
        # 处理其他未预期的错误
        logger.error(
            "unexpected_error",
            error=str(e),
            error_type=type(e).__name__,
            traceback=traceback.format_exc()
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "服务器内部错误",
                "error": "Internal Server Error",
                "timestamp": datetime.utcnow().isoformat()
            }
        )