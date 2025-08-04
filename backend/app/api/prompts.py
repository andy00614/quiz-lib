from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
import re
import json

from app.db.connection import get_session
from app.db.models import PromptTemplate
from app.schemas.models import (
    PromptTemplateCreate,
    PromptTemplateUpdate,
    PromptTemplateResponse
)

router = APIRouter(prefix="/prompts", tags=["prompts"])


def extract_variables_from_template(content: str) -> List[Dict[str, Any]]:
    """从模板内容中提取变量"""
    # 匹配 {{variable_name}} 格式的变量
    pattern = r'\{\{(\w+)\}\}'
    variables = re.findall(pattern, content)
    
    # 定义预设变量的元数据
    variable_metadata = {
        # 大纲相关变量
        'topic': {
            'displayName': '主题',
            'type': 'text',
            'required': True,
            'description': '知识内容的主题',
            'placeholder': '例如：操作系统原理'
        },
        'level': {
            'displayName': '难度等级',
            'type': 'select',
            'required': False,
            'options': ['初级', '中级', '高级'],
            'defaultValue': '中级',
            'description': '内容的难度级别'
        },
        'chapters': {
            'displayName': '章节数量',
            'type': 'number',
            'required': False,
            'defaultValue': 5,
            'min': 3,
            'max': 10,
            'description': '生成的章节数量'
        },
        'language': {
            'displayName': '语言',
            'type': 'select',
            'required': False,
            'options': ['中文', '英文'],
            'defaultValue': '中文',
            'description': '内容使用的语言'
        },
        # 题目相关变量
        'chapter_title': {
            'displayName': '章节标题',
            'type': 'text',
            'required': True,
            'description': '当前章节的标题'
        },
        'chapter_content': {
            'displayName': '章节内容',
            'type': 'text',
            'required': True,
            'description': '章节的详细内容'
        },
        'question_count': {
            'displayName': '题目数量',
            'type': 'number',
            'required': False,
            'defaultValue': 10,
            'min': 5,
            'max': 20,
            'description': '生成的题目数量'
        },
        'question_type': {
            'displayName': '题目类型',
            'type': 'select',
            'required': False,
            'options': ['单选题', '多选题', '判断题'],
            'defaultValue': '单选题',
            'description': '题目的类型'
        }
    }
    
    # 构建变量信息列表
    variable_list = []
    for var in set(variables):  # 使用set去重
        var_lower = var.lower()
        if var_lower in variable_metadata:
            variable_info = {
                'name': f'{{{{{var}}}}}',
                'originalName': var,
                **variable_metadata[var_lower]
            }
        else:
            # 未知变量，使用默认配置
            variable_info = {
                'name': f'{{{{{var}}}}}',
                'originalName': var,
                'displayName': var,
                'type': 'text',
                'required': False,
                'description': f'自定义变量: {var}'
            }
        variable_list.append(variable_info)
    
    return variable_list


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
    
    # 自动解析模板中的变量
    template_dict = template_data.model_dump()
    if 'variables' not in template_dict or not template_dict['variables']:
        variables = extract_variables_from_template(template_dict['content'])
        template_dict['variables'] = variables
    
    # 创建新模板
    template = PromptTemplate(**template_dict)
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
    
    # 处理模板更新
    update_data = template_data.model_dump(exclude_unset=True)
    
    # 检查是否变更了模板类型
    type_changed = "type" in update_data and update_data["type"] != template.type
    old_type = template.type
    new_type = update_data.get("type", template.type)
    
    # 如果类型发生变更且当前是默认模板，需要先取消默认状态
    if type_changed and template.is_default:
        # 取消当前模板的默认状态，因为它要改变类型了
        template.is_default = False
        update_data["is_default"] = False
    
    # 如果要设置为默认模板，需要取消同类型的其他默认模板
    if update_data.get("is_default"):
        await session.execute(
            PromptTemplate.__table__.update()
            .where(
                PromptTemplate.type == new_type,
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
    
    if template.is_default:
        # 如果当前是默认模板，取消默认
        template.is_default = False
    else:
        # 如果当前不是默认模板，设置为默认并取消同类型的其他默认模板
        await session.execute(
            PromptTemplate.__table__.update()
            .where(
                PromptTemplate.type == template.type,
                PromptTemplate.id != template_id
            )
            .values(is_default=False)
        )
        template.is_default = True
    
    await session.commit()
    await session.refresh(template)
    
    return template


@router.post("/parse-variables", response_model=List[Dict[str, Any]])
async def parse_template_variables(
    content: Dict[str, str]
):
    """解析模板内容中的变量"""
    template_content = content.get("content", "")
    if not template_content:
        return []
    
    variables = extract_variables_from_template(template_content)
    return variables