from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from core.database import get_session
from core.schemas.base import ResponseModel

router = APIRouter()


@router.get("/")
async def list_quizzes():
    """获取题库列表"""
    return ResponseModel(data=[])


@router.post("/{result_id}/generate")
async def generate_quiz(result_id: UUID):
    """根据结果生成题目"""
    return ResponseModel(data=None)