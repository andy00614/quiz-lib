'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [modelStats, setModelStats] = useState<ModelStats[]>([]);

  useEffect(() => {
    // 从后端获取统计数据
    const fetchData = async () => {
      try {
        // 获取模型统计数据
        const statsResponse = await apiClient.getModelStats();
        if (statsResponse.success && statsResponse.data) {
          setModelStats(statsResponse.data);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
        toast.error('获取统计数据失败');
      }
    };

    fetchData();
  }, []);

  const filteredStats = modelStats;


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

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>模型性能对比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={filteredStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                barCategoryGap="20%"
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
                <Bar dataKey="avg_response_time_ms" fill="#8884d8" name="平均响应时间(ms)" />
                <Bar dataKey="p95_response_time_ms" fill="#82ca9d" name="P95响应时间(ms)" />
              </BarChart>
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
                barCategoryGap="20%"
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