'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Chapter {
  id: number;
  chapterNumber: number;
  title: string;
  content: string;
  quizGenerationStatus: 'pending' | 'generating' | 'completed' | 'failed';
}

interface Quiz {
  id: number;
  questionNumber: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  explanation: string;
  model: string;
  responseTimeMs: number;
  cost: number;
}

interface Knowledge {
  id: number;
  title: string;
  model: string;
  outlinePrompt: string;
  outline: {
    chapters: Chapter[];
  };
}

export default function KnowledgeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterQuizzes, setChapterQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);

  useEffect(() => {
    // TODO: 从后端获取知识详情
    const mockKnowledge: Knowledge = {
      id: parseInt(params.id),
      title: '操作系统核心概念',
      model: 'GPT-4o',
      outlinePrompt: '请生成关于操作系统的详细大纲...',
      outline: {
        chapters: [
          { id: 1, chapterNumber: 1, title: '操作系统概述', content: '...', quizGenerationStatus: 'completed' },
          { id: 2, chapterNumber: 2, title: '进程管理', content: '...', quizGenerationStatus: 'completed' },
          { id: 3, chapterNumber: 3, title: '内存管理', content: '...', quizGenerationStatus: 'generating' },
          { id: 4, chapterNumber: 4, title: '文件系统', content: '...', quizGenerationStatus: 'pending' },
        ]
      }
    };
    setKnowledge(mockKnowledge);
  }, [params.id]);

  const handleChapterClick = async (chapter: Chapter) => {
    if (chapter.quizGenerationStatus !== 'completed') return;

    setSelectedChapter(chapter);
    setIsLoadingQuizzes(true);

    try {
      // TODO: 从后端获取章节题目
      const mockQuizzes: Quiz[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        questionNumber: i + 1,
        question: `关于${chapter.title}的问题 ${i + 1}`,
        options: {
          A: '选项 A',
          B: '选项 B',
          C: '选项 C',
          D: '选项 D',
        },
        correctAnswer: 'A',
        explanation: '这是答案解析',
        model: 'GPT-4o',
        responseTimeMs: 1234,
        cost: 0.0012,
      }));
      
      setTimeout(() => {
        setChapterQuizzes(mockQuizzes);
        setIsLoadingQuizzes(false);
      }, 1000);
    } catch (error) {
      console.error('加载题目失败:', error);
      setIsLoadingQuizzes(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">已完成</Badge>;
      case 'generating':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          生成中
        </Badge>;
      case 'pending':
        return <Badge variant="outline">待生成</Badge>;
      case 'failed':
        return <Badge variant="destructive">失败</Badge>;
      default:
        return null;
    }
  };

  if (!knowledge) {
    return <div className="container mx-auto p-6">加载中...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/knowledge')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{knowledge.title}</CardTitle>
          <div className="text-sm text-muted-foreground mt-2">
            <span>模型: {knowledge.model}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">生成大纲的 Prompt:</h3>
            <p className="text-sm bg-muted p-3 rounded">{knowledge.outlinePrompt}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>章节列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {knowledge.outline.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`p-4 border rounded-lg transition-colors ${
                  chapter.quizGenerationStatus === 'completed'
                    ? 'cursor-pointer hover:bg-muted'
                    : 'opacity-60'
                }`}
                onClick={() => handleChapterClick(chapter)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      第{chapter.chapterNumber}章: {chapter.title}
                    </h3>
                  </div>
                  {getStatusBadge(chapter.quizGenerationStatus)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedChapter} onOpenChange={() => setSelectedChapter(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedChapter?.title} - 题目列表
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingQuizzes ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {chapterQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        {quiz.questionNumber}. {quiz.question}
                      </h4>
                      <div className="space-y-2 ml-4">
                        {Object.entries(quiz.options).map(([key, value]) => (
                          <div key={key} className={`${key === quiz.correctAnswer ? 'font-semibold text-green-600' : ''}`}>
                            {key}. {value}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-semibold">答案:</span> {quiz.correctAnswer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">解析:</span> {quiz.explanation}
                      </p>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-3 border-t">
                      <span>模型: {quiz.model}</span>
                      <span>耗时: {quiz.responseTimeMs}ms</span>
                      <span>费用: ${quiz.cost.toFixed(4)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}