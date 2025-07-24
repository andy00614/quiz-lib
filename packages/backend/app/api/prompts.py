from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from uuid import UUID
import structlog

from core.database import get_session
from core.schemas.base import ResponseModel, PaginatedResponse
from app.models import PromptTemplate, PromptExecution
from app.schemas.prompt import (
    PromptTemplateCreate,
    PromptTemplateUpdate,
    PromptTemplate as PromptTemplateSchema,
    PromptExecutionCreate,
    PromptExecution as PromptExecutionSchema,
    PromptPlaygroundRequest,
    ModelInfo
)
from app.services.llm_service import LLMService

router = APIRouter()
logger = structlog.get_logger()


@router.get("/models", response_model=ResponseModel[List[ModelInfo]])
async def list_available_models():
    """获取可用的AI模型列表"""
    models = [
        ModelInfo(
            provider="openai",
            model_name="gpt-4o",
            display_name="GPT-4o",
            description="OpenAI最新的多模态模型",
            price_per_1k_prompt_tokens=0.005,
            price_per_1k_completion_tokens=0.015,
            max_tokens=4096,
            supports_vision=True
        ),
        ModelInfo(
            provider="openai",
            model_name="gpt-4o-mini",
            display_name="GPT-4o Mini",
            description="更快速、成本更低的GPT-4o版本",
            price_per_1k_prompt_tokens=0.00015,
            price_per_1k_completion_tokens=0.0006,
            max_tokens=16384
        ),
        ModelInfo(
            provider="anthropic",
            model_name="claude-3-5-sonnet-20241022",
            display_name="Claude 3.5 Sonnet",
            description="Anthropic最新的Claude模型",
            price_per_1k_prompt_tokens=0.003,
            price_per_1k_completion_tokens=0.015,
            max_tokens=8192
        ),
        ModelInfo(
            provider="google",
            model_name="gemini-1.5-pro",
            display_name="Gemini 1.5 Pro",
            description="Google的多模态AI模型",
            price_per_1k_prompt_tokens=0.00125,
            price_per_1k_completion_tokens=0.00375,
            max_tokens=8192,
            supports_vision=True
        ),
    ]
    
    return ResponseModel(data=models)


@router.post("/templates", response_model=ResponseModel[PromptTemplateSchema])
async def create_template(
    template: PromptTemplateCreate,
    db: AsyncSession = Depends(get_session)
):
    """创建Prompt模板"""
    # 检查名称是否已存在
    stmt = select(PromptTemplate).where(PromptTemplate.name == template.name)
    existing = await db.execute(stmt)
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="模板名称已存在")
    
    db_template = PromptTemplate(**template.dict())
    db.add(db_template)
    await db.commit()
    await db.refresh(db_template)
    
    return ResponseModel(data=PromptTemplateSchema.from_orm(db_template))


@router.get("/templates", response_model=ResponseModel[PaginatedResponse[PromptTemplateSchema]])
async def list_templates(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_session)
):
    """获取Prompt模板列表"""
    # 构建查询
    query = select(PromptTemplate)
    count_query = select(func.count()).select_from(PromptTemplate)
    
    # 应用过滤条件
    if category:
        query = query.where(PromptTemplate.category == category)
        count_query = count_query.where(PromptTemplate.category == category)
    
    if is_active is not None:
        query = query.where(PromptTemplate.is_active == is_active)
        count_query = count_query.where(PromptTemplate.is_active == is_active)
    
    if search:
        search_filter = PromptTemplate.name.ilike(f"%{search}%") | PromptTemplate.description.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)
    
    # 获取总数
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # 分页
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(PromptTemplate.created_at.desc())
    
    # 执行查询
    result = await db.execute(query)
    templates = result.scalars().all()
    
    # 构建响应
    paginated = PaginatedResponse(
        items=[PromptTemplateSchema.from_orm(t) for t in templates],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )
    
    return ResponseModel(data=paginated)


@router.get("/templates/{template_id}", response_model=ResponseModel[PromptTemplateSchema])
async def get_template(
    template_id: UUID,
    db: AsyncSession = Depends(get_session)
):
    """获取单个Prompt模板"""
    template = await db.get(PromptTemplate, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")
    
    return ResponseModel(data=PromptTemplateSchema.from_orm(template))


@router.patch("/templates/{template_id}", response_model=ResponseModel[PromptTemplateSchema])
async def update_template(
    template_id: UUID,
    update: PromptTemplateUpdate,
    db: AsyncSession = Depends(get_session)
):
    """更新Prompt模板"""
    template = await db.get(PromptTemplate, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")
    
    # 更新字段
    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(template, field, value)
    
    await db.commit()
    await db.refresh(template)
    
    return ResponseModel(data=PromptTemplateSchema.from_orm(template))


@router.delete("/templates/{template_id}", response_model=ResponseModel[str])
async def delete_template(
    template_id: UUID,
    db: AsyncSession = Depends(get_session)
):
    """删除Prompt模板"""
    template = await db.get(PromptTemplate, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")
    
    await db.delete(template)
    await db.commit()
    
    return ResponseModel(data="模板删除成功")


@router.post("/playground", response_model=ResponseModel[dict])
async def prompt_playground(
    request: PromptPlaygroundRequest,
    db: AsyncSession = Depends(get_session)
):
    """Prompt Playground - 快速测试Prompt"""
    try:
        llm_service = LLMService()
        
        # 调用LLM
        result = await llm_service.generate(
            prompt=request.prompt,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            top_p=request.top_p,
            stream=request.stream
        )
        
        return ResponseModel(data=result)
    
    except Exception as e:
        logger.error(f"Prompt playground error: {e}")
        raise HTTPException(status_code=500, detail=f"生成失败: {str(e)}")


@router.post("/execute", response_model=ResponseModel[PromptExecutionSchema])
async def execute_prompt(
    execution: PromptExecutionCreate,
    db: AsyncSession = Depends(get_session)
):
    """执行Prompt模板"""
    # 获取模板
    template = await db.get(PromptTemplate, execution.template_id)
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")
    
    if not template.is_active:
        raise HTTPException(status_code=400, detail="模板已被禁用")
    
    # 创建执行记录
    db_execution = PromptExecution(
        template_id=execution.template_id,
        topic=execution.topic,
        tags=execution.tags,
        model=execution.model or template.default_model,
        temperature=execution.temperature or template.default_temperature,
        max_tokens=execution.max_tokens or template.default_max_tokens,
        top_p=execution.top_p or template.default_top_p,
        final_prompt=template.template_content.format(topic=execution.topic),
        status="pending"
    )
    
    db.add(db_execution)
    await db.commit()
    await db.refresh(db_execution)
    
    # TODO: 异步调用LLM服务生成内容
    
    return ResponseModel(data=PromptExecutionSchema.from_orm(db_execution))