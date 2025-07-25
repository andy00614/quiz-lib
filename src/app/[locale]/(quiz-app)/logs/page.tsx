'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, DollarSign, Hash, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react';

interface RequestLog {
  id: number;
  timestamp: string;
  knowledgeId: number;
  knowledgeTitle: string;
  requestType: 'outline_generation' | 'quiz_generation';
  model: string;
  status: 'success' | 'failed' | 'timeout';
  responseTimeMs: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  prompt: string;
  response?: string;
  errorMessage?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RequestLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    // TODO: 从后端获取日志数据
    const mockLogs: RequestLog[] = [
      {
        id: 1,
        timestamp: '2024-01-15 10:30:45',
        knowledgeId: 1,
        knowledgeTitle: '操作系统核心概念',
        requestType: 'outline_generation',
        model: 'GPT-4o',
        status: 'success',
        responseTimeMs: 2341,
        inputTokens: 234,
        outputTokens: 1456,
        cost: 0.0234,
        prompt: '请生成关于操作系统的详细大纲...',
        response: '{"chapters": [...]}',
      },
      {
        id: 2,
        timestamp: '2024-01-15 10:35:12',
        knowledgeId: 1,
        knowledgeTitle: '操作系统核心概念',
        requestType: 'quiz_generation',
        model: 'GPT-4o',
        status: 'success',
        responseTimeMs: 3456,
        inputTokens: 456,
        outputTokens: 2345,
        cost: 0.0456,
        prompt: '请根据以下章节内容生成10道选择题...',
        response: '{"quizzes": [...]}',
      },
      {
        id: 3,
        timestamp: '2024-01-15 11:20:33',
        knowledgeId: 2,
        knowledgeTitle: 'Python 基础编程',
        requestType: 'outline_generation',
        model: 'Claude 3 Opus',
        status: 'failed',
        responseTimeMs: 5234,
        inputTokens: 345,
        outputTokens: 0,
        cost: 0.0123,
        prompt: '请生成关于Python基础的大纲...',
        errorMessage: 'API rate limit exceeded',
      },
      {
        id: 4,
        timestamp: '2024-01-15 11:45:22',
        knowledgeId: 3,
        knowledgeTitle: '数据结构与算法',
        requestType: 'quiz_generation',
        model: 'GPT-3.5-turbo',
        status: 'timeout',
        responseTimeMs: 30000,
        inputTokens: 234,
        outputTokens: 0,
        cost: 0.0023,
        prompt: '请生成数据结构相关题目...',
        errorMessage: 'Request timeout after 30s',
      },
    ];
    
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    
    const uniqueModels = Array.from(new Set(mockLogs.map(log => log.model)));
    setModels(uniqueModels);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (filterModel !== 'all') {
      filtered = filtered.filter(log => log.model === filterModel);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.requestType === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.knowledgeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filterModel, filterStatus, filterType, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            成功
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            失败
          </Badge>
        );
      case 'timeout':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            超时
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRequestTypeName = (type: string) => {
    return type === 'outline_generation' ? '大纲生成' : '题目生成';
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">请求日志</h1>
        <p className="text-muted-foreground mt-2">
          查看所有 AI API 请求的详细记录
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>搜索</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索知识或 Prompt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>模型</Label>
              <Select value={filterModel} onValueChange={setFilterModel}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有模型</SelectItem>
                  {models.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="failed">失败</SelectItem>
                  <SelectItem value="timeout">超时</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类型</SelectItem>
                  <SelectItem value="outline_generation">大纲生成</SelectItem>
                  <SelectItem value="quiz_generation">题目生成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>知识</TableHead>
                <TableHead>任务类型</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>耗时</TableHead>
                <TableHead>Token 数</TableHead>
                <TableHead>成本</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.knowledgeTitle}
                  </TableCell>
                  <TableCell>
                    {getRequestTypeName(log.requestType)}
                  </TableCell>
                  <TableCell>{log.model}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>{log.responseTimeMs}ms</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>输入: {log.inputTokens}</div>
                      <div>输出: {log.outputTokens}</div>
                    </div>
                  </TableCell>
                  <TableCell>${log.cost.toFixed(4)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>请求详情</DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">请求时间</Label>
                  <p className="font-mono">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">知识标题</Label>
                  <p>{selectedLog.knowledgeTitle}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">任务类型</Label>
                  <p>{getRequestTypeName(selectedLog.requestType)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">模型</Label>
                  <p>{selectedLog.model}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">状态</Label>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">响应时间</Label>
                  <p>{selectedLog.responseTimeMs}ms</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Prompt</Label>
                <pre className="mt-2 p-3 bg-muted rounded-lg text-sm overflow-x-auto">
                  {selectedLog.prompt}
                </pre>
              </div>

              {selectedLog.response && (
                <div>
                  <Label className="text-muted-foreground">响应</Label>
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-sm overflow-x-auto">
                    {selectedLog.response}
                  </pre>
                </div>
              )}

              {selectedLog.errorMessage && (
                <div>
                  <Label className="text-muted-foreground">错误信息</Label>
                  <div className="mt-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    输入: {selectedLog.inputTokens} tokens
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    输出: {selectedLog.outputTokens} tokens
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  {selectedLog.cost.toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}