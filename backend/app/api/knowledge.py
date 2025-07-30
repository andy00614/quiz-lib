from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.connection import get_session
from app.db.models import KnowledgeRecord, Outline, Chapter, Quiz, Model, PromptTemplate
from app.schemas.models import (
    KnowledgeRecordCreate,
    KnowledgeRecordUpdate,
    KnowledgeRecordResponse,
    OutlineResponse,
    ChapterResponse,
    QuizResponse,
    GenerateOutlineRequest
)
from app.services.llm_service import llm_service

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.get("/", response_model=List[KnowledgeRecordResponse])
async def list_knowledge(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    session: AsyncSession = Depends(get_session)
):
    """获取知识列表"""
    query = select(KnowledgeRecord).options(
        selectinload(KnowledgeRecord.model),
        selectinload(KnowledgeRecord.outline_prompt),
        selectinload(KnowledgeRecord.quiz_prompt)
    )
    
    if status_filter:
        query = query.where(KnowledgeRecord.status == status_filter)
    
    query = query.offset(skip).limit(limit).order_by(KnowledgeRecord.created_at.desc())
    result = await session.execute(query)
    knowledge_records = result.scalars().all()
    
    return knowledge_records


@router.get("/{knowledge_id}", response_model=KnowledgeRecordResponse)
async def get_knowledge(
    knowledge_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取指定知识记录"""
    result = await session.execute(
        select(KnowledgeRecord)
        .options(
            selectinload(KnowledgeRecord.model),
            selectinload(KnowledgeRecord.outline_prompt),
            selectinload(KnowledgeRecord.quiz_prompt),
            selectinload(KnowledgeRecord.outlines)
        )
        .where(KnowledgeRecord.id == knowledge_id)
    )
    knowledge = result.scalar_one_or_none()
    
    if not knowledge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge record not found"
        )
    
    return knowledge


@router.post("/", response_model=KnowledgeRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_knowledge(
    knowledge_data: KnowledgeRecordCreate,
    session: AsyncSession = Depends(get_session)
):
    """创建知识记录"""
    # 验证模型是否存在
    result = await session.execute(
        select(Model).where(Model.id == knowledge_data.model_id)
    )
    model = result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # 创建知识记录
    knowledge = KnowledgeRecord(**knowledge_data.model_dump())
    session.add(knowledge)
    await session.commit()
    await session.refresh(knowledge)
    
    return knowledge


@router.put("/{knowledge_id}", response_model=KnowledgeRecordResponse)
async def update_knowledge(
    knowledge_id: int,
    knowledge_data: KnowledgeRecordUpdate,
    session: AsyncSession = Depends(get_session)
):
    """更新知识记录"""
    result = await session.execute(
        select(KnowledgeRecord).where(KnowledgeRecord.id == knowledge_id)
    )
    knowledge = result.scalar_one_or_none()
    
    if not knowledge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge record not found"
        )
    
    # 更新数据
    update_data = knowledge_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(knowledge, field, value)
    
    await session.commit()
    await session.refresh(knowledge)
    
    return knowledge


@router.delete("/{knowledge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge(
    knowledge_id: int,
    session: AsyncSession = Depends(get_session)
):
    """删除知识记录"""
    result = await session.execute(
        select(KnowledgeRecord).where(KnowledgeRecord.id == knowledge_id)
    )
    knowledge = result.scalar_one_or_none()
    
    if not knowledge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge record not found"
        )
    
    await session.delete(knowledge)
    await session.commit()


@router.get("/{knowledge_id}/outline", response_model=OutlineResponse)
async def get_knowledge_outline(
    knowledge_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取知识大纲"""
    result = await session.execute(
        select(Outline)
        .options(selectinload(Outline.chapters))
        .where(Outline.knowledge_id == knowledge_id)
    )
    outline = result.scalar_one_or_none()
    
    if not outline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Outline not found"
        )
    
    return outline


@router.get("/{knowledge_id}/chapters", response_model=List[ChapterResponse])
async def get_knowledge_chapters(
    knowledge_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取知识章节列表"""
    # 先获取大纲
    outline_result = await session.execute(
        select(Outline).where(Outline.knowledge_id == knowledge_id)
    )
    outline = outline_result.scalar_one_or_none()
    
    if not outline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Outline not found"
        )
    
    # 获取章节
    result = await session.execute(
        select(Chapter)
        .where(Chapter.outline_id == outline.id)
        .order_by(Chapter.chapter_number)
    )
    chapters = result.scalars().all()
    
    return chapters


@router.get("/{knowledge_id}/chapters/{chapter_id}/quizzes", response_model=List[QuizResponse])
async def get_chapter_quizzes(
    knowledge_id: int,
    chapter_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取章节题目"""
    # 验证章节是否属于该知识记录
    chapter_result = await session.execute(
        select(Chapter)
        .join(Outline)
        .where(
            Chapter.id == chapter_id,
            Outline.knowledge_id == knowledge_id
        )
    )
    chapter = chapter_result.scalar_one_or_none()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # 获取题目
    result = await session.execute(
        select(Quiz)
        .where(Quiz.chapter_id == chapter_id)
        .order_by(Quiz.question_number)
    )
    quizzes = result.scalars().all()
    
    return quizzes