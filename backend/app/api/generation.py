from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any
import json

from app.db.connection import get_session
from app.db.models import (
    KnowledgeRecord, Outline, Chapter, Quiz, Model, PromptTemplate, APIRequestLog
)
from app.schemas.models import (
    GenerateOutlineRequest,
    GenerateQuizRequest,
    OutlineResponse,
    QuizResponse,
    APIRequestLogCreate
)
from app.services.llm_service import llm_service

router = APIRouter(prefix="/generation", tags=["generation"])


async def log_api_request(
    session: AsyncSession,
    knowledge_id: int,
    model_id: int,
    request_type: str,
    prompt: str,
    request_params: Dict[str, Any],
    response: str = None,
    status: str = "success",
    error_message: str = None,
    input_tokens: int = 0,
    output_tokens: int = 0,
    response_time_ms: int = 0,
    cost: float = 0.0
):
    """记录API请求日志"""
    log_entry = APIRequestLog(
        knowledge_id=knowledge_id,
        model_id=model_id,
        request_type=request_type,
        prompt=prompt,
        request_params=request_params,
        response=response,
        status=status,
        error_message=error_message,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        response_time_ms=response_time_ms,
        cost=cost
    )
    session.add(log_entry)
    await session.commit()


@router.post("/outline", response_model=OutlineResponse)
async def generate_outline(
    request: GenerateOutlineRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """生成大纲"""
    # 获取模型信息
    model_result = await session.execute(
        select(Model).where(Model.id == request.model_id)
    )
    model = model_result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # 创建知识记录
    knowledge = KnowledgeRecord(
        title=request.title,
        model_id=request.model_id,
        temperature=request.temperature,
        max_tokens=request.max_tokens,
        top_p=request.top_p,
        status="generating"
    )
    session.add(knowledge)
    await session.commit()
    await session.refresh(knowledge)
    
    # 获取默认大纲prompt模板
    prompt_content = request.outline_prompt
    if not prompt_content:
        template_result = await session.execute(
            select(PromptTemplate).where(
                PromptTemplate.type == "outline",
                PromptTemplate.is_default == True
            )
        )
        template = template_result.scalar_one_or_none()
        if template:
            prompt_content = template.content
        else:
            prompt_content = f"请为主题'{request.title}'生成一个详细的学习大纲。"
    
    # 替换prompt中的变量
    final_prompt = prompt_content.replace("{{topic}}", request.title)
    
    # 调用LLM生成大纲
    try:
        llm_response = await llm_service.generate(
            prompt=final_prompt,
            model=model.name,
            temperature=float(request.temperature),
            max_tokens=request.max_tokens,
            top_p=float(request.top_p)
        )
        
        if not llm_response.get("success"):
            # 更新知识记录状态为失败
            knowledge.status = "failed"
            await session.commit()
            
            # 记录失败的API请求
            background_tasks.add_task(
                log_api_request,
                session=session,
                knowledge_id=knowledge.id,
                model_id=model.id,
                request_type="outline_generation",
                prompt=final_prompt,
                request_params={
                    "temperature": float(request.temperature),
                    "max_tokens": request.max_tokens,
                    "top_p": float(request.top_p)
                },
                status="failed",
                error_message=llm_response.get("error"),
                response_time_ms=llm_response.get("response_time_ms", 0)
            )
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate outline: {llm_response.get('error')}"
            )
        
        # 解析LLM响应
        content = llm_response.get("content", "")
        parsed_content = llm_service.parse_json_response(content)
        
        if not parsed_content or "chapters" not in parsed_content:
            # 如果无法解析JSON，创建一个简单的结构
            parsed_content = {
                "chapters": [
                    {
                        "chapter_number": 1,
                        "title": "概述",
                        "content": content[:500] + "..." if len(content) > 500 else content
                    }
                ]
            }
        
        # 计算成本
        usage = llm_response.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        cost = llm_service.calculate_cost(
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            input_price_per_1k=float(model.input_price_per_1k or 0),
            output_price_per_1k=float(model.output_price_per_1k or 0)
        )
        
        # 创建大纲记录
        outline = Outline(
            knowledge_id=knowledge.id,
            content=parsed_content,
            raw_response=content,
            model_id=model.id,
            prompt_used=final_prompt,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            response_time_ms=llm_response.get("response_time_ms", 0),
            cost=cost
        )
        session.add(outline)
        await session.commit()
        await session.refresh(outline)
        
        # 创建章节记录
        chapters = parsed_content.get("chapters", [])
        for chapter_data in chapters:
            chapter = Chapter(
                outline_id=outline.id,
                chapter_number=chapter_data.get("chapter_number", 1),
                title=chapter_data.get("title", "未命名章节"),
                content=chapter_data.get("content", ""),
                quiz_generation_status="pending"
            )
            session.add(chapter)
        
        # 更新知识记录状态
        knowledge.status = "completed"
        await session.commit()
        
        # 记录成功的API请求
        background_tasks.add_task(
            log_api_request,
            session=session,
            knowledge_id=knowledge.id,
            model_id=model.id,
            request_type="outline_generation",
            prompt=final_prompt,
            request_params={
                "temperature": float(request.temperature),
                "max_tokens": request.max_tokens,
                "top_p": float(request.top_p)
            },
            response=content,
            status="success",
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            response_time_ms=llm_response.get("response_time_ms", 0),
            cost=cost
        )
        
        return outline
        
    except Exception as e:
        # 更新知识记录状态为失败
        knowledge.status = "failed"
        await session.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate outline: {str(e)}"
        )


@router.post("/quiz", response_model=list[QuizResponse])
async def generate_quiz(
    request: GenerateQuizRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """生成题目"""
    # 获取章节信息
    chapter_result = await session.execute(
        select(Chapter).where(Chapter.id == request.chapter_id)
    )
    chapter = chapter_result.scalar_one_or_none()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # 获取模型信息
    model_result = await session.execute(
        select(Model).where(Model.id == request.model_id)
    )
    model = model_result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # 获取知识记录ID
    outline_result = await session.execute(
        select(Outline).where(Outline.id == chapter.outline_id)
    )
    outline = outline_result.scalar_one_or_none()
    knowledge_id = outline.knowledge_id if outline else None
    
    # 更新章节状态
    chapter.quiz_generation_status = "generating"
    await session.commit()
    
    # 获取默认题目prompt模板
    prompt_content = request.quiz_prompt
    if not prompt_content:
        template_result = await session.execute(
            select(PromptTemplate).where(
                PromptTemplate.type == "quiz",
                PromptTemplate.is_default == True
            )
        )
        template = template_result.scalar_one_or_none()
        if template:
            prompt_content = template.content
        else:
            prompt_content = f"请根据章节'{chapter.title}'生成{request.question_count}道选择题。"
    
    # 替换prompt中的变量
    final_prompt = prompt_content.replace("{{chapter_title}}", chapter.title)
    final_prompt = final_prompt.replace("{{chapter_content}}", chapter.content or "")
    final_prompt = final_prompt.replace("{{question_count}}", str(request.question_count))
    
    # 调用LLM生成题目
    try:
        llm_response = await llm_service.generate(
            prompt=final_prompt,
            model=model.name,
            temperature=float(request.temperature),
            max_tokens=request.max_tokens,
            top_p=float(request.top_p)
        )
        
        if not llm_response.get("success"):
            # 更新章节状态为失败
            chapter.quiz_generation_status = "failed"
            await session.commit()
            
            # 记录失败的API请求
            if knowledge_id:
                background_tasks.add_task(
                    log_api_request,
                    session=session,
                    knowledge_id=knowledge_id,
                    model_id=model.id,
                    request_type="quiz_generation",
                    prompt=final_prompt,
                    request_params={
                        "temperature": float(request.temperature),
                        "max_tokens": request.max_tokens,
                        "top_p": float(request.top_p),
                        "question_count": request.question_count
                    },
                    status="failed",
                    error_message=llm_response.get("error"),
                    response_time_ms=llm_response.get("response_time_ms", 0)
                )
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate quiz: {llm_response.get('error')}"
            )
        
        # 解析LLM响应
        content = llm_response.get("content", "")
        parsed_content = llm_service.parse_json_response(content)
        
        if not parsed_content or "quizzes" not in parsed_content:
            # 更新章节状态为失败
            chapter.quiz_generation_status = "failed"
            await session.commit()
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to parse quiz response"
            )
        
        # 计算成本
        usage = llm_response.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        cost = llm_service.calculate_cost(
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            input_price_per_1k=float(model.input_price_per_1k or 0),
            output_price_per_1k=float(model.output_price_per_1k or 0)
        )
        
        # 创建题目记录
        quizzes = []
        quiz_data_list = parsed_content.get("quizzes", [])
        
        for quiz_data in quiz_data_list:
            quiz = Quiz(
                chapter_id=chapter.id,
                question_number=quiz_data.get("question_number", 1),
                question=quiz_data.get("question", ""),
                options=quiz_data.get("options", {}),
                correct_answer=quiz_data.get("correct_answer", "A"),
                explanation=quiz_data.get("explanation", ""),
                model_id=model.id,
                prompt_used=final_prompt,
                input_tokens=input_tokens // len(quiz_data_list),  # 平均分配
                output_tokens=output_tokens // len(quiz_data_list),
                response_time_ms=llm_response.get("response_time_ms", 0),
                cost=cost / len(quiz_data_list)  # 平均分配成本
            )
            session.add(quiz)
            quizzes.append(quiz)
        
        # 更新章节状态
        chapter.quiz_generation_status = "completed"
        await session.commit()
        
        # 刷新所有题目对象
        for quiz in quizzes:
            await session.refresh(quiz)
        
        # 记录成功的API请求
        if knowledge_id:
            background_tasks.add_task(
                log_api_request,
                session=session,
                knowledge_id=knowledge_id,
                model_id=model.id,
                request_type="quiz_generation",
                prompt=final_prompt,
                request_params={
                    "temperature": float(request.temperature),
                    "max_tokens": request.max_tokens,
                    "top_p": float(request.top_p),
                    "question_count": request.question_count
                },
                response=content,
                status="success",
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                response_time_ms=llm_response.get("response_time_ms", 0),
                cost=cost
            )
        
        return quizzes
        
    except Exception as e:
        # 更新章节状态为失败
        chapter.quiz_generation_status = "failed"
        await session.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )