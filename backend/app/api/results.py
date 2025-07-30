from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from core.database import get_session
from app.core.schemas.base import ResponseModel

router = APIRouter()


@router.get("/")
async def list_results():
    """获取结果列表"""
    return ResponseModel(data=[])


@router.get("/{result_id}")
async def get_result(result_id: UUID):
    """获取单个结果详情"""
    return ResponseModel(data=None)