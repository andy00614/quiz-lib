from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid

from core.database import Base, TimestampMixin


class APICall(Base, TimestampMixin):
    """API调用记录表"""
    __tablename__ = "api_calls"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # 请求信息
    endpoint = Column(String(200), nullable=False)
    method = Column(String(10), nullable=False)
    request_id = Column(String(100), unique=True)
    user_id = Column(String(100))  # 可以关联到用户系统
    
    # 模型信息
    model_provider = Column(String(50))  # openai, anthropic, google
    model_name = Column(String(50))
    
    # 性能指标
    response_time_ms = Column(Integer)
    status_code = Column(Integer)
    error_type = Column(String(100))
    error_message = Column(String(500))
    
    # Token使用
    prompt_tokens = Column(Integer)
    completion_tokens = Column(Integer)
    total_tokens = Column(Integer)
    
    # 成本计算
    estimated_cost = Column(Float)  # 预估成本（美元）
    
    # 请求和响应摘要
    request_summary = Column(JSON)  # 存储关键请求参数
    response_summary = Column(JSON)  # 存储关键响应信息


class ModelUsage(Base, TimestampMixin):
    """模型使用统计表（按小时聚合）"""
    __tablename__ = "model_usage_stats"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # 时间维度
    hour_timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # 模型维度
    model_provider = Column(String(50), nullable=False)
    model_name = Column(String(50), nullable=False)
    
    # 统计指标
    total_calls = Column(Integer, default=0)
    successful_calls = Column(Integer, default=0)
    failed_calls = Column(Integer, default=0)
    
    # Token统计
    total_prompt_tokens = Column(Integer, default=0)
    total_completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    
    # 性能统计
    avg_response_time_ms = Column(Float)
    p95_response_time_ms = Column(Float)
    p99_response_time_ms = Column(Float)
    
    # 成本统计
    total_cost = Column(Float, default=0.0)
    
    # 错误统计
    error_distribution = Column(JSON)  # {"timeout": 5, "rate_limit": 3, ...}