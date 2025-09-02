from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Dict, Any

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


@router.get("/", response_model=List[Dict[str, Any]])
async def list_knowledge(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    session: AsyncSession = Depends(get_session)
):
    """获取知识列表（包含统计信息）"""
    query = select(KnowledgeRecord).options(
        selectinload(KnowledgeRecord.model),
        selectinload(KnowledgeRecord.outline_prompt),
        selectinload(KnowledgeRecord.quiz_prompt),
        selectinload(KnowledgeRecord.outlines).selectinload(Outline.chapters).selectinload(Chapter.quizzes)
    )
    
    if status_filter:
        query = query.where(KnowledgeRecord.status == status_filter)
    
    query = query.offset(skip).limit(limit).order_by(KnowledgeRecord.created_at.desc())
    result = await session.execute(query)
    knowledge_records = result.scalars().all()
    
    # 为每个知识记录计算统计信息
    enriched_records = []
    for record in knowledge_records:
        # 计算大纲统计
        total_outline_cost = 0
        outline_input_tokens = 0
        outline_output_tokens = 0
        total_outline_time = 0
        
        # 计算题目统计
        total_quiz_cost = 0
        quiz_input_tokens = 0
        quiz_output_tokens = 0
        total_quiz_time = 0
        actual_quiz_generation_time = 0  # 实际并行生成时间
        is_parallel_generation = False  # 是否为并行生成
        total_quiz_count = 0
        completed_chapter_count = 0
        total_chapter_count = 0
        failed_chapter_count = 0
        last_error_message = None
        
        for outline in record.outlines:
            # 大纲统计
            total_outline_cost += float(outline.cost or 0)
            outline_input_tokens += outline.input_tokens or 0
            outline_output_tokens += outline.output_tokens or 0
            total_outline_time += outline.response_time_ms or 0
            
            # 保存错误信息
            if outline.error_message:
                last_error_message = outline.error_message
            
            # 章节和题目统计
            chapter_creation_times = []
            chapter_response_times = []
            
            for chapter in outline.chapters:
                total_chapter_count += 1
                if chapter.quiz_generation_status == 'completed':
                    completed_chapter_count += 1
                elif chapter.quiz_generation_status == 'failed':
                    failed_chapter_count += 1
                
                # 收集每个章节第一个题目的创建时间和响应时间
                if chapter.quizzes:
                    first_quiz = chapter.quizzes[0]
                    chapter_creation_times.append(first_quiz.created_at)
                    if first_quiz.response_time_ms:
                        chapter_response_times.append(first_quiz.response_time_ms)
                        # 每个章节只累加一次响应时间（因为章节内的题目是批量生成的）
                        total_quiz_time += first_quiz.response_time_ms
                
                # 累加成本和token（每个题目都要计算）
                for quiz in chapter.quizzes:
                    total_quiz_cost += float(quiz.cost or 0)
                    quiz_input_tokens += quiz.input_tokens or 0
                    quiz_output_tokens += quiz.output_tokens or 0
                    total_quiz_count += 1
            
            # 判断是否为并行生成：检查相邻章节创建时间间隔
            if len(outline.chapters) > 1 and len(chapter_creation_times) > 1:
                # 按时间排序
                sorted_times = sorted(chapter_creation_times)
                
                # 计算相邻章节的时间间隔（秒）
                time_intervals = []
                for i in range(1, len(sorted_times)):
                    interval = (sorted_times[i] - sorted_times[i-1]).total_seconds()
                    time_intervals.append(interval)
                
                max_interval = max(time_intervals) if time_intervals else 0
                
                # 如果所有相邻章节的间隔都在60秒内，认为是并行生成
                if max_interval <= 60 and chapter_response_times:
                    is_parallel_generation = True
                    # 并行生成时，实际时间应该是最慢的那个章节的时间
                    actual_quiz_generation_time = max(chapter_response_times)
        
        # 构建响应数据
        record_data = {
            "id": record.id,
            "title": record.title,
            "status": record.status,
            "created_at": record.created_at.isoformat(),
            "updated_at": record.updated_at.isoformat(),
            "model": {
                "id": record.model.id if record.model else "unknown",
                "name": record.model.name if record.model else "Unknown Model",
                "provider": record.model.provider if record.model else "unknown"
            },
            "parameters": {
                "temperature": float(record.temperature or 0),
                "max_tokens": record.max_tokens,
                "top_p": float(record.top_p or 0)
            },
            "statistics": {
                "total_cost": total_outline_cost + total_quiz_cost,
                "total_input_tokens": outline_input_tokens + quiz_input_tokens,
                "total_output_tokens": outline_output_tokens + quiz_output_tokens,
                "total_tokens": outline_input_tokens + outline_output_tokens + quiz_input_tokens + quiz_output_tokens,
                "total_time_ms": total_outline_time + (actual_quiz_generation_time if is_parallel_generation else total_quiz_time),
                "outline_cost": total_outline_cost,
                "outline_input_tokens": outline_input_tokens,
                "outline_output_tokens": outline_output_tokens,
                "outline_time_ms": total_outline_time,
                "quiz_cost": total_quiz_cost,
                "quiz_input_tokens": quiz_input_tokens,
                "quiz_output_tokens": quiz_output_tokens,
                "quiz_time_ms": total_quiz_time,
                "actual_quiz_time_ms": actual_quiz_generation_time,
                "quiz_count": total_quiz_count,
                "chapter_count": total_chapter_count,
                "completed_chapter_count": completed_chapter_count,
                "failed_chapter_count": failed_chapter_count,
                "completion_rate": (completed_chapter_count / total_chapter_count * 100) if total_chapter_count > 0 else 0,
                "cost_calculation": {
                    "model_name": record.model.name if record.model else "Unknown Model",
                    "input_price_per_1m": float(record.model.input_price_per_1m or 0) if record.model else 0.0,
                    "output_price_per_1m": float(record.model.output_price_per_1m or 0) if record.model else 0.0,
                    "input_price_display": f"${float(record.model.input_price_per_1m or 0):.1f}/1M" if record.model else "$0.0/1M",
                    "output_price_display": f"${float(record.model.output_price_per_1m or 0):.1f}/1M" if record.model else "$0.0/1M"
                },
                "last_error": last_error_message
            },
            "outlines": [
                {
                    "id": outline.id,
                    "content": outline.content,
                    "cost": float(outline.cost or 0),
                    "tokens": (outline.input_tokens or 0) + (outline.output_tokens or 0),
                    "time_ms": outline.response_time_ms or 0,
                    "created_at": outline.created_at.isoformat()
                } for outline in record.outlines
            ],
            "prompt_used": record.outlines[0].prompt_used if record.outlines else None,
            "quiz_prompt_used": None  # Will be set below
        }
        
        # Get quiz prompt from first quiz if available
        if record.outlines:
            for outline in record.outlines:
                for chapter in outline.chapters:
                    if chapter.quizzes:
                        record_data["quiz_prompt_used"] = chapter.quizzes[0].prompt_used
                        break
                if record_data["quiz_prompt_used"]:
                    break
        
        enriched_records.append(record_data)
    
    return enriched_records


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


@router.get("/{knowledge_id}/chapters", response_model=List[Dict[str, Any]])
async def get_knowledge_chapters(
    knowledge_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取知识章节列表（包含题目生成统计）"""
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
    
    # 获取章节，并加载相关的题目
    result = await session.execute(
        select(Chapter)
        .options(selectinload(Chapter.quizzes))
        .where(Chapter.outline_id == outline.id)
        .order_by(Chapter.chapter_number)
    )
    chapters = result.scalars().all()
    
    # 为每个章节计算统计信息
    enriched_chapters = []
    for chapter in chapters:
        # 计算题目统计
        quiz_count = len(chapter.quizzes)
        total_cost = sum(float(quiz.cost or 0) for quiz in chapter.quizzes)
        total_time_ms = 0
        
        # 获取第一个题目的响应时间作为章节生成时间
        if chapter.quizzes:
            # 所有题目应该是同时生成的，取第一个题目的响应时间
            total_time_ms = chapter.quizzes[0].response_time_ms or 0
        
        chapter_data = {
            "id": chapter.id,
            "outline_id": chapter.outline_id,
            "chapter_number": chapter.chapter_number,
            "title": chapter.title,
            "content": chapter.content,
            "quiz_generation_status": chapter.quiz_generation_status,
            "created_at": chapter.created_at.isoformat(),
            "quiz_generation_time_ms": total_time_ms,
            "quiz_cost": total_cost,
            "quiz_count": quiz_count,
            "last_error": None  # 可以从章节记录中获取错误信息
        }
        
        enriched_chapters.append(chapter_data)
    
    return enriched_chapters


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