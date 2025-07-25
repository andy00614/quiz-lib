'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, DollarSign, AlertCircle, Zap } from 'lucide-react';

interface ModelStats {
  modelId: number;
  modelName: string;
  taskType: 'outline' | 'quiz';
  avgResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
  avgCost: number;
  totalRequests: number;
  successRate: number;
}

interface TimeSeriesData {
  date: string;
  responseTime: number;
  errorCount: number;
  successCount: number;
  cost: number;
}

export default function StatisticsPage() {
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [modelStats, setModelStats] = useState<ModelStats[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // TODO: 从后端获取统计数据
    const mockModels = [
      { id: 1, name: 'GPT-4o' },
      { id: 2, name: 'GPT-3.5-turbo' },
      { id: 3, name: 'Claude 3 Opus' },
    ];
    setModels(mockModels);

    const mockStats: ModelStats[] = [
      {
        modelId: 1,
        modelName: 'GPT-4o',
        taskType: 'outline',
        avgResponseTime: 2341,
        p95ResponseTime: 4523,
        errorRate: 0.02,
        avgCost: 0.0234,
        totalRequests: 1234,
        successRate: 0.98,
      },
      {
        modelId: 1,
        modelName: 'GPT-4o',
        taskType: 'quiz',
        avgResponseTime: 3456,
        p95ResponseTime: 5678,
        errorRate: 0.03,
        avgCost: 0.0456,
        totalRequests: 2345,
        successRate: 0.97,
      },
      {
        modelId: 2,
        modelName: 'GPT-3.5-turbo',
        taskType: 'outline',
        avgResponseTime: 1234,
        p95ResponseTime: 2345,
        errorRate: 0.01,
        avgCost: 0.0023,
        totalRequests: 3456,
        successRate: 0.99,
      },
      {
        modelId: 2,
        modelName: 'GPT-3.5-turbo',
        taskType: 'quiz',
        avgResponseTime: 1567,
        p95ResponseTime: 2890,
        errorRate: 0.015,
        avgCost: 0.0034,
        totalRequests: 4567,
        successRate: 0.985,
      },
    ];
    setModelStats(mockStats);

    const mockTimeSeries: TimeSeriesData[] = [
      { date: '2024-01-10', responseTime: 2100, errorCount: 2, successCount: 98, cost: 2.34 },
      { date: '2024-01-11', responseTime: 2300, errorCount: 3, successCount: 120, cost: 2.89 },
      { date: '2024-01-12', responseTime: 2050, errorCount: 1, successCount: 110, cost: 2.56 },
      { date: '2024-01-13', responseTime: 2400, errorCount: 4, successCount: 135, cost: 3.12 },
      { date: '2024-01-14', responseTime: 2200, errorCount: 2, successCount: 125, cost: 2.98 },
      { date: '2024-01-15', responseTime: 2150, errorCount: 1, successCount: 118, cost: 2.75 },
    ];
    setTimeSeriesData(mockTimeSeries);
  }, []);

  const filteredStats = modelStats.filter(stat => {
    const modelMatch = selectedModel === 'all' || stat.modelId.toString() === selectedModel;
    const typeMatch = selectedTaskType === 'all' || stat.taskType === selectedTaskType;
    return modelMatch && typeMatch;
  });

  const aggregatedStats = {
    avgResponseTime: filteredStats.reduce((sum, s) => sum + s.avgResponseTime, 0) / filteredStats.length || 0,
    avgErrorRate: filteredStats.reduce((sum, s) => sum + s.errorRate, 0) / filteredStats.length || 0,
    avgCost: filteredStats.reduce((sum, s) => sum + s.avgCost, 0) / filteredStats.length || 0,
    totalRequests: filteredStats.reduce((sum, s) => sum + s.totalRequests, 0),
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">统计数据</h1>
        <p className="text-muted-foreground mt-2">
          查看模型性能、成本和错误率等关键指标
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label>选择模型</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有模型</SelectItem>
              {models.map(model => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>任务类型</Label>
          <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
            <SelectTrigger>
              <SelectValue placeholder="选择任务类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类型</SelectItem>
              <SelectItem value="outline">大纲生成</SelectItem>
              <SelectItem value="quiz">题目生成</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均响应时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(aggregatedStats.avgResponseTime / 1000).toFixed(2)}s
            </div>
            <p className="text-xs text-muted-foreground">
              较上周 -5.2%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">错误率</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(aggregatedStats.avgErrorRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              较上周 +0.3%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均成本</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${aggregatedStats.avgCost.toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground">
              每次请求
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总请求数</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedStats.totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              本月累计
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>响应时间趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="responseTime" stroke="#8884d8" name="响应时间(ms)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>模型性能对比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="modelName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgResponseTime" fill="#8884d8" name="平均响应时间(ms)" />
                <Bar dataKey="p95ResponseTime" fill="#82ca9d" name="P95响应时间(ms)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>成本分析</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="#ff7300" name="日成本($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>成功率对比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="modelName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#00C49F" name="成功率" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}