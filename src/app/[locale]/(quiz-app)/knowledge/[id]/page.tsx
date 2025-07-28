'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Download, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface Chapter {
  id: number;
  chapter_number: number;
  title: string;
  content: string;
  quiz_generation_status: 'pending' | 'generating' | 'completed' | 'failed';
}

interface Quiz {
  id: number;
  question_number: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: string;
  explanation: string;
  response_time_ms: number;
  cost: number;
}

interface Knowledge {
  id: number;
  title: string;
  model: {
    id: number;
    name: string;
  };
  prompt_used?: string;
  outlines?: any[];
}

export default function KnowledgeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterQuizzes, setChapterQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [generatingChapterId, setGeneratingChapterId] = useState<number | null>(null);

  useEffect(() => {
    // 从后端获取知识详情
    const fetchKnowledge = async () => {
      try {
        const response = await apiClient.getKnowledgeRecord(parseInt(params.id));
        if (response.success && response.data) {
          setKnowledge(response.data);
          
          // 获取章节（直接从 knowledge API 获取）
          const chaptersResponse = await apiClient.getChapters(parseInt(params.id));
          if (chaptersResponse.success && chaptersResponse.data) {
            setChapters(chaptersResponse.data);
          }
        }
      } catch (error) {
        console.error('获取知识详情失败:', error);
        toast.error('获取知识详情失败');
      }
    };

    fetchKnowledge();
  }, [params.id]);

  const handleChapterClick = async (chapter: Chapter) => {
    if (chapter.quiz_generation_status === 'pending') {
      // 如果题目还没生成，先生成题目
      await generateQuizForChapter(chapter);
      return;
    }

    if (chapter.quiz_generation_status !== 'completed') return;

    setSelectedChapter(chapter);
    setIsLoadingQuizzes(true);

    try {
      const response = await apiClient.getQuizzes(parseInt(params.id), chapter.id);
      if (response.success && response.data) {
        setChapterQuizzes(response.data);
      } else {
        toast.error('获取题目失败');
      }
    } catch (error) {
      console.error('加载题目失败:', error);
      toast.error('加载题目失败');
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const generateQuizForChapter = async (chapter: Chapter) => {
    if (!knowledge) return;
    
    // 立即更新章节状态为生成中
    setChapters(chapters.map(c => 
      c.id === chapter.id 
        ? { ...c, quiz_generation_status: 'generating' as const }
        : c
    ));
    
    setGeneratingChapterId(chapter.id);
    try {
      const response = await apiClient.generateQuiz({
        chapter_id: chapter.id,
        model_id: knowledge.model.id,
        question_count: 10,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1.0,
      });

      if (response.success) {
        toast.success('题目生成成功！');
        // 更新章节状态为已完成
        setChapters(chapters.map(c => 
          c.id === chapter.id 
            ? { ...c, quiz_generation_status: 'completed' as const }
            : c
        ));
        // 自动打开题目列表
        handleChapterClick({ ...chapter, quiz_generation_status: 'completed' });
      } else {
        toast.error('题目生成失败');
        // 生成失败时，恢复为待生成状态
        setChapters(chapters.map(c => 
          c.id === chapter.id 
            ? { ...c, quiz_generation_status: 'failed' as const }
            : c
        ));
      }
    } catch (error) {
      console.error('生成题目失败:', error);
      toast.error('生成题目失败');
      // 生成失败时，恢复为待生成状态
      setChapters(chapters.map(c => 
        c.id === chapter.id 
          ? { ...c, quiz_generation_status: 'failed' as const }
          : c
      ));
    } finally {
      setGeneratingChapterId(null);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'markdown') => {
    if (!selectedChapter) return;
    
    try {
      const response = await apiClient.exportQuizzes(selectedChapter.id, format);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedChapter.title}-题目.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败');
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
            <span>模型: {knowledge.model.name}</span>
          </div>
        </CardHeader>
        <CardContent>
          {knowledge.prompt_used && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">生成大纲的 Prompt:</h3>
              <p className="text-sm bg-muted p-3 rounded">{knowledge.prompt_used}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>章节列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`p-4 border rounded-lg transition-colors ${
                  chapter.quiz_generation_status === 'completed'
                    ? 'cursor-pointer hover:bg-muted'
                    : chapter.quiz_generation_status === 'pending'
                    ? 'cursor-pointer hover:bg-muted'
                    : 'opacity-60'
                }`}
                onClick={() => handleChapterClick(chapter)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      第{chapter.chapter_number}章: {chapter.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {chapter.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(chapter.quiz_generation_status)}
                    {(chapter.quiz_generation_status === 'pending' || chapter.quiz_generation_status === 'failed') && generatingChapterId !== chapter.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          generateQuizForChapter(chapter);
                        }}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {chapter.quiz_generation_status === 'failed' ? '重新生成' : '生成题目'}
                      </Button>
                    )}
                  </div>
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
                        {quiz.question_number}. {quiz.question}
                      </h4>
                      <div className="space-y-2 ml-4">
                        {Object.entries(quiz.options).map(([key, value]) => (
                          <div key={key} className="flex items-start">
                            <span className="font-semibold mr-2">{key}.</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm">
                          <strong>正确答案:</strong> {quiz.correct_answer}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>解析:</strong> {quiz.explanation}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      响应时间: {quiz.response_time_ms}ms | 成本: ${quiz.cost}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {chapterQuizzes.length > 0 && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('csv')}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    导出 CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('json')}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    导出 JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('markdown')}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    导出 Markdown
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}