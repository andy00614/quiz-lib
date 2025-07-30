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
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface RequestLog {
  id: number;
  created_at: string;
  knowledge_id?: number;
  model_id: number;
  request_type: string;
  status: string;
  response_time_ms?: number;
  input_tokens?: number;
  output_tokens?: number;
  cost?: number;
  prompt: string;
  response?: string;
  error_message?: string;
  // 需要通过其他API获取
  knowledge_title?: string;
  model_name?: string;
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
    // 从后端获取日志数据
    const fetchLogs = async () => {
      try {
        const [logsResponse, modelsResponse, knowledgeResponse] = await Promise.all([
          apiClient.getRequestLogs({ limit: 100 }),
          apiClient.getModels(),
          apiClient.getKnowledgeRecords()
        ]);

        if (logsResponse.success && logsResponse.data) {
          // 创建 model 和 knowledge 的查找映射
          const modelMap = new Map();
          if (modelsResponse.success && modelsResponse.data) {
            modelsResponse.data.forEach(model => {
              modelMap.set(model.id, model.name);
            });
          }

          const knowledgeMap = new Map();
          if (knowledgeResponse.success && knowledgeResponse.data) {
            knowledgeResponse.data.forEach(knowledge => {
              knowledgeMap.set(knowledge.id, knowledge.title);
            });
          }

          // 补充日志数据中的名称信息
          const enrichedLogs = logsResponse.data.map(log => ({
            ...log,
            model_name: modelMap.get(log.model_id) || 'Unknown Model',
            knowledge_title: log.knowledge_id ? (knowledgeMap.get(log.knowledge_id) || 'Unknown Knowledge') : 'N/A'
          }));

          setLogs(enrichedLogs);
          setFilteredLogs(enrichedLogs);
          
          const uniqueModels = Array.from(new Set(enrichedLogs.map(log => log.model_name)));
          setModels(uniqueModels);
        }
      } catch (error) {
        console.error('获取日志数据失败:', error);
        toast.error('获取日志数据失败');
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (filterModel !== 'all') {
      filtered = filtered.filter(log => log.model_name === filterModel);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.request_type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        (log.knowledge_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      default:
        return null;
    }
  };

  const getRequestTypeName = (type: string) => {
    return type === 'outline' ? '大纲生成' : '题目生成';
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
                  <SelectItem value="outline">大纲生成</SelectItem>
                  <SelectItem value="quiz">题目生成</SelectItem>
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
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.knowledge_title}
                  </TableCell>
                  <TableCell>
                    {getRequestTypeName(log.request_type)}
                  </TableCell>
                  <TableCell>{log.model_name}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>{log.response_time_ms || 0}ms</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>输入: {log.input_tokens || 0}</div>
                      <div>输出: {log.output_tokens || 0}</div>
                    </div>
                  </TableCell>
                  <TableCell>${parseFloat(log.cost || 0).toFixed(4)}</TableCell>
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
                  <p className="font-mono">{new Date(selectedLog.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">知识标题</Label>
                  <p>{selectedLog.knowledge_title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">任务类型</Label>
                  <p>{getRequestTypeName(selectedLog.request_type)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">模型</Label>
                  <p>{selectedLog.model_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">状态</Label>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">响应时间</Label>
                  <p>{selectedLog.response_time_ms || 0}ms</p>
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

              {selectedLog.error_message && (
                <div>
                  <Label className="text-muted-foreground">错误信息</Label>
                  <div className="mt-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                    {selectedLog.error_message}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    输入: {selectedLog.input_tokens || 0} tokens
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    输出: {selectedLog.output_tokens || 0} tokens
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  {parseFloat(selectedLog.cost || 0).toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}