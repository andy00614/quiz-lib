from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any
import json
import asyncio
import time
import structlog

logger = structlog.get_logger()

from app.db.connection import get_session, async_session
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
            input_price_per_1m=float(model.input_price_per_1m or 0),
            output_price_per_1m=float(model.output_price_per_1m or 0)
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


async def generate_chapter_quiz(
    chapter_id: int,
    model: Model, 
    knowledge: KnowledgeRecord,
    default_prompt: str,
    knowledge_id: int,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """为单个章节生成题目（并行处理用）"""
    # 为每个并行任务创建独立的数据库session
    async with async_session() as session:
        try:
            # 重新获取章节对象（避免跨session问题）
            chapter_result = await session.execute(
                select(Chapter).where(Chapter.id == chapter_id)
            )
            chapter = chapter_result.scalar_one_or_none()
            
            if not chapter:
                return {
                    "chapter_id": chapter_id,
                    "chapter_title": "Unknown",
                    "status": "failed",
                    "error": "Chapter not found"
                }
            
            # 更新章节状态
            chapter.quiz_generation_status = "generating"
            await session.commit()
            
            # 准备prompt
            final_prompt = default_prompt.replace("{{chapter_title}}", chapter.title)
            final_prompt = final_prompt.replace("{{chapter_content}}", chapter.content or "")
            final_prompt = final_prompt.replace("{{question_count}}", "10")  # 默认10题
            
            # 调用LLM生成题目
            logger.info(f"Generating quiz for chapter {chapter.id}: {chapter.title}")
            llm_response = await llm_service.generate(
                prompt=final_prompt,
                model=model.name,
                temperature=float(knowledge.temperature),
                max_tokens=knowledge.max_tokens,
                top_p=float(knowledge.top_p)
            )
            logger.info(f"LLM response for chapter {chapter.id}: success={llm_response.get('success')}")
            
            if llm_response.get("success"):
                # 解析LLM响应
                content = llm_response.get("content", "")
                parsed_content = llm_service.parse_json_response(content)
                
                if parsed_content and "quizzes" in parsed_content:
                    # 计算成本
                    usage = llm_response.get("usage", {})
                    input_tokens = usage.get("prompt_tokens", 0)
                    output_tokens = usage.get("completion_tokens", 0)
                    cost = llm_service.calculate_cost(
                        input_tokens=input_tokens,
                        output_tokens=output_tokens,
                        input_price_per_1m=float(model.input_price_per_1m or 0),
                        output_price_per_1m=float(model.output_price_per_1m or 0)
                    )
                    
                    # 创建题目记录
                    quiz_count = 0
                    quiz_data_list = parsed_content.get("quizzes", [])
                    
                    for quiz_data in quiz_data_list:
                        quiz = Quiz(
                            chapter_id=chapter.id,
                            question_number=quiz_data.get("question_number", quiz_count + 1),
                            question=quiz_data.get("question", ""),
                            options=quiz_data.get("options", {}),
                            correct_answer=quiz_data.get("correct_answer", "A"),
                            explanation=quiz_data.get("explanation", ""),
                            model_id=model.id,
                            prompt_used=final_prompt,
                            input_tokens=input_tokens // len(quiz_data_list) if quiz_data_list else 0,
                            output_tokens=output_tokens // len(quiz_data_list) if quiz_data_list else 0,
                            response_time_ms=llm_response.get("response_time_ms", 0),
                            cost=cost / len(quiz_data_list) if quiz_data_list else 0
                        )
                        session.add(quiz)
                        quiz_count += 1
                    
                    # 更新章节状态
                    chapter.quiz_generation_status = "completed"
                    
                    # 在当前session中直接记录API请求日志
                    log_entry = APIRequestLog(
                        knowledge_id=knowledge_id,
                        model_id=model.id,
                        request_type="batch_quiz_generation",
                        prompt=final_prompt,
                        request_params={
                            "temperature": float(knowledge.temperature),
                            "max_tokens": knowledge.max_tokens,
                            "top_p": float(knowledge.top_p),
                            "question_count": 10
                        },
                        response=content,
                        status="success",
                        error_message=None,
                        input_tokens=input_tokens,
                        output_tokens=output_tokens,
                        response_time_ms=llm_response.get("response_time_ms", 0),
                        cost=cost
                    )
                    session.add(log_entry)
                    await session.commit()
                    
                    return {
                        "chapter_id": chapter.id,
                        "chapter_title": chapter.title,
                        "status": "success",
                        "quiz_count": quiz_count,
                        "cost": cost,
                        "input_tokens": input_tokens,
                        "output_tokens": output_tokens,
                        "response_time_ms": llm_response.get("response_time_ms", 0)
                    }
                else:
                    # 解析失败
                    logger.error(f"Failed to parse quiz response for chapter {chapter.id}. Content: {content[:200]}...")
                    chapter.quiz_generation_status = "failed"
                    await session.commit()
                    return {
                        "chapter_id": chapter.id,
                        "chapter_title": chapter.title,
                        "status": "failed",
                        "error": f"Failed to parse quiz response. Raw content: {content[:100]}..."
                    }
            else:
                # LLM调用失败
                error_msg = llm_response.get("error", "Unknown error")
                logger.error(f"LLM generation failed for chapter {chapter.id}: {error_msg}")
                chapter.quiz_generation_status = "failed"
                await session.commit()
                return {
                    "chapter_id": chapter.id,
                    "chapter_title": chapter.title,
                    "status": "failed",
                    "error": error_msg
                }
                
        except Exception as e:
            # 处理异常
            try:
                # 重新获取章节对象以更新状态
                chapter_result = await session.execute(
                    select(Chapter).where(Chapter.id == chapter_id)
                )
                chapter = chapter_result.scalar_one_or_none()
                if chapter:
                    chapter.quiz_generation_status = "failed"
                    await session.commit()
            except:
                pass  # 如果状态更新失败，忽略
                
            return {
                "chapter_id": chapter_id,
                "chapter_title": "Unknown",
                "status": "failed",
                "error": str(e)
            }


@router.post("/quiz/batch", response_model=Dict[str, Any])
async def generate_batch_quiz(
    knowledge_id: int,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """为知识记录的所有章节批量生成题目"""
    # 获取知识记录和相关的大纲信息
    knowledge_result = await session.execute(
        select(KnowledgeRecord).where(KnowledgeRecord.id == knowledge_id)
    )
    knowledge = knowledge_result.scalar_one_or_none()
    
    if not knowledge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge record not found"
        )
    
    # 获取该知识记录的大纲
    outline_result = await session.execute(
        select(Outline).where(Outline.knowledge_id == knowledge_id)
    )
    outline = outline_result.scalar_one_or_none()
    
    if not outline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Outline not found for this knowledge record"
        )
    
    # 获取所有章节
    chapters_result = await session.execute(
        select(Chapter).where(Chapter.outline_id == outline.id)
    )
    chapters = chapters_result.scalars().all()
    
    if not chapters:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No chapters found for this outline"
        )
    
    # 获取模型信息
    model_result = await session.execute(
        select(Model).where(Model.id == knowledge.model_id)
    )
    model = model_result.scalar_one_or_none()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # 获取默认题目prompt模板
    template_result = await session.execute(
        select(PromptTemplate).where(
            PromptTemplate.type == "quiz",
            PromptTemplate.is_default == True
        )
    )
    template = template_result.scalar_one_or_none()
    default_prompt = template.content if template else "请根据章节内容生成选择题。"
    
    # 记录开始时间
    start_time = time.time()
    
    # 检查是否是Gemini模型，需要特殊处理
    is_gemini_model = 'gemini' in model.name.lower()
    
    if is_gemini_model:
        # Gemini模型：顺序执行避免配额限制，并调整max_tokens
        logger.info(f"Using sequential execution for Gemini model: {model.name}")
        chapter_results = []
        
        # 为Gemini调整知识记录的max_tokens
        original_max_tokens = knowledge.max_tokens
        if knowledge.max_tokens < 4000:
            knowledge.max_tokens = 6000
            logger.info(f"Adjusted max_tokens from {original_max_tokens} to {knowledge.max_tokens} for Gemini")
        
        for chapter in chapters:
            try:
                # 顺序执行每个章节
                result = await generate_chapter_quiz(
                    chapter_id=chapter.id,
                    model=model,
                    knowledge=knowledge,
                    default_prompt=default_prompt,
                    knowledge_id=knowledge_id,
                    background_tasks=background_tasks
                )
                chapter_results.append(result)
                
                # 在Gemini请求之间添加短暂延迟，避免速率限制
                await asyncio.sleep(0.5)
                
            except Exception as e:
                chapter_results.append(e)
        
        # 恢复原始max_tokens设置
        knowledge.max_tokens = original_max_tokens
        
    else:
        # 其他模型：并行执行
        logger.info(f"Using parallel execution for model: {model.name}")
        tasks = [
            generate_chapter_quiz(
                chapter_id=chapter.id,
                model=model,
                knowledge=knowledge,
                default_prompt=default_prompt,
                knowledge_id=knowledge_id,
                background_tasks=background_tasks
            )
            for chapter in chapters
        ]
        
        # 并行执行所有任务
        chapter_results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # 记录结束时间并计算实际耗时
    end_time = time.time()
    actual_total_time_ms = int((end_time - start_time) * 1000)
    
    # 整理结果
    batch_results = {
        "total_chapters": len(chapters),
        "success_count": 0,
        "failed_count": 0,
        "chapter_results": [],
        "total_cost": 0.0,
        "total_input_tokens": 0,
        "total_output_tokens": 0,
        "total_time_ms": actual_total_time_ms,  # 使用实际并行执行时间
        "max_single_time_ms": 0  # 单个任务的最长时间
    }
    
    for result in chapter_results:
        if isinstance(result, Exception):
            # 处理异常情况
            batch_results["failed_count"] += 1
            batch_results["chapter_results"].append({
                "status": "failed",
                "error": str(result)
            })
        elif result["status"] == "success":
            batch_results["success_count"] += 1
            batch_results["total_cost"] += result["cost"]
            batch_results["total_input_tokens"] += result["input_tokens"]
            batch_results["total_output_tokens"] += result["output_tokens"]
            # 记录最长的单个任务时间
            batch_results["max_single_time_ms"] = max(
                batch_results["max_single_time_ms"], 
                result["response_time_ms"]
            )
            batch_results["chapter_results"].append(result)
        else:
            batch_results["failed_count"] += 1
            batch_results["chapter_results"].append(result)
    
    
    return batch_results


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
            input_price_per_1m=float(model.input_price_per_1m or 0),
            output_price_per_1m=float(model.output_price_per_1m or 0)
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