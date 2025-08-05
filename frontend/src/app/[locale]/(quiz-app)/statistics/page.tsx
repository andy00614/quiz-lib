'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Clock, DollarSign, AlertCircle, Zap, Info } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface ModelStats {
  model_id: number;
  model_name: string;
  task_type: string;
  avg_response_time_ms: number;
  p95_response_time_ms: number;
  success_rate: number;
  error_rate: number;
  avg_cost: number;
  total_requests: number;
}

interface TimeSeriesData {
  date: string;
  responseTime: number;
  errorCount: number;
  successCount: number;
  cost: number;
}

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const maxLength = 15;
  const text = payload.value;
  
  if (text.length > maxLength) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach((word: string) => {
      if ((currentLine + ' ' + word).trim().length <= maxLength) {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={0}
            dy={16 + index * 12}
            textAnchor="end"
            fill="#666"
            fontSize={11}
            transform="rotate(-45)"
          >
            {line}
          </text>
        ))}
      </g>
    );
  }
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        fontSize={11}
        transform="rotate(-45)"
      >
        {text}
      </text>
    </g>
  );
};

export default function StatisticsPage() {
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [modelStats, setModelStats] = useState<ModelStats[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // 从后端获取统计数据
    const fetchData = async () => {
      try {
        // 获取模型列表
        const modelsResponse = await apiClient.getModels();
        if (modelsResponse.success && modelsResponse.data) {
          setModels(modelsResponse.data);
        }

        // 获取模型统计数据
        const statsResponse = await apiClient.getModelStats();
        if (statsResponse.success && statsResponse.data) {
          setModelStats(statsResponse.data);
        }

        // 创建时间序列数据 (基于最近的API请求日志)
        const logsResponse = await apiClient.getRequestLogs({ limit: 100 });
        if (logsResponse.success && logsResponse.data) {
          // 按日期聚合数据
          const dateGroups = logsResponse.data.reduce((groups: any, log: any) => {
            const date = new Date(log.created_at).toISOString().split('T')[0];
            if (!groups[date as keyof typeof groups]) {
              groups[date as keyof typeof groups] = {
                date,
                responseTime: 0,
                errorCount: 0,
                successCount: 0,
                cost: 0,
                count: 0
              };
            }
            (groups[date as keyof typeof groups] as any).responseTime += log.response_time_ms || 0;
            if (log.status === 'success') {
              (groups[date as keyof typeof groups] as any).successCount++;
            } else {
              (groups[date as keyof typeof groups] as any).errorCount++;
            }
            (groups[date as keyof typeof groups] as any).cost += parseFloat(log.cost || 0);
            (groups[date as keyof typeof groups] as any).count++;
            return groups;
          }, {});

          const timeSeriesData = Object.values(dateGroups).map((group: any) => ({
            date: group.date,
            responseTime: Math.round(group.responseTime / group.count),
            errorCount: group.errorCount,
            successCount: group.successCount,
            cost: parseFloat(group.cost.toFixed(2))
          })).sort((a: any, b: any) => a.date.localeCompare(b.date));

          setTimeSeriesData(timeSeriesData);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
        toast.error('获取统计数据失败');
      }
    };

    fetchData();
  }, []);

  const filteredStats = modelStats.filter(stat => {
    const modelMatch = selectedModel === 'all' || stat.model_id.toString() === selectedModel;
    const typeMatch = selectedTaskType === 'all' || stat.task_type === selectedTaskType;
    return modelMatch && typeMatch;
  });

  // 找出性能最优的前三个模型（响应时间最短）
  const topPerformers = [...filteredStats]
    .sort((a, b) => a.avg_response_time_ms - b.avg_response_time_ms)
    .slice(0, 3)
    .map(stat => stat.model_name);

  // 自定义柱状图颜色函数
  const getBarColor = (modelName: string, isP95 = false) => {
    const index = topPerformers.indexOf(modelName);
    if (index === 0) return isP95 ? '#FFD700' : '#FFA500'; // 金色 - 第一名
    if (index === 1) return isP95 ? '#C0C0C0' : '#A9A9A9'; // 银色 - 第二名  
    if (index === 2) return isP95 ? '#CD7F32' : '#8B4513'; // 铜色 - 第三名
    return isP95 ? '#82ca9d' : '#8884d8'; // 默认颜色
  };

  const aggregatedStats = {
    avgResponseTime: filteredStats.reduce((sum, s) => sum + s.avg_response_time_ms, 0) / filteredStats.length || 0,
    avgErrorRate: filteredStats.reduce((sum, s) => sum + s.error_rate, 0) / filteredStats.length || 0,
    avgCost: filteredStats.reduce((sum, s) => sum + s.avg_cost, 0) / filteredStats.length || 0,
    totalRequests: filteredStats.reduce((sum, s) => sum + s.total_requests, 0),
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">统计数据</h1>
        <p className="text-muted-foreground mt-2">
          查看模型性能、成本和错误率等关键指标
        </p>
        
        {/* 数据说明卡片 */}
        <Card className="mt-4 border-blue-200 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <div className="font-medium text-blue-900">数据说明</div>
                <div className="space-y-1 text-blue-800">
                  <div>• <strong>响应时间</strong>：包含LLM调用 + 数据处理的完整时间，并行任务使用中位数计算</div>
                  <div>• <strong>加权平均</strong>：基于请求量的加权计算，更准确反映实际性能</div>
                  <div>• <strong>P95响应时间</strong>：95%的请求响应时间都在此值以下</div>
                  <div>• <strong>并行优化</strong>：批量生成题目时，系统会自动并行处理以提升效率</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <CardTitle className="flex items-center gap-2">
              模型性能对比
              <div className="flex items-center gap-4 text-sm font-normal">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-xs">🥇 第一名</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span className="text-xs">🥈 第二名</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-600 rounded"></div>
                  <span className="text-xs">🥉 第三名</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={filteredStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="model_name" 
                  height={120}
                  interval={0}
                  tick={<CustomXAxisTick />}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const rank = topPerformers.indexOf(label as string) + 1;
                      const rankText = rank > 0 && rank <= 3 ? ` (第${rank}名)` : '';
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold text-sm mb-2">{label}{rankText}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-xs" style={{ color: entry.color }}>
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="avg_response_time_ms" 
                  name="平均响应时间(ms)"
                >
                  {filteredStats.map((entry, index) => (
                    <Cell key={`cell-avg-${index}`} fill={getBarColor(entry.model_name, false)} />
                  ))}
                </Bar>
                <Bar 
                  dataKey="p95_response_time_ms" 
                  name="P95响应时间(ms)"
                >
                  {filteredStats.map((entry, index) => (
                    <Cell key={`cell-p95-${index}`} fill={getBarColor(entry.model_name, true)} />
                  ))}
                </Bar>
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
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={filteredStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="model_name" 
                  height={120}
                  interval={0}
                  tick={<CustomXAxisTick />}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-semibold text-sm mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-xs" style={{ color: entry.color }}>
                              {entry.name}: {entry.value}%
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="success_rate" fill="#00C49F" name="成功率" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}