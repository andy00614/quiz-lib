from sqlalchemy import Column, String, Text, Float, Integer, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from core.database import Base, TimestampMixin


class GenerationResult(Base, TimestampMixin):
    """生成结果表"""
    __tablename__ = "generation_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("prompt_executions.id"), nullable=False)
    
    # 生成内容
    content = Column(Text, nullable=False)
    structure_type = Column(String(50))  # outline, content, mixed
    
    # 元信息
    model_used = Column(String(50), nullable=False)
    total_tokens = Column(Integer)
    prompt_tokens = Column(Integer)
    completion_tokens = Column(Integer)
    response_time_ms = Column(Integer)  # 响应时间（毫秒）
    
    # AI评分和推荐
    ai_score = Column(Float)  # 0-100分
    is_recommended = Column(Boolean, default=False)
    score_reason = Column(Text)
    
    # 版本控制
    version = Column(Integer, default=1)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("generation_results.id"))
    
    # 关系
    execution = relationship("PromptExecution", back_populates="results")
    blocks = relationship("ResultBlock", back_populates="result", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="result")
    
    # 自引用关系（用于版本控制）
    parent = relationship("GenerationResult", remote_side=[id])


class ResultBlock(Base, TimestampMixin):
    """结果内容块表"""
    __tablename__ = "result_blocks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    result_id = Column(UUID(as_uuid=True), ForeignKey("generation_results.id"), nullable=False)
    
    # 块信息
    block_type = Column(String(50), nullable=False)  # chapter, section, point, etc.
    title = Column(String(500), nullable=False)
    content = Column(Text)
    order_index = Column(Integer, nullable=False)  # 排序索引
    level = Column(Integer, default=1)  # 层级深度
    parent_block_id = Column(UUID(as_uuid=True), ForeignKey("result_blocks.id"))
    
    # 元数据
    metadata = Column(JSON)  # 存储额外信息
    
    # 关系
    result = relationship("GenerationResult", back_populates="blocks")
    parent_block = relationship("ResultBlock", remote_side=[id])
    questions = relationship("Question", back_populates="block")