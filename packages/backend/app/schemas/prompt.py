from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

from core.schemas.base import BaseSchema


class PromptTemplateBase(BaseModel):
    """Prompt模板基础模型"""
    name: str = Field(..., description="模板名称", min_length=1, max_length=200)
    description: Optional[str] = Field(None, description="模板描述")
    category: Optional[str] = Field(None, description="分类")
    template_content: str = Field(..., description="模板内容", min_length=1)
    variables: Optional[Dict[str, Any]] = Field(default_factory=dict, description="变量占位符信息")
    default_model: str = Field("gpt-4o", description="默认模型")
    default_temperature: float = Field(0.7, description="默认温度", ge=0, le=2)
    default_max_tokens: int = Field(2000, description="默认最大token数", ge=1, le=8000)
    default_top_p: float = Field(1.0, description="默认top_p", ge=0, le=1)


class PromptTemplateCreate(PromptTemplateBase):
    """创建Prompt模板"""
    pass


class PromptTemplateUpdate(BaseModel):
    """更新Prompt模板"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    template_content: Optional[str] = Field(None, min_length=1)
    variables: Optional[Dict[str, Any]] = None
    default_model: Optional[str] = None
    default_temperature: Optional[float] = Field(None, ge=0, le=2)
    default_max_tokens: Optional[int] = Field(None, ge=1, le=8000)
    default_top_p: Optional[float] = Field(None, ge=0, le=1)
    is_active: Optional[bool] = None


class PromptTemplate(PromptTemplateBase, BaseSchema):
    """Prompt模板响应模型"""
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime


class PromptExecutionBase(BaseModel):
    """Prompt执行基础模型"""
    topic: str = Field(..., description="主题", min_length=1, max_length=500)
    tags: Optional[List[str]] = Field(default_factory=list, description="标签列表")
    model: str = Field(..., description="使用的模型")
    temperature: Optional[float] = Field(None, ge=0, le=2)
    max_tokens: Optional[int] = Field(None, ge=1, le=8000)
    top_p: Optional[float] = Field(None, ge=0, le=1)


class PromptExecutionCreate(PromptExecutionBase):
    """创建Prompt执行"""
    template_id: UUID = Field(..., description="模板ID")


class PromptExecution(PromptExecutionBase, BaseSchema):
    """Prompt执行响应模型"""
    id: UUID
    template_id: UUID
    final_prompt: str
    status: str
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime


class PromptPlaygroundRequest(BaseModel):
    """Prompt Playground请求模型"""
    prompt: str = Field(..., description="Prompt内容", min_length=1)
    model: str = Field("gpt-4o", description="模型选择")
    temperature: float = Field(0.7, ge=0, le=2)
    max_tokens: int = Field(2000, ge=1, le=8000)
    top_p: float = Field(1.0, ge=0, le=1)
    stream: bool = Field(False, description="是否流式响应")


class ModelInfo(BaseModel):
    """模型信息"""
    provider: str
    model_name: str
    display_name: str
    description: Optional[str]
    price_per_1k_prompt_tokens: float
    price_per_1k_completion_tokens: float
    max_tokens: int
    supports_functions: bool = False
    supports_vision: bool = False