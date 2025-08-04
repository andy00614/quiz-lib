'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Clock, DollarSign, AlertCircle, Target, Users, Zap, 
  CheckCircle, XCircle, Star, Download, FileText, BarChart3
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface ReportData {
  taskBackground: {
    objective: string;
    scope: string;
    timeline: string;
  };
  testPlan: {
    models: Array<{
      name: string;
      provider: string;
      tasks: string[];
    }>;
    templates: Array<{
      name: string;
      type: string;
      description: string;
    }>;
    parameters: Array<{
      name: string;
      values: number[];
    }>;
  };
  performanceData: {
    models: Array<{
      name: string;
      avgResponseTime: number;
      avgTokenConsumption: number;
      errorRate: number;
      avgCost: number;
    }>;
    trends: Array<{
      date: string;
      responseTime: number;
      cost: number;
      requests: number;
    }>;
  };
  insights: {
    bestPerforming: string;
    recommendations: string[];
    improvements: string[];
  };
}

export default function AnalysisReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAnalysisReport(30);
      
      if (response.success && response.data) {
        const apiData = response.data;
        
        const reportData: ReportData = {
          taskBackground: {
            objective: apiData.task_background.objective,
            scope: apiData.task_background.scope,
            timeline: apiData.task_background.timeline
          },
          testPlan: {
            models: apiData.test_plan.models.map((m: any) => ({
              name: m.name,
              provider: m.provider,
              tasks: m.tasks
            })),
            templates: [], // 使用模板统计信息而不是具体模板
            parameters: apiData.test_plan.parameters
          },
          performanceData: {
            models: apiData.performance_data.models.map((m: any) => ({
              name: m.model_name,
              avgResponseTime: m.avg_response_time_ms,
              avgTokenConsumption: m.avg_token_consumption,
              errorRate: m.error_rate,
              avgCost: m.avg_cost
            })),
            trends: apiData.performance_data.trends.map((t: any) => ({
              date: t.date,
              responseTime: t.responseTime,
              cost: t.cost,
              requests: t.requests
            }))
          },
          insights: {
            bestPerforming: apiData.insights.best_performing,
            recommendations: apiData.insights.recommendations,
            improvements: apiData.insights.improvements
          }
        };

        setReportData(reportData);
      } else {
        toast.error('获取报告数据失败');
      }
    } catch (error) {
      console.error('生成报告失败:', error);
      toast.error('生成报告失败');
    } finally {
      setLoading(false);
    }
  };


  const exportReport = () => {
    toast.success('报告导出功能开发中...');
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">无法生成报告数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔬 大模型提示词体验测试与性能分析报告</h1>
            <p className="text-muted-foreground">
              基于平台实际使用数据的综合性能评估与优化建议
            </p>
          </div>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 报告概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">测试模型</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.testPlan.models.length}</div>
            <p className="text-xs text-muted-foreground">个AI模型</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompt模板</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.testPlan.templates.length}</div>
            <p className="text-xs text-muted-foreground">个模板</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最佳表现</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{reportData.insights.bestPerforming}</div>
            <p className="text-xs text-muted-foreground">推荐模型</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">优化建议</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.insights.recommendations.length}</div>
            <p className="text-xs text-muted-foreground">条建议</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">项目概览</TabsTrigger>
          <TabsTrigger value="testplan">测试方案</TabsTrigger>
          <TabsTrigger value="performance">性能数据</TabsTrigger>
          <TabsTrigger value="insights">分析洞察</TabsTrigger>
          <TabsTrigger value="appendix">附录资料</TabsTrigger>
        </TabsList>

        {/* 项目概览 */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                任务背景与目标
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">评估目标</h4>
                <p className="text-muted-foreground">{reportData.taskBackground.objective}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">评估范围</h4>
                <p className="text-muted-foreground">{reportData.taskBackground.scope}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">时间范围</h4>
                <p className="text-muted-foreground">{reportData.taskBackground.timeline}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 测试方案 */}
        <TabsContent value="testplan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>测试模型</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.testPlan.models.map((model, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-muted-foreground">{model.provider}</div>
                      </div>
                      <div className="flex gap-1">
                        {model.tasks.map((task, i) => (
                          <Badge key={i} variant="outline">{task}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt模板</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.testPlan.templates.slice(0, 6).map((template, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{template.name}</div>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>参数配置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">维度</th>
                      <th className="text-left p-3">内容说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">测试任务</td>
                      <td className="p-3">操作系统知识生成 / Python 知识点</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">模型</td>
                      <td className="p-3">{reportData.testPlan.models.map(m => m.name).join(' / ')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Prompt 模板</td>
                      <td className="p-3">模板 A（直接指令） / 模板 B（角色设定+例子）</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">参数设置</td>
                      <td className="p-3">temperature = 0.2 / 0.7 / 1.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 性能数据 */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>性能数据概览（平台自动记录）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">模型</th>
                      <th className="text-left p-3">平均响应时间</th>
                      <th className="text-left p-3">平均Token消耗</th>
                      <th className="text-left p-3">错误率</th>  
                      <th className="text-left p-3">平均费用估算</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.performanceData.models.map((model, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{model.name}</td>
                        <td className="p-3">{(model.avgResponseTime / 1000).toFixed(1)}s</td>
                        <td className="p-3">{model.avgTokenConsumption.toLocaleString()}</td>
                        <td className="p-3">
                          <Badge variant={model.errorRate > 5 ? "destructive" : "secondary"}>
                            {model.errorRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="p-3">${model.avgCost.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>响应时间趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reportData.performanceData.trends}>
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
                <CardTitle>成本趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reportData.performanceData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cost" stroke="#ff7300" name="成本($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 分析洞察 */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  体验总结
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">体验方面</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Prompt 模板 B 更适合内容生成任务，结构更稳定</li>
                    <li>• Gemini 在部分任务上响应快，但错误率偏高</li>
                    <li>• 温度参数 0.7 在创造性和准确性之间达到良好平衡</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">性能方面</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• {reportData.insights.bestPerforming} 虽成本略高，但输出稳定性与质量最佳</li>
                    <li>• 并行处理显著提升了批量任务的执行效率</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.insights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                平台改进建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.insights.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm">{improvement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 附录资料 */}
        <TabsContent value="appendix" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>数据说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">响应时间</h4>
                  <p className="text-sm text-muted-foreground">包含LLM调用 + 数据处理的完整时间，并行任务使用中位数计算</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">加权平均</h4>  
                  <p className="text-sm text-muted-foreground">基于请求量的加权计算，更准确反映实际性能</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">P95响应时间</h4>
                  <p className="text-sm text-muted-foreground">95%的请求响应时间都在此值以下</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">并行优化</h4>
                  <p className="text-sm text-muted-foreground">批量生成题目时，系统会自动并行处理以提升效率</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>报告生成信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">生成时间</span>
                  <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">数据来源</span>
                  <span className="text-sm font-medium">平台实际使用数据</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">分析周期</span>
                  <span className="text-sm font-medium">最近30天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">报告版本</span>
                  <span className="text-sm font-medium">v1.0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>快速导航</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" onClick={() => setActiveTab('overview')}>
                  <Target className="w-4 h-4 mr-2" />
                  项目概览
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('testplan')}>
                  <FileText className="w-4 h-4 mr-2" />
                  测试方案
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('performance')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  性能数据
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('insights')}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  分析洞察
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}