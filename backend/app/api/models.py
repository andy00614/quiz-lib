from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.connection import get_session
from app.db.models import Model
from app.schemas.models import (
    ModelCreate, 
    ModelUpdate, 
    ModelResponse
)

router = APIRouter(prefix="/models", tags=["models"])


@router.get("/")
async def list_models(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    session: AsyncSession = Depends(get_session)
):
    """获取模型列表"""
    query = select(Model)
    
    if active_only:
        query = query.where(Model.is_active == True)
    
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    models = result.scalars().all()
    
    # 格式化响应数据
    formatted_models = []
    for model in models:
        model_data = {
            "id": model.id,
            "name": model.name,
            "display_name": getattr(model, 'display_name', model.name),
            "provider": model.provider,
            "version": model.version,
            "description": model.description,
            "input_price_per_1m": float(model.input_price_per_1m or 0),
            "output_price_per_1m": float(model.output_price_per_1m or 0),
            "input_price_display": f"${float(model.input_price_per_1m or 0):.1f}/1M",
            "output_price_display": f"${float(model.output_price_per_1m or 0):.1f}/1M",
            "max_tokens": model.max_tokens,
            "context_window": getattr(model, 'context_window', None),
            "supports_vision": getattr(model, 'supports_vision', False),
            "supports_audio": getattr(model, 'supports_audio', False),
            "supports_function_calling": getattr(model, 'supports_function_calling', False),
            "is_active": model.is_active,
            "created_at": model.created_at.isoformat(),
            "updated_at": model.updated_at.isoformat()
        }
        formatted_models.append(model_data)
    
    return formatted_models


@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(
    model_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取指定模型"""
    result = await session.execute(
        select(Model).where(Model.id == model_id)
    )
    model = result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    return model


@router.post("/", response_model=ModelResponse, status_code=status.HTTP_201_CREATED)
async def create_model(
    model_data: ModelCreate,
    session: AsyncSession = Depends(get_session)
):
    """创建新模型"""
    # 检查模型名称是否已存在
    result = await session.execute(
        select(Model).where(Model.name == model_data.name)
    )
    existing_model = result.scalar_one_or_none()
    
    if existing_model:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model with this name already exists"
        )
    
    # 创建新模型
    model = Model(**model_data.model_dump())
    session.add(model)
    await session.commit()
    await session.refresh(model)
    
    return model


@router.put("/{model_id}", response_model=ModelResponse)
async def update_model(
    model_id: int,
    model_data: ModelUpdate,
    session: AsyncSession = Depends(get_session)
):
    """更新模型"""
    result = await session.execute(
        select(Model).where(Model.id == model_id)
    )
    model = result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # 更新模型数据
    update_data = model_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(model, field, value)
    
    await session.commit()
    await session.refresh(model)
    
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_model(
    model_id: int,
    session: AsyncSession = Depends(get_session)
):
    """删除模型"""
    result = await session.execute(
        select(Model).where(Model.id == model_id)
    )
    model = result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    await session.delete(model)
    await session.commit()


@router.patch("/{model_id}/toggle", response_model=ModelResponse)
async def toggle_model_status(
    model_id: int,
    session: AsyncSession = Depends(get_session)
):
    """切换模型激活状态"""
    result = await session.execute(
        select(Model).where(Model.id == model_id)
    )
    model = result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    model.is_active = not model.is_active
    await session.commit()
    await session.refresh(model)
    
    return model