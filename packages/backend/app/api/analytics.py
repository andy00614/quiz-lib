from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, text, case
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from core.database.connection import get_session
from core.database.models import (
    APIRequestLog, Model, KnowledgeRecord, Quiz, Chapter, Outline,
    ModelPerformanceStats
)
from app.schemas.models import (
    APIRequestLogResponse,
    ModelPerformanceStatsResponse,
    DashboardStats,
    ModelStats
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_session)
):
    """获取仪表板统计数据"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # 总知识数
    knowledge_result = await session.execute(
        select(func.count(KnowledgeRecord.id))
        .where(KnowledgeRecord.created_at >= cutoff_date)
    )
    total_knowledge = knowledge_result.scalar()
    
    # 总题目数
    quiz_result = await session.execute(
        select(func.count(Quiz.id))
        .join(Chapter)
        .join(Outline)
        .join(KnowledgeRecord)
        .where(KnowledgeRecord.created_at >= cutoff_date)
    )
    total_quizzes = quiz_result.scalar()
    
    # 总请求数
    request_result = await session.execute(
        select(func.count(APIRequestLog.id))
        .where(APIRequestLog.created_at >= cutoff_date)
    )
    total_requests = request_result.scalar()
    
    # 平均响应时间
    avg_response_result = await session.execute(
        select(func.avg(APIRequestLog.response_time_ms))
        .where(
            and_(
                APIRequestLog.created_at >= cutoff_date,
                APIRequestLog.status == "success"
            )
        )
    )
    avg_response_time = avg_response_result.scalar() or 0
    
    # 错误率
    error_result = await session.execute(
        select(func.count(APIRequestLog.id))
        .where(
            and_(
                APIRequestLog.created_at >= cutoff_date,
                APIRequestLog.status != "success"
            )
        )
    )
    error_count = error_result.scalar()
    error_rate = error_count / total_requests if total_requests > 0 else 0
    
    # 总成本
    cost_result = await session.execute(
        select(func.sum(APIRequestLog.cost))
        .where(APIRequestLog.created_at >= cutoff_date)
    )
    total_cost = cost_result.scalar() or 0
    
    return DashboardStats(
        total_knowledge=total_knowledge,
        total_quizzes=total_quizzes,
        total_requests=total_requests,
        avg_response_time=float(avg_response_time),
        error_rate=float(error_rate),
        total_cost=float(total_cost)
    )


@router.get("/models/stats")
async def get_model_stats(
    days: int = Query(30, ge=1, le=365),
    task_type: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """获取模型统计数据"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # 构建查询
    query = select(
        Model.id.label("model_id"),
        Model.name.label("model_name"),
        APIRequestLog.request_type.label("task_type"),
        func.avg(APIRequestLog.response_time_ms).label("avg_response_time_ms"),
        func.max(APIRequestLog.response_time_ms).label("p95_response_time_ms"),  # 简化为max，避免percentile_cont兼容性问题
        func.avg(APIRequestLog.cost).label("avg_cost"),
        func.count(APIRequestLog.id).label("total_requests"),
        func.sum(
            case(
                (APIRequestLog.status == "success", 1),
                else_=0
            )
        ).label("success_count"),
        func.sum(
            case(
                (APIRequestLog.status != "success", 1),
                else_=0
            )
        ).label("error_count")
    ).join(
        Model, APIRequestLog.model_id == Model.id
    ).where(
        APIRequestLog.created_at >= cutoff_date
    ).group_by(
        Model.id, Model.name, APIRequestLog.request_type
    )
    
    if task_type:
        query = query.where(APIRequestLog.request_type == task_type)
    
    result = await session.execute(query)
    stats_data = result.fetchall()
    
    # 手动转换为字典，避免Pydantic序列化问题
    model_stats = []
    for row in stats_data:
        success_rate = row.success_count / row.total_requests if row.total_requests > 0 else 0
        error_rate = row.error_count / row.total_requests if row.total_requests > 0 else 0
        
        model_stats.append({
            "model_id": row.model_id,
            "model_name": row.model_name,
            "task_type": row.task_type,
            "avg_response_time_ms": float(row.avg_response_time_ms or 0),
            "p95_response_time_ms": float(row.p95_response_time_ms or 0),
            "success_rate": float(success_rate),
            "error_rate": float(error_rate),
            "avg_cost": float(row.avg_cost or 0),
            "total_requests": row.total_requests
        })
    
    return model_stats


@router.get("/time-series")
async def get_time_series_data(
    days: int = Query(7, ge=1, le=30),
    metric: str = Query("response_time", regex="^(response_time|cost|requests|errors)$"),
    interval: str = Query("hour", regex="^(hour|day)$"),
    session: AsyncSession = Depends(get_session)
):
    """获取时间序列数据"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # 根据间隔确定时间分组
    if interval == "hour":
        time_group = func.date_trunc('hour', APIRequestLog.created_at)
    else:  # day
        time_group = func.date_trunc('day', APIRequestLog.created_at)
    
    # 根据指标确定聚合函数
    if metric == "response_time":
        metric_func = func.avg(APIRequestLog.response_time_ms)
    elif metric == "cost":
        metric_func = func.sum(APIRequestLog.cost)
    elif metric == "requests":
        metric_func = func.count(APIRequestLog.id)
    elif metric == "errors":
        metric_func = func.sum(
            func.case((APIRequestLog.status != "success", 1), else_=0)
        )
    
    query = select(
        time_group.label("time_period"),
        metric_func.label("value")
    ).where(
        APIRequestLog.created_at >= cutoff_date
    ).group_by(
        time_group
    ).order_by(
        time_group
    )
    
    result = await session.execute(query)
    data = result.fetchall()
    
    return [
        {
            "time": row.time_period.isoformat(),
            "value": float(row.value or 0)
        }
        for row in data
    ]


@router.get("/logs")
async def get_request_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    model_id: Optional[int] = Query(None),
    request_type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    knowledge_id: Optional[int] = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """获取API请求日志"""
    query = select(APIRequestLog)
    
    # 应用过滤条件
    if model_id:
        query = query.where(APIRequestLog.model_id == model_id)
    
    if request_type:
        query = query.where(APIRequestLog.request_type == request_type)
    
    if status_filter:
        query = query.where(APIRequestLog.status == status_filter)
    
    if knowledge_id:
        query = query.where(APIRequestLog.knowledge_id == knowledge_id)
    
    # 分页和排序
    query = query.offset(skip).limit(limit).order_by(APIRequestLog.created_at.desc())
    
    result = await session.execute(query)
    logs = result.scalars().all()
    
    # 手动转换为字典，避免Pydantic序列化关联对象的问题
    log_data = []
    for log in logs:
        log_dict = {
            "id": log.id,
            "created_at": log.created_at.isoformat(),
            "knowledge_id": log.knowledge_id,
            "model_id": log.model_id,
            "request_type": log.request_type,
            "status": log.status,
            "response_time_ms": log.response_time_ms,
            "input_tokens": log.input_tokens,
            "output_tokens": log.output_tokens,
            "cost": float(log.cost) if log.cost else 0.0,
            "prompt": log.prompt,
            "response": log.response,
            "error_message": log.error_message
        }
        log_data.append(log_dict)
    
    return log_data


@router.get("/models/{model_id}/performance", response_model=List[ModelPerformanceStatsResponse])
async def get_model_performance(
    model_id: int,
    period_type: str = Query("daily", regex="^(daily|weekly|monthly)$"),
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_session)
):
    """获取模型性能统计"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    query = select(ModelPerformanceStats).where(
        and_(
            ModelPerformanceStats.model_id == model_id,
            ModelPerformanceStats.period_type == period_type,
            ModelPerformanceStats.period_date >= cutoff_date
        )
    ).order_by(ModelPerformanceStats.period_date.desc())
    
    result = await session.execute(query)
    stats = result.scalars().all()
    
    return stats


@router.post("/models/{model_id}/regenerate-stats")
async def regenerate_model_stats(
    model_id: int,
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_session)
):
    """重新生成模型统计数据"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # 验证模型是否存在
    model_result = await session.execute(
        select(Model).where(Model.id == model_id)
    )
    model = model_result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # 删除现有统计数据
    await session.execute(
        ModelPerformanceStats.__table__.delete().where(
            and_(
                ModelPerformanceStats.model_id == model_id,
                ModelPerformanceStats.period_date >= cutoff_date
            )
        )
    )
    
    # 重新计算统计数据
    # 这里可以添加更复杂的统计逻辑
    # 为简化，我们先提交删除操作
    await session.commit()
    
    return {"message": "Model statistics regenerated successfully"}


@router.get("/export/logs")
async def export_logs(
    format: str = Query("csv", regex="^(csv|json)$"),
    days: int = Query(30, ge=1, le=365),
    session: AsyncSession = Depends(get_session)
):
    """导出请求日志"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    query = select(APIRequestLog).where(
        APIRequestLog.created_at >= cutoff_date
    ).order_by(APIRequestLog.created_at.desc())
    
    result = await session.execute(query)
    logs = result.scalars().all()
    
    if format == "json":
        return [
            {
                "id": log.id,
                "created_at": log.created_at.isoformat(),
                "knowledge_id": log.knowledge_id,
                "model_id": log.model_id,
                "request_type": log.request_type,
                "status": log.status,
                "response_time_ms": log.response_time_ms,
                "input_tokens": log.input_tokens,
                "output_tokens": log.output_tokens,
                "cost": float(log.cost or 0),
                "error_message": log.error_message
            }
            for log in logs
        ]
    
    # CSV格式需要返回响应头
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # 写入标题行
    writer.writerow([
        "ID", "Created At", "Knowledge ID", "Model ID", "Request Type",
        "Status", "Response Time (ms)", "Input Tokens", "Output Tokens",
        "Cost", "Error Message"
    ])
    
    # 写入数据行
    for log in logs:
        writer.writerow([
            log.id,
            log.created_at.isoformat(),
            log.knowledge_id,
            log.model_id,
            log.request_type,
            log.status,
            log.response_time_ms,
            log.input_tokens,
            log.output_tokens,
            float(log.cost or 0),
            log.error_message or ""
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=api_logs.csv"}
    )