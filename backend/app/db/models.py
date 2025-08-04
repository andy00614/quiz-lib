from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, DECIMAL, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import json

Base = declarative_base()


class Model(Base):
    """AI模型表"""
    __tablename__ = "models"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)  # API中使用的模型名称
    display_name = Column(String(100), nullable=False)  # 用户友好的显示名称
    provider = Column(String(50), nullable=False)  # openai, anthropic, google
    version = Column(String(50))
    description = Column(Text)  # 模型描述
    input_price_per_1m = Column(DECIMAL(10, 2))  # 每1M token的输入价格
    output_price_per_1m = Column(DECIMAL(10, 2))  # 每1M token的输出价格
    cached_input_price_per_1m = Column(DECIMAL(10, 2))  # 缓存输入的价格(如果支持)
    max_tokens = Column(Integer)
    context_window = Column(Integer)  # 上下文窗口大小
    supports_vision = Column(Boolean, default=False)  # 是否支持图像
    supports_audio = Column(Boolean, default=False)  # 是否支持音频
    supports_function_calling = Column(Boolean, default=False)  # 是否支持函数调用
    release_date = Column(DateTime)  # 模型发布日期
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    knowledge_records = relationship("KnowledgeRecord", back_populates="model")
    outlines = relationship("Outline", back_populates="model")
    quizzes = relationship("Quiz", back_populates="model")
    api_logs = relationship("APIRequestLog", back_populates="model")
    performance_stats = relationship("ModelPerformanceStats", back_populates="model")


class PromptTemplate(Base):
    """Prompt模板表"""
    __tablename__ = "prompt_templates"
    
    id = Column(Integer, primary_key=True)
    type = Column(String(50), nullable=False)  # 'outline', 'quiz'
    name = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    is_default = Column(Boolean, default=False)
    variables = Column(JSON)  # 存储可用的变量占位符
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    outline_knowledge_records = relationship(
        "KnowledgeRecord", 
        foreign_keys="KnowledgeRecord.outline_prompt_id",
        back_populates="outline_prompt"
    )
    quiz_knowledge_records = relationship(
        "KnowledgeRecord", 
        foreign_keys="KnowledgeRecord.quiz_prompt_id",
        back_populates="quiz_prompt"
    )


class KnowledgeRecord(Base):
    """知识记录表"""
    __tablename__ = "knowledge_records"
    
    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    model_id = Column(Integer, ForeignKey("models.id"))
    temperature = Column(DECIMAL(3, 2), default=0.7)
    max_tokens = Column(Integer)
    top_p = Column(DECIMAL(3, 2))
    outline_prompt_id = Column(Integer, ForeignKey("prompt_templates.id"))
    quiz_prompt_id = Column(Integer, ForeignKey("prompt_templates.id"))
    status = Column(String(50), default='pending')  # pending, generating, completed, failed
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    model = relationship("Model", back_populates="knowledge_records")
    outline_prompt = relationship(
        "PromptTemplate", 
        foreign_keys=[outline_prompt_id],
        back_populates="outline_knowledge_records"
    )
    quiz_prompt = relationship(
        "PromptTemplate", 
        foreign_keys=[quiz_prompt_id],
        back_populates="quiz_knowledge_records"
    )
    outlines = relationship("Outline", back_populates="knowledge", cascade="all, delete-orphan")
    api_logs = relationship("APIRequestLog", back_populates="knowledge")


class Outline(Base):
    """大纲表"""
    __tablename__ = "outlines"
    
    id = Column(Integer, primary_key=True)
    knowledge_id = Column(Integer, ForeignKey("knowledge_records.id", ondelete="CASCADE"))
    content = Column(JSON, nullable=False)  # 存储结构化的大纲内容
    raw_response = Column(Text)  # 原始 AI 响应
    model_id = Column(Integer, ForeignKey("models.id"))
    prompt_used = Column(Text)  # 实际使用的完整 prompt
    input_tokens = Column(Integer)
    output_tokens = Column(Integer)
    response_time_ms = Column(Integer)  # 响应时间（毫秒）
    cost = Column(DECIMAL(10, 6))  # 计算得出的成本
    error_message = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    knowledge = relationship("KnowledgeRecord", back_populates="outlines")
    model = relationship("Model", back_populates="outlines")
    chapters = relationship("Chapter", back_populates="outline", cascade="all, delete-orphan")


class Chapter(Base):
    """章节表"""
    __tablename__ = "chapters"
    
    id = Column(Integer, primary_key=True)
    outline_id = Column(Integer, ForeignKey("outlines.id", ondelete="CASCADE"))
    chapter_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    quiz_generation_status = Column(String(50), default='pending')  # pending, generating, completed, failed
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    outline = relationship("Outline", back_populates="chapters")
    quizzes = relationship("Quiz", back_populates="chapter", cascade="all, delete-orphan")


class Quiz(Base):
    """题目表"""
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"))
    question_number = Column(Integer, nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # 存储 A, B, C, D 选项
    correct_answer = Column(String(1), nullable=False)  # A, B, C, 或 D
    explanation = Column(Text)
    model_id = Column(Integer, ForeignKey("models.id"))
    prompt_used = Column(Text)
    input_tokens = Column(Integer)
    output_tokens = Column(Integer)
    response_time_ms = Column(Integer)
    cost = Column(DECIMAL(10, 6))
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    chapter = relationship("Chapter", back_populates="quizzes")
    model = relationship("Model", back_populates="quizzes")


class APIRequestLog(Base):
    """API请求日志表"""
    __tablename__ = "api_request_logs"
    
    id = Column(Integer, primary_key=True)
    knowledge_id = Column(Integer, ForeignKey("knowledge_records.id"))
    request_type = Column(String(50), nullable=False)  # 'outline_generation' 或 'quiz_generation'
    model_id = Column(Integer, ForeignKey("models.id"))
    prompt = Column(Text, nullable=False)
    request_params = Column(JSON)  # 存储温度、max_tokens 等参数
    response = Column(Text)
    status = Column(String(50), nullable=False)  # success, failed, timeout
    error_message = Column(Text)
    input_tokens = Column(Integer)
    output_tokens = Column(Integer)
    response_time_ms = Column(Integer)
    cost = Column(DECIMAL(10, 6))
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    knowledge = relationship("KnowledgeRecord", back_populates="api_logs")
    model = relationship("Model", back_populates="api_logs")


class ModelPerformanceStats(Base):
    """模型性能统计表"""
    __tablename__ = "model_performance_stats"
    
    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey("models.id"))
    task_type = Column(String(50), nullable=False)  # 'outline' 或 'quiz'
    period_type = Column(String(20), nullable=False)  # 'daily', 'weekly', 'monthly'
    period_date = Column(DateTime, nullable=False)
    avg_response_time_ms = Column(DECIMAL(10, 2))
    p95_response_time_ms = Column(DECIMAL(10, 2))
    total_requests = Column(Integer)
    success_count = Column(Integer)
    error_count = Column(Integer)
    avg_input_tokens = Column(DECIMAL(10, 2))
    avg_output_tokens = Column(DECIMAL(10, 2))
    avg_cost = Column(DECIMAL(10, 6))
    total_cost = Column(DECIMAL(10, 4))
    created_at = Column(DateTime, default=func.now())
    
    # 关系
    model = relationship("Model", back_populates="performance_stats")
    
    __table_args__ = (
        # 确保唯一性
        {'sqlite_autoincrement': True},
    )