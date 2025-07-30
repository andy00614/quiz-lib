'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationControls } from '@/components/ui/pagination';
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
  const [models, setModels] = useState<{id: number, name: string}[]>([]);
  const [requestTypes, setRequestTypes] = useState<string[]>([]);
  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // 前端过滤功能（主要用于搜索）
  const filterLogsLocally = useCallback((logsToFilter: RequestLog[]) => {
    let filtered = logsToFilter;

    // 搜索过滤（前端处理）
    if (searchTerm) {
      filtered = filtered.filter(log => 
        (log.knowledge_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [searchTerm]);

  // 从后端获取日志数据
  const fetchLogs = useCallback(async (page: number = 1, limit: number = 20) => {
      try {
        const requestParams = {
          limit: limit,
          offset: (page - 1) * limit,
          model_id: filterModel !== 'all' ? parseInt(filterModel) || undefined : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          request_type: filterType !== 'all' ? filterType : undefined
        };
        
        // 调试信息
        console.log('请求日志筛选参数:', requestParams);
        
        const [logsResponse, modelsResponse, knowledgeResponse] = await Promise.all([
          apiClient.getRequestLogs(requestParams),
          apiClient.getModels(),
          apiClient.getKnowledgeRecords()
        ]);

        if (logsResponse.success && logsResponse.data) {
          console.log('日志响应数据:', {
            总数量: logsResponse.data.length,
            数据样本: logsResponse.data.slice(0, 2),
            总记录数: (logsResponse as any).total
          });
          
          // 创建 model 和 knowledge 的查找映射
          let modelMap = new Map();
          if (modelsResponse.success && modelsResponse.data) {
            modelsResponse.data.forEach(model => {
              modelMap.set(model.id, model.name);
            });
            // 只在第一次加载时设置模型列表
            if (page === 1 && models.length === 0) {
              setModels(modelsResponse.data);
            }
          }

          let knowledgeMap = new Map();
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
          // 对于搜索功能，我们仍然需要在前端进行过滤
          filterLogsLocally(enrichedLogs);
          
          // 设置总数量
          setTotalCount((logsResponse as any).total || enrichedLogs.length);
          
          // 只在第一次加载时获取请求类型和状态类型
          if (page === 1) {
            if (requestTypes.length === 0) {
              const uniqueTypes = Array.from(new Set(enrichedLogs.map(log => log.request_type).filter(Boolean)));
              setRequestTypes(uniqueTypes);
            }
            if (statusTypes.length === 0) {
              const uniqueStatuses = Array.from(new Set(enrichedLogs.map(log => log.status).filter(Boolean)));
              setStatusTypes(uniqueStatuses);
            }
          }
        }
      } catch (error) {
        console.error('获取日志数据失败:', error);
        toast.error('获取日志数据失败');
      }
    }, [filterModel, filterStatus, filterType, models.length, requestTypes.length, statusTypes.length, filterLogsLocally]);

  useEffect(() => {
    fetchLogs(1, pageSize);
  }, []);
  
  // 单独的重新获取数据函数，在筛选条件或分页变化时调用
  useEffect(() => {
    fetchLogs(currentPage, pageSize);
  }, [currentPage, pageSize, filterModel, filterStatus, filterType, fetchLogs]);
  
  // 当搜索词变化时重新过滤
  useEffect(() => {
    filterLogsLocally(logs);
  }, [logs, searchTerm, filterLogsLocally]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            成功
          </Badge>
        );
      case 'failed':
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            失败
          </Badge>
        );
      case 'pending':
      case 'processing':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            处理中
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            {status || '未知'}
          </Badge>
        );
    }
  };

  const getRequestTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      'outline': '大纲生成',
      'quiz': '题目生成',
      'batch_quiz': '批量题目生成',
      'generation': '内容生成',
      'knowledge': '知识创建',
      'model': '模型调用',
      'prompt': '提示词处理'
    };
    return typeMap[type] || type;
  };
  
  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      'success': '成功',
      'completed': '已完成',
      'failed': '失败',
      'error': '错误',
      'pending': '待处理',
      'processing': '处理中'
    };
    return statusMap[status] || status;
  };
  
  // 分页计算
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  
  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // 处理筛选变化（重置到第一页）
  const handleFilterChange = (filterSetter: (value: string) => void, value: string) => {
    filterSetter(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };
  
  // 处理搜索变化（重置到第一页）  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>模型</Label>
              <Select value={filterModel} onValueChange={(value) => handleFilterChange(setFilterModel, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有模型</SelectItem>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id.toString()}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange(setFilterStatus, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  {statusTypes.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusName(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select value={filterType} onValueChange={(value) => handleFilterChange(setFilterType, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类型</SelectItem>
                  {requestTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {getRequestTypeName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>请求记录</CardTitle>
            <div className="text-sm text-muted-foreground">
              共 {totalCount} 条记录，显示 {startIndex + 1}-{endIndex} 条
            </div>
          </div>
        </CardHeader>
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
                  <TableCell>${parseFloat(log.cost?.toString() || '0').toFixed(4)}</TableCell>
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
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">每页显示</span>
                <Select value={pageSize.toString()} onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">条</span>
              </div>
              
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
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
                  {parseFloat(selectedLog.cost?.toString() || '0').toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}