'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Bot, Clock, Hash, DollarSign, AlertCircle, Info, FileText, Copy, Eye } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { formatCost, formatInputOutputTokens, formatCostDetails, formatTime, getStatusColor, getStatusText } from '@/lib/format';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KnowledgeItem {
  id: number;
  title: string;
  model: {
    id: number;
    name: string;
    provider: string;
  };
  created_at: string;
  status: string;
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

export default function KnowledgeListPage() {
  const router = useRouter();
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    // 从后端获取知识列表
    const fetchKnowledgeList = async () => {
      try {
        const response = await apiClient.getKnowledgeRecords();
        if (response.success && response.data) {
          setKnowledgeList(response.data);
        }
      } catch (error) {
        console.error('获取知识列表失败:', error);
        toast.error('获取知识列表失败');
      }
    };

    fetchKnowledgeList();
  }, []);

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status);
    const text = getStatusText(status);
    return <span className={colorClass}>{text}</span>;
  };

  console.log(knowledgeList);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">知识库</h1>
        <Button onClick={() => router.push('/knowledge/new')}>
          <Plus className="w-4 h-4 mr-2" />
          创建新知识
        </Button>
      </div>

      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeList.map((item) => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/knowledge/${item.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                  {item.title}
                  {item.statistics?.last_error && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{item.statistics.last_error}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bot className="w-4 h-4" />
                  <span>{item.model.name}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>状态:</span>
                    <span className="font-medium">{getStatusBadge(item.status)}</span>
                  </div>
                  
                  {/* 统计信息网格 */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">耗时</span>
                    </div>
                    <div className="text-xs font-medium text-right">
                      {formatTime(item.statistics?.total_time_ms || 0)}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Token</span>
                    </div>
                    <div className="text-xs font-medium text-right">
                      {formatInputOutputTokens(
                        item.statistics?.total_input_tokens || 0, 
                        item.statistics?.total_output_tokens || 0
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">成本</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <pre className="text-xs whitespace-pre-wrap">
                            {formatCostDetails(
                              item.statistics?.total_input_tokens || 0,
                              item.statistics?.total_output_tokens || 0,
                              item.statistics?.cost_calculation?.input_price_per_1m || 0,
                              item.statistics?.cost_calculation?.output_price_per_1m || 0
                            )}
                          </pre>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs font-medium text-right">
                      {formatCost(item.statistics?.total_cost || 0)}
                    </div>
                  </div>
                  
                  {/* 进度信息 */}
                  {item.statistics?.chapter_count > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">章节进度</span>
                          {item.statistics.failed_chapter_count > 0 && (
                            <span className="text-red-500">
                              ({item.statistics.failed_chapter_count}失败)
                            </span>
                          )}
                        </div>
                        <span className="font-medium">
                          {item.statistics.completed_chapter_count}/{item.statistics.chapter_count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.statistics.completion_rate}%` }}
                        />
                        {item.statistics.failed_chapter_count > 0 && (
                          <div 
                            className="bg-red-500 h-1.5 rounded-full transition-all duration-300 -mt-1.5"
                            style={{ 
                              width: `${(item.statistics.failed_chapter_count / item.statistics.chapter_count) * 100}%`,
                              marginLeft: `${item.statistics.completion_rate}%`
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Prompt信息 - 支持显示两种prompt */}
                  {(item.prompt_used || item.quiz_prompt_used) && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Prompt</span>
                          {item.prompt_used && item.quiz_prompt_used && (
                            <span className="text-xs text-muted-foreground">(2个)</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-1 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>{item.title} - 使用的Prompt</DialogTitle>
                              </DialogHeader>
                              <div className="overflow-y-auto max-h-[60vh]">
                                <Tabs defaultValue="outline">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="outline" disabled={!item.prompt_used}>
                                      大纲 Prompt {!item.prompt_used && '(无)'}
                                    </TabsTrigger>
                                    <TabsTrigger value="quiz" disabled={!item.quiz_prompt_used}>
                                      题目 Prompt {!item.quiz_prompt_used && '(无)'}
                                    </TabsTrigger>
                                  </TabsList>
                                  
                                  {item.prompt_used && (
                                    <TabsContent value="outline">
                                      <Card>
                                        <CardContent className="pt-4">
                                          <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded">
                                            {item.prompt_used}
                                          </pre>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  )}
                                  
                                  {item.quiz_prompt_used && (
                                    <TabsContent value="quiz">
                                      <Card>
                                        <CardContent className="pt-4">
                                          <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded">
                                            {item.quiz_prompt_used}
                                          </pre>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  )}
                                </Tabs>
                              </div>
                              <div className="flex justify-end gap-2">
                                {item.prompt_used && (
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.prompt_used || '');
                                      toast.success('大纲Prompt已复制');
                                    }}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    复制大纲Prompt
                                  </Button>
                                )}
                                {item.quiz_prompt_used && (
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.quiz_prompt_used || '');
                                      toast.success('题目Prompt已复制');
                                    }}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    复制题目Prompt
                                  </Button>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(item.prompt_used || item.quiz_prompt_used || '');
                              toast.success('Prompt已复制');
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded px-2 py-1 border border-blue-100/50">
                        <div className="text-xs text-gray-600 font-mono line-clamp-2">
                          {/* 优先显示大纲prompt，如果没有则显示题目prompt */}
                          {(() => {
                            const displayPrompt = item.prompt_used || item.quiz_prompt_used || '';
                            const promptType = item.prompt_used ? '大纲: ' : '题目: ';
                            return displayPrompt.length > 100 
                              ? `${promptType}${displayPrompt.substring(0, 100)}...` 
                              : `${promptType}${displayPrompt}`;
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-muted-foreground pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TooltipProvider>

      {knowledgeList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">还没有创建任何知识</p>
          <Button onClick={() => router.push('/knowledge/new')}>
            <Plus className="w-4 h-4 mr-2" />
            创建第一个知识
          </Button>
        </div>
      )}
    </div>
  );
}