from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal


class ModelBase(BaseModel):
    """模型基础schema"""
    name: str = Field(..., max_length=100)
    provider: str = Field(..., max_length=50)
    version: Optional[str] = Field(None, max_length=50)
    input_price_per_1m: Optional[Decimal] = None
    output_price_per_1m: Optional[Decimal] = None
    max_tokens: Optional[int] = None
    is_active: bool = True


class ModelCreate(ModelBase):
    """创建模型schema"""
    pass


class ModelUpdate(BaseModel):
    """更新模型schema"""
    name: Optional[str] = Field(None, max_length=100)
    provider: Optional[str] = Field(None, max_length=50)
    version: Optional[str] = Field(None, max_length=50)
    input_price_per_1m: Optional[Decimal] = None
    output_price_per_1m: Optional[Decimal] = None
    max_tokens: Optional[int] = None
    is_active: Optional[bool] = None


class ModelResponse(ModelBase):
    """模型响应schema"""
    id: int
    created_at: datetime
    updated_at: datetime
    input_price_display: Optional[str] = None
    output_price_display: Optional[str] = None
    
    class Config:
        from_attributes = True


class PromptTemplateBase(BaseModel):
    """Prompt模板基础schema"""
    type: str = Field(..., max_length=50)  # 'outline' 或 'quiz'
    name: str = Field(..., max_length=100)
    content: str
    is_default: bool = False
    variables: Optional[List[Dict[str, Any]]] = None  # 支持对象数组


class PromptTemplateCreate(PromptTemplateBase):
    """创建Prompt模板schema"""
    pass


class PromptTemplateUpdate(BaseModel):
    """更新Prompt模板schema"""
    name: Optional[str] = Field(None, max_length=100)
    content: Optional[str] = None
    is_default: Optional[bool] = None
    variables: Optional[List[Dict[str, Any]]] = None  # 支持对象数组


class PromptTemplateResponse(PromptTemplateBase):
    """Prompt模板响应schema"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class KnowledgeRecordBase(BaseModel):
    """知识记录基础schema"""
    title: str
    model_id: int
    temperature: Optional[Decimal] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(2000, gt=0)
    top_p: Optional[Decimal] = Field(1.0, ge=0, le=1)
    outline_prompt_id: Optional[int] = None
    quiz_prompt_id: Optional[int] = None
    
    class Config:
        protected_namespaces = ()


class KnowledgeRecordCreate(KnowledgeRecordBase):
    """创建知识记录schema"""
    pass


class KnowledgeRecordUpdate(BaseModel):
    """更新知识记录schema"""
    title: Optional[str] = None
    status: Optional[str] = Field(None, max_length=50)


class KnowledgeRecordResponse(KnowledgeRecordBase):
    """知识记录响应schema"""
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    # 关联数据
    model: Optional[ModelResponse] = None
    outline_prompt: Optional[PromptTemplateResponse] = None
    quiz_prompt: Optional[PromptTemplateResponse] = None
    
    class Config:
        from_attributes = True


class OutlineBase(BaseModel):
    """大纲基础schema"""
    content: Dict[str, Any]  # 结构化的大纲内容
    raw_response: Optional[str] = None
    prompt_used: Optional[str] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    response_time_ms: Optional[int] = None
    cost: Optional[Decimal] = None
    error_message: Optional[str] = None


class OutlineCreate(OutlineBase):
    """创建大纲schema"""
    knowledge_id: int
    model_id: int
    
    class Config:
        protected_namespaces = ()


class OutlineResponse(OutlineBase):
    """大纲响应schema"""
    id: int
    knowledge_id: int
    model_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
        protected_namespaces = ()


class ChapterBase(BaseModel):
    """章节基础schema"""
    chapter_number: int
    title: str = Field(..., max_length=255)
    content: Optional[str] = None
    quiz_generation_status: str = Field('pending', max_length=50)


class ChapterResponse(ChapterBase):
    """章节响应schema"""
    id: int
    outline_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuizBase(BaseModel):
    """题目基础schema"""
    question_number: int
    question: str
    options: Dict[str, str]  # A, B, C, D 选项
    correct_answer: str = Field(..., max_length=1)
    explanation: Optional[str] = None
    prompt_used: Optional[str] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    response_time_ms: Optional[int] = None
    cost: Optional[Decimal] = None


class QuizCreate(QuizBase):
    """创建题目schema"""
    chapter_id: int
    model_id: int
    
    class Config:
        protected_namespaces = ()


class QuizResponse(QuizBase):
    """题目响应schema"""
    id: int
    chapter_id: int
    model_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
        protected_namespaces = ()


class APIRequestLogBase(BaseModel):
    """API请求日志基础schema"""
    request_type: str = Field(..., max_length=50)
    prompt: str
    request_params: Optional[Dict[str, Any]] = None
    response: Optional[str] = None
    status: str = Field(..., max_length=50)
    error_message: Optional[str] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    response_time_ms: Optional[int] = None
    cost: Optional[Decimal] = None


class APIRequestLogCreate(APIRequestLogBase):
    """创建API请求日志schema"""
    knowledge_id: Optional[int] = None
    model_id: int
    
    class Config:
        protected_namespaces = ()


class APIRequestLogResponse(APIRequestLogBase):
    """API请求日志响应schema"""
    id: int
    knowledge_id: Optional[int] = None
    model_id: int
    created_at: datetime
    
    # 关联数据
    knowledge: Optional[KnowledgeRecordResponse] = None
    model: Optional[ModelResponse] = None
    
    class Config:
        from_attributes = True
        protected_namespaces = ()


class ModelPerformanceStatsResponse(BaseModel):
    """模型性能统计响应schema"""
    id: int
    model_id: int
    task_type: str
    period_type: str
    period_date: datetime
    avg_response_time_ms: Optional[Decimal] = None
    p95_response_time_ms: Optional[Decimal] = None
    total_requests: Optional[int] = None
    success_count: Optional[int] = None
    error_count: Optional[int] = None
    avg_input_tokens: Optional[Decimal] = None
    avg_output_tokens: Optional[Decimal] = None
    avg_cost: Optional[Decimal] = None
    total_cost: Optional[Decimal] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
        protected_namespaces = ()


# 生成请求的schema
class GenerateOutlineRequest(BaseModel):
    """生成大纲请求schema"""
    title: str
    model_id: int
    temperature: Optional[Decimal] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(2000, gt=0)
    top_p: Optional[Decimal] = Field(1.0, ge=0, le=1)
    outline_prompt: Optional[str] = None
    
    class Config:
        protected_namespaces = ()


class GenerateQuizRequest(BaseModel):
    """生成题目请求schema"""
    chapter_id: int
    model_id: int
    question_count: Optional[int] = Field(10, gt=0, le=50)
    temperature: Optional[Decimal] = Field(0.7, ge=0, le=2)
    max_tokens: Optional[int] = Field(2000, gt=0)
    top_p: Optional[Decimal] = Field(1.0, ge=0, le=1)
    quiz_prompt: Optional[str] = None
    
    class Config:
        protected_namespaces = ()


# 统计相关的schema
class DashboardStats(BaseModel):
    """仪表板统计数据"""
    total_knowledge: int
    total_quizzes: int
    total_requests: int
    avg_response_time: float
    error_rate: float
    total_cost: Decimal


class ModelStats(BaseModel):
    """模型统计数据"""
    model_id: int
    model_name: str
    task_type: str
    avg_response_time_ms: float
    p95_response_time_ms: float
    success_rate: float
    error_rate: float
    avg_cost: Decimal
    total_requests: int
    
    class Config:
        protected_namespaces = ()