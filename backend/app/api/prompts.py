from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.connection import get_session
from app.db.models import PromptTemplate
from app.schemas.models import (
    PromptTemplateCreate,
    PromptTemplateUpdate,
    PromptTemplateResponse
)

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.get("/", response_model=List[PromptTemplateResponse])
async def list_prompt_templates(
    skip: int = 0,
    limit: int = 100,
    type_filter: str = None,
    session: AsyncSession = Depends(get_session)
):
    """获取Prompt模板列表"""
    query = select(PromptTemplate)
    
    if type_filter:
        query = query.where(PromptTemplate.type == type_filter)
    
    query = query.offset(skip).limit(limit).order_by(PromptTemplate.created_at.desc())
    result = await session.execute(query)
    templates = result.scalars().all()
    
    return templates


@router.get("/{template_id}", response_model=PromptTemplateResponse)
async def get_prompt_template(
    template_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取指定Prompt模板"""
    result = await session.execute(
        select(PromptTemplate).where(PromptTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt template not found"
        )
    
    return template


@router.get("/type/{template_type}/default", response_model=PromptTemplateResponse)
async def get_default_prompt_template(
    template_type: str,
    session: AsyncSession = Depends(get_session)
):
    """获取指定类型的默认Prompt模板"""
    result = await session.execute(
        select(PromptTemplate).where(
            PromptTemplate.type == template_type,
            PromptTemplate.is_default == True
        )
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Default template for type '{template_type}' not found"
        )
    
    return template


@router.post("/", response_model=PromptTemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_prompt_template(
    template_data: PromptTemplateCreate,
    session: AsyncSession = Depends(get_session)
):
    """创建Prompt模板"""
    # 检查模板名称是否已存在
    result = await session.execute(
        select(PromptTemplate).where(PromptTemplate.name == template_data.name)
    )
    existing_template = result.scalar_one_or_none()
    
    if existing_template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template with this name already exists"
        )
    
    # 如果设置为默认模板，需要取消同类型的其他默认模板
    if template_data.is_default:
        await session.execute(
            PromptTemplate.__table__.update()
            .where(PromptTemplate.type == template_data.type)
            .values(is_default=False)
        )
    
    # 创建新模板
    template = PromptTemplate(**template_data.model_dump())
    session.add(template)
    await session.commit()
    await session.refresh(template)
    
    return template


@router.put("/{template_id}", response_model=PromptTemplateResponse)
async def update_prompt_template(
    template_id: int,
    template_data: PromptTemplateUpdate,
    session: AsyncSession = Depends(get_session)
):
    """更新Prompt模板"""
    result = await session.execute(
        select(PromptTemplate).where(PromptTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt template not found"
        )
    
    # 如果要设置为默认模板，需要取消同类型的其他默认模板
    update_data = template_data.model_dump(exclude_unset=True)
    if update_data.get("is_default"):
        await session.execute(
            PromptTemplate.__table__.update()
            .where(
                PromptTemplate.type == template.type,
                PromptTemplate.id != template_id
            )
            .values(is_default=False)
        )
    
    # 更新模板数据
    for field, value in update_data.items():
        setattr(template, field, value)
    
    await session.commit()
    await session.refresh(template)
    
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prompt_template(
    template_id: int,
    session: AsyncSession = Depends(get_session)
):
    """删除Prompt模板"""
    result = await session.execute(
        select(PromptTemplate).where(PromptTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt template not found"
        )
    
    # 不允许删除默认模板
    if template.is_default:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete default template"
        )
    
    await session.delete(template)
    await session.commit()


@router.patch("/{template_id}/set-default", response_model=PromptTemplateResponse)
async def set_default_template(
    template_id: int,
    session: AsyncSession = Depends(get_session)
):
    """设置为默认模板"""
    result = await session.execute(
        select(PromptTemplate).where(PromptTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt template not found"
        )
    
    # 取消同类型的其他默认模板
    await session.execute(
        PromptTemplate.__table__.update()
        .where(
            PromptTemplate.type == template.type,
            PromptTemplate.id != template_id
        )
        .values(is_default=False)
    )
    
    # 设置当前模板为默认
    template.is_default = True
    await session.commit()
    await session.refresh(template)
    
    return template