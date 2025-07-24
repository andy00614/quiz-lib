from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from core.database import Base, TimestampMixin


class Quiz(Base, TimestampMixin):
    """题库表"""
    __tablename__ = "quizzes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    result_id = Column(UUID(as_uuid=True), ForeignKey("generation_results.id"), nullable=False)
    
    # 题库信息
    title = Column(String(500), nullable=False)
    description = Column(Text)
    category = Column(String(200))
    tags = Column(JSON)  # 标签列表
    
    # 统计信息
    total_questions = Column(Integer, default=0)
    difficulty_distribution = Column(JSON)  # {"easy": 10, "medium": 15, "hard": 5}
    
    # 状态
    is_published = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # 关系
    result = relationship("GenerationResult", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base, TimestampMixin):
    """题目表"""
    __tablename__ = "questions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    block_id = Column(UUID(as_uuid=True), ForeignKey("result_blocks.id"))  # 关联的内容块
    
    # 题目信息
    question_type = Column(String(50), nullable=False)  # single_choice, multiple_choice, true_false, essay
    question_text = Column(Text, nullable=False)
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    points = Column(Integer, default=1)
    order_index = Column(Integer)
    
    # 答案信息（对于简答题）
    correct_answer = Column(Text)  # 用于判断题和简答题
    answer_explanation = Column(Text)
    
    # 元数据
    metadata = Column(JSON)  # 存储额外信息，如知识点标签等
    
    # 关系
    quiz = relationship("Quiz", back_populates="questions")
    block = relationship("ResultBlock", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")


class QuestionOption(Base, TimestampMixin):
    """选择题选项表"""
    __tablename__ = "question_options"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)
    
    # 选项信息
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer)
    explanation = Column(Text)  # 选项解释
    
    # 关系
    question = relationship("Question", back_populates="options")