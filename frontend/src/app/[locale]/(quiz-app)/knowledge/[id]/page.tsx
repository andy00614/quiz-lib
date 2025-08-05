'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Download, RefreshCw, Bot, Clock, Hash, DollarSign, Settings, TrendingUp, FileText, Copy, Eye, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { formatCost, formatInputOutputTokens, formatTime } from '@/lib/format';

interface Chapter {
  id: number;
  chapter_number: number;
  title: string;
  content: string;
  quiz_generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  created_at: string;
  quiz_generation_time_ms?: number;
  quiz_cost?: number;
  quiz_count?: number;
  last_error?: string;
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
  status: string;
  created_at: string;
  updated_at: string;
  model: {
    id: number;
    name: string;
    provider: string;
  };
  parameters: {
    temperature: number;
    max_tokens: number;
    top_p: number;
  };
  statistics: {
    total_cost: number;
    total_input_tokens: number;
    total_output_tokens: number;
    total_tokens: number;
    total_time_ms: number;
    outline_cost: number;
    outline_input_tokens: number;
    outline_output_tokens: number;
    outline_time_ms: number;
    quiz_cost: number;
    quiz_input_tokens: number;
    quiz_output_tokens: number;
    quiz_time_ms: number;
    actual_quiz_time_ms: number;
    quiz_count: number;
    chapter_count: number;
    completed_chapter_count: number;
    failed_chapter_count: number;
    completion_rate: number;
    cost_calculation: {
      model_name: string;
      input_price_per_1m: number;
      output_price_per_1m: number;
      input_price_display?: string;
      output_price_display?: string;
    };
    last_error?: string;
  };
  prompt_used?: string;
  quiz_prompt_used?: string;
  outlines?: any[];
}

export default function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const router = useRouter();
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterQuizzes, setChapterQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [generatingChapterId, setGeneratingChapterId] = useState<number | null>(null);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    // 从后端获取知识详情（使用列表API获取完整统计信息）
    const fetchKnowledge = async () => {
      try {
        // 获取知识列表以获取完整统计信息
        const listResponse = await apiClient.getKnowledgeRecords();
        if (listResponse.success && listResponse.data) {
          const knowledgeItem = listResponse.data.find((item: any) => item.id === parseInt(resolvedParams.id));
          if (knowledgeItem) {
            setKnowledge(knowledgeItem);
          }
        }
        
        // 获取章节
        const chaptersResponse = await apiClient.getChapters(parseInt(resolvedParams.id));
        if (chaptersResponse.success && chaptersResponse.data) {
          setChapters(chaptersResponse.data);
        }
      } catch (error) {
        console.error('获取知识详情失败:', error);
        toast.error('获取知识详情失败');
      }
    };

    fetchKnowledge();
  }, [resolvedParams?.id]);

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
      const response = await apiClient.getQuizzes(parseInt(resolvedParams!.id), chapter.id);
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
        const errorMessage = response.error || '题目生成失败';
        toast.error(errorMessage);
        // 生成失败时，恢复为待生成状态，并保存错误信息
        setChapters(chapters.map(c => 
          c.id === chapter.id 
            ? { ...c, quiz_generation_status: 'failed' as const, last_error: errorMessage }
            : c
        ));
      }
    } catch (error: any) {
      console.error('生成题目失败:', error);
      const errorMessage = error.message || '生成题目失败';
      toast.error(errorMessage);
      // 生成失败时，恢复为待生成状态，并保存错误信息
      setChapters(chapters.map(c => 
        c.id === chapter.id 
          ? { ...c, quiz_generation_status: 'failed' as const, last_error: errorMessage }
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

      {/* 基本信息卡片 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {knowledge.title}
            <Badge variant={knowledge.status === 'completed' ? 'default' : 'secondary'}>
              {knowledge.status === 'completed' ? '已完成' : knowledge.status}
            </Badge>
          </CardTitle>
          <div className="text-sm text-muted-foreground mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Bot className="w-4 h-4" />
              <span>{knowledge.model.name}</span>
              <span className="text-xs">({knowledge.model.provider})</span>
            </div>
            <span>创建时间: {new Date(knowledge.created_at).toLocaleString()}</span>
          </div>
        </CardHeader>
      </Card>

      {/* 统计信息卡片组 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 总体统计 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              总体统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">总耗时</span>
                <span className="font-medium">{formatTime(knowledge.statistics.total_time_ms)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">总成本</span>
                <span className="font-medium">{formatCost(knowledge.statistics.total_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">总题数</span>
                <span className="font-medium">{knowledge.statistics.quiz_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token统计 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Token使用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">输入/输出</span>
                <span className="font-medium">
                  {formatInputOutputTokens(
                    knowledge.statistics.total_input_tokens,
                    knowledge.statistics.total_output_tokens
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">大纲</span>
                <span className="font-medium">
                  {formatInputOutputTokens(
                    knowledge.statistics.outline_input_tokens,
                    knowledge.statistics.outline_output_tokens
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">题目</span>
                <span className="font-medium">
                  {formatInputOutputTokens(
                    knowledge.statistics.quiz_input_tokens,
                    knowledge.statistics.quiz_output_tokens
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 时间分析 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              时间分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">大纲生成</span>
                <span className="font-medium">{formatTime(knowledge.statistics.outline_time_ms)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">题目生成</span>
                <span className="font-medium">
                  {formatTime(knowledge.statistics.actual_quiz_time_ms || knowledge.statistics.quiz_time_ms)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 生成参数 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              生成参数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-medium">{knowledge.parameters.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Tokens</span>
                <span className="font-medium">{knowledge.parameters.max_tokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top P</span>
                <span className="font-medium">{knowledge.parameters.top_p}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 章节进度卡片 */}
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">章节进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              完成进度: {knowledge.statistics.completed_chapter_count}/{knowledge.statistics.chapter_count} 
              ({formatCompletionRate(knowledge.statistics.completion_rate)})
              {knowledge.statistics.failed_chapter_count > 0 && (
                <span className="text-red-500 ml-2">
                  {knowledge.statistics.failed_chapter_count} 失败
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${knowledge.statistics.completion_rate}%` }}
            />
            {knowledge.statistics.failed_chapter_count > 0 && (
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300 -mt-2"
                style={{ 
                  width: `${(knowledge.statistics.failed_chapter_count / knowledge.statistics.chapter_count) * 100}%`,
                  marginLeft: `${knowledge.statistics.completion_rate}%`
                }}
              />
            )}
          </div>
        </CardContent>
      </Card> */}

      {/* Prompt信息 - 紧凑显示 */}
      {(knowledge.prompt_used || knowledge.quiz_prompt_used) && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              使用的 Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 大纲生成 Prompt */}
            {knowledge.prompt_used && (
              <div className="border rounded-lg p-3 bg-blue-50/30 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    大纲生成
                  </div>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>大纲生成 Prompt</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto max-h-[60vh]">
                          <div className="bg-muted p-4 rounded font-mono text-sm whitespace-pre-wrap">
                            {knowledge.prompt_used}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(knowledge.prompt_used!);
                              toast.success('大纲Prompt已复制');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            复制完整内容
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(knowledge.prompt_used!);
                        toast.success('大纲Prompt已复制');
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs font-mono bg-white/60 p-2 rounded border max-h-20 overflow-y-auto">
                  {knowledge.prompt_used.length > 200 
                    ? `${knowledge.prompt_used.substring(0, 200)}...` 
                    : knowledge.prompt_used
                  }
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  点击👁️查看完整内容
                </div>
              </div>
            )}
            
            {/* 题目生成 Prompt */}
            {knowledge.quiz_prompt_used && (
              <div className="border rounded-lg p-3 bg-purple-50/30 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    题目生成
                  </div>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>题目生成 Prompt</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto max-h-[60vh]">
                          <div className="bg-muted p-4 rounded font-mono text-sm whitespace-pre-wrap">
                            {knowledge.quiz_prompt_used}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                            💡 题目生成时，<code className="bg-amber-100 px-1 rounded">{'{{chapter_title}}'}</code> 和 <code className="bg-amber-100 px-1 rounded">{'{{chapter_content}}'}</code> 变量会被替换为对应章节的实际内容
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(knowledge.quiz_prompt_used!);
                                toast.success('题目Prompt已复制');
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              复制完整内容
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(knowledge.quiz_prompt_used!);
                        toast.success('题目Prompt已复制');
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs font-mono bg-white/60 p-2 rounded border max-h-20 overflow-y-auto">
                  {knowledge.quiz_prompt_used.length > 200 
                    ? `${knowledge.quiz_prompt_used.substring(0, 200)}...` 
                    : knowledge.quiz_prompt_used
                  }
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  点击👁️查看完整内容 • 包含动态变量
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">
                      第{chapter.chapter_number}章: {chapter.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {chapter.content.length > 100 
                        ? `${chapter.content.substring(0, 100)}...` 
                        : chapter.content}
                    </p>
                    
                    {/* 题目生成统计信息 */}
                    {chapter.quiz_generation_status === 'completed' && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {chapter.quiz_count && (
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>{chapter.quiz_count}题</span>
                          </div>
                        )}
                        {chapter.quiz_generation_time_ms && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(chapter.quiz_generation_time_ms)}</span>
                          </div>
                        )}
                        {chapter.quiz_cost && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{formatCost(chapter.quiz_cost)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {chapter.quiz_generation_status === 'failed' && chapter.last_error && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        错误: {chapter.last_error}
                      </p>
                    )}
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
              {/* 章节知识内容介绍 */}
              {selectedChapter && selectedChapter.content && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      📚 知识点介绍
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedChapter.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* 分隔线 */}
              {selectedChapter && selectedChapter.content && chapterQuizzes.length > 0 && (
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm text-muted-foreground px-4">📝 练习题目</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
              )}
              
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
                    {/* <div className="text-xs text-muted-foreground">
                      响应时间: {quiz.response_time_ms}ms | 成本: ${quiz.cost}
                    </div> */}
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