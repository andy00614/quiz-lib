from sqlalchemy import Column, String, Text, Float, Integer, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from core.database import Base, TimestampMixin


class PromptTemplate(Base, TimestampMixin):
    """Prompt模板表"""
    __tablename__ = "prompt_templates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, unique=True)
    description = Column(Text)
    category = Column(String(100))  # 如：操作系统、Python基础等
    template_content = Column(Text, nullable=False)
    variables = Column(JSON)  # 存储变量占位符信息
    is_active = Column(Boolean, default=True)
    
    # 默认参数
    default_model = Column(String(50), default="gpt-4o")
    default_temperature = Column(Float, default=0.7)
    default_max_tokens = Column(Integer, default=2000)
    default_top_p = Column(Float, default=1.0)
    
    # 关系
    executions = relationship("PromptExecution", back_populates="template")


class PromptExecution(Base, TimestampMixin):
    """Prompt执行记录表"""
    __tablename__ = "prompt_executions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("prompt_templates.id"), nullable=False)
    
    # 执行参数
    topic = Column(String(500), nullable=False)
    tags = Column(JSON)  # 标签列表
    model = Column(String(50), nullable=False)
    temperature = Column(Float)
    max_tokens = Column(Integer)
    top_p = Column(Float)
    
    # 完整的prompt内容
    final_prompt = Column(Text, nullable=False)
    
    # 执行状态
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    error_message = Column(Text)
    
    # 关系
    template = relationship("PromptTemplate", back_populates="executions")
    results = relationship("GenerationResult", back_populates="execution")