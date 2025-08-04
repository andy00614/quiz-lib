'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Loader2, Star, Eye, Copy, ChevronDown, ChevronUp, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface Model {
  id: number;
  name: string;
  provider: string;
  input_price_per_1m: number;
  output_price_per_1m: number;
  input_price_display?: string;
  output_price_display?: string;
}

interface PromptTemplate {
  id: number;
  type: 'outline' | 'quiz';
  name: string;
  content: string;
  is_default: boolean;
  variables?: Variable[];
}

interface Variable {
  name: string;
  displayName: string;
  type: 'text' | 'select' | 'number' | 'boolean';
  required?: boolean;
  defaultValue?: any;
  options?: string[];
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export default function NewKnowledgePage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2000]);
  const [topP, setTopP] = useState([1.0]);
  const [models, setModels] = useState<Model[]>([]);
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [quizPrompt, setQuizPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    step: 'outline' | 'quiz' | 'completed';
    message: string;
    progress?: number;
  } | null>(null);
  
  // 模板相关状态
  const [outlineTemplates, setOutlineTemplates] = useState<PromptTemplate[]>([]);
  const [quizTemplates, setQuizTemplates] = useState<PromptTemplate[]>([]);
  const [selectedOutlineTemplate, setSelectedOutlineTemplate] = useState<string>('');
  const [selectedQuizTemplate, setSelectedQuizTemplate] = useState<string>('');
  const [outlineVariables, setOutlineVariables] = useState<Record<string, any>>({});
  const [quizVariables, setQuizVariables] = useState<Record<string, any>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useTemplate, setUseTemplate] = useState(true);

  // 当选择的模型变化时，调整max_tokens默认值
  useEffect(() => {
    if (selectedModel && models.length > 0) {
      const selectedModelData = models.find(m => m.id.toString() === selectedModel);
      if (selectedModelData && selectedModelData.name.toLowerCase().includes('gemini')) {
        // Gemini模型需要更多tokens来生成完整的题目
        setMaxTokens([6000]);
      } else {
        // 其他模型使用默认值
        setMaxTokens([2000]);
      }
    }
  }, [selectedModel, models]);

  useEffect(() => {
    // 从后端获取模型列表和模板列表
    const fetchData = async () => {
      try {
        // 获取模型
        const modelsResponse = await apiClient.getModels();
        if (modelsResponse.success && modelsResponse.data) {
          setModels(modelsResponse.data);
          if (modelsResponse.data.length > 0) {
            setSelectedModel(modelsResponse.data[0].id.toString());
          }
        }
        
        // 获取大纲模板
        const outlineTemplatesResponse = await apiClient.getPromptTemplates('quiz_outline');
        if (outlineTemplatesResponse.success && outlineTemplatesResponse.data) {
          console.log('Outline templates:', outlineTemplatesResponse.data); // 调试日志
          setOutlineTemplates(outlineTemplatesResponse.data);
          const defaultTemplate = outlineTemplatesResponse.data.find(t => t.is_default);
          if (defaultTemplate) {
            setSelectedOutlineTemplate(defaultTemplate.id.toString());
            setOutlinePrompt(defaultTemplate.content);
            // 初始化变量默认值
            if (defaultTemplate.variables && Array.isArray(defaultTemplate.variables)) {
              const defaultVars: Record<string, any> = {};
              defaultTemplate.variables.forEach((v: any) => {
                if (v && v.name && v.defaultValue !== undefined) {
                  const varKey = v.name.replace(/[{}]/g, '');
                  defaultVars[varKey] = v.defaultValue;
                }
              });
              setOutlineVariables(defaultVars);
            }
          }
        }
        
        // 获取题目模板
        const quizTemplatesResponse = await apiClient.getPromptTemplates('quiz');
        if (quizTemplatesResponse.success && quizTemplatesResponse.data) {
          setQuizTemplates(quizTemplatesResponse.data);
          const defaultTemplate = quizTemplatesResponse.data.find(t => t.is_default);
          if (defaultTemplate) {
            setSelectedQuizTemplate(defaultTemplate.id.toString());
            setQuizPrompt(defaultTemplate.content);
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        toast.error('获取数据失败');
      }
    };

    fetchData();
  }, []);

  // 处理模板选择
  const handleOutlineTemplateChange = async (templateId: string) => {
    setSelectedOutlineTemplate(templateId);
    const template = outlineTemplates.find(t => t.id.toString() === templateId);
    if (template) {
      setOutlinePrompt(template.content);
      // 重新解析变量
      if (template.variables && Array.isArray(template.variables)) {
        const defaultVars: Record<string, any> = {};
        template.variables.forEach(v => {
          if (v && v.name && v.defaultValue !== undefined) {
            const varKey = v.name.replace(/[{}]/g, '');
            defaultVars[varKey] = v.defaultValue;
          }
        });
        setOutlineVariables(defaultVars);
      }
    }
  };

  const handleQuizTemplateChange = (templateId: string) => {
    setSelectedQuizTemplate(templateId);
    const template = quizTemplates.find(t => t.id.toString() === templateId);
    if (template) {
      setQuizPrompt(template.content);
    }
  };

  // 渲染变量输入控件
  const renderVariableInput = (variable: Variable, value: any, onChange: (val: any) => void) => {
    switch (variable.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={variable.placeholder}
          />
        );
      case 'select':
        return (
          <Select value={value || variable.defaultValue} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variable.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value || variable.defaultValue || ''}
            onChange={(e) => onChange(parseInt(e.target.value))}
            min={variable.min}
            max={variable.max}
          />
        );
      default:
        return null;
    }
  };

  // 替换模板中的变量
  const processPromptWithVariables = (prompt: string, variables: Record<string, any>) => {
    let processedPrompt = prompt;
    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      processedPrompt = processedPrompt.replace(pattern, value);
    });
    // 替换主题变量
    processedPrompt = processedPrompt.replace(/{{topic}}/g, question);
    return processedPrompt;
  };

  const handleGenerate = async () => {
    if (!question || !selectedModel) return;
    
    // 验证输入
    if (useTemplate && !selectedOutlineTemplate) {
      toast.error('请选择大纲生成模板');
      return;
    }
    if (!useTemplate && !outlinePrompt) {
      toast.error('请输入大纲生成Prompt');
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress({
      step: 'outline',
      message: '正在生成学习大纲...',
      progress: 10
    });

    try {
      // 处理大纲prompt，替换变量
      const finalOutlinePrompt = useTemplate 
        ? processPromptWithVariables(outlinePrompt, outlineVariables)
        : outlinePrompt.replace(/{{topic}}/g, question);
      
      // 第一步：生成大纲
      const outlineResponse = await apiClient.generateOutline({
        title: question,
        model_id: parseInt(selectedModel),
        temperature: temperature[0],
        max_tokens: maxTokens[0],
        top_p: topP[0],
        outline_prompt: finalOutlinePrompt || undefined,
      });

      if (!outlineResponse.success || !outlineResponse.data) {
        throw new Error(outlineResponse.error || '生成大纲失败');
      }

      const knowledgeId = outlineResponse.data.knowledge_id;
      
      setGenerationProgress({
        step: 'quiz',
        message: '大纲生成完成，正在为所有章节生成题目...',
        progress: 50
      });

      // 第二步：自动为所有章节生成题目
      const batchQuizResponse = await apiClient.generateBatchQuiz(knowledgeId);

      if (!batchQuizResponse.success || !batchQuizResponse.data) {
        // 即使题目生成失败，大纲已经创建成功，仍然跳转到详情页
        console.warn('批量生成题目失败:', batchQuizResponse.error);
        toast.error('大纲生成成功，但部分题目生成失败，请在详情页面手动生成');
        router.push(`/knowledge/${knowledgeId}`);
        return;
      }

      const batchResult = batchQuizResponse.data;
      
      setGenerationProgress({
        step: 'completed',
        message: `生成完成！成功生成 ${batchResult.success_count} 个章节的题目`,
        progress: 100
      });

      // 显示详细的生成结果
      if (batchResult.failed_count > 0) {
        toast.warning(
          `生成完成！成功: ${batchResult.success_count}个章节，失败: ${batchResult.failed_count}个章节。总费用: $${batchResult.total_cost.toFixed(4)}`
        );
      } else {
        toast.success(
          `生成完成！所有 ${batchResult.success_count} 个章节的题目都已生成。总费用: $${batchResult.total_cost.toFixed(4)}`
        );
      }

      // 延迟一秒显示完成状态，然后跳转
      setTimeout(() => {
        router.push(`/knowledge/${knowledgeId}`);
      }, 1500);

    } catch (error) {
      console.error('生成失败:', error);
      toast.error(error instanceof Error ? error.message : '生成失败，请稍后重试');
      setGenerationProgress(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">创建新知识</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: 基本信息 */}
          <div className="space-y-2">
            <Label htmlFor="question">输入您的问题或主题</Label>
            <Textarea
              id="question"
              placeholder="例如：请帮我生成关于操作系统的知识点和题目..."
              value={question}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Step 2: 模板配置 */}
          <div className="space-y-4">
            {/* 模板/直接输入切换 */}
            <div className="flex items-center justify-between p-3 bg-blue-50/30 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <Label className="text-sm font-medium">Prompt 输入方式</Label>
                  <span className="text-xs text-muted-foreground">
                    {useTemplate ? '使用预设模板，支持变量配置' : '直接输入完整的Prompt内容'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="template-mode" className="text-sm">
                  {useTemplate ? '模板模式' : '直接输入'}
                </Label>
                <Switch
                  id="template-mode"
                  checked={useTemplate}
                  onCheckedChange={setUseTemplate}
                />
              </div>
            </div>

            {useTemplate ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 大纲模板选择 */}
              <div className="space-y-2">
                <Label>大纲生成模板</Label>
                <Select value={selectedOutlineTemplate} onValueChange={handleOutlineTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择大纲模板" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlineTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{template.name}</span>
                          {template.is_default && <Star className="w-3 h-3 text-yellow-500" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 题目模板选择 */}
              <div className="space-y-2">
                <Label>题目生成模板</Label>
                <Select value={selectedQuizTemplate} onValueChange={handleQuizTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择题目模板" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{template.name}</span>
                          {template.is_default && <Star className="w-3 h-3 text-yellow-500" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 直接输入大纲Prompt */}
                  <div className="space-y-2">
                    <Label htmlFor="direct-outline-prompt">大纲生成 Prompt</Label>
                    <Textarea
                      id="direct-outline-prompt"
                      placeholder="输入用于生成学习大纲的完整Prompt..."
                      value={outlinePrompt}
                      onChange={(e) => setOutlinePrompt(e.target.value)}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>

                  {/* 直接输入题目Prompt */}
                  <div className="space-y-2">
                    <Label htmlFor="direct-quiz-prompt">题目生成 Prompt</Label>
                    <Textarea
                      id="direct-quiz-prompt"
                      placeholder="输入用于生成题目的完整Prompt..."
                      value={quizPrompt}
                      onChange={(e) => setQuizPrompt(e.target.value)}
                      className="min-h-[120px] font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-3">
                  💡 直接输入模式：
                  <ul className="mt-1 ml-4 list-disc space-y-1">
                    <li>大纲Prompt中可使用 <code className="bg-white px-1 rounded">{'{{topic}}'}</code> 来引用主题</li>
                    <li>题目Prompt中可使用 <code className="bg-white px-1 rounded">{'{{chapter_title}}'}</code> 和 <code className="bg-white px-1 rounded">{'{{chapter_content}}'}</code></li>
                  </ul>
                </div>
              </div>
            )}

            {/* 实时Prompt预览 - 紧凑设计 */}
            {question && ((useTemplate && (selectedOutlineTemplate || selectedQuizTemplate)) || (!useTemplate && (outlinePrompt || quizPrompt))) && (
              <Card className="border-indigo-200 bg-indigo-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    实际发送的 Prompt 预览
                  </CardTitle>
                  <CardDescription className="text-xs">
                    下方显示的是将变量替换后实际发送给AI的完整prompt内容
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Tabs defaultValue="outline">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="outline" disabled={useTemplate ? !selectedOutlineTemplate : !outlinePrompt}>
                        大纲 Prompt {useTemplate ? (!selectedOutlineTemplate && '(未选择)') : (!outlinePrompt && '(未输入)')}
                      </TabsTrigger>
                      <TabsTrigger value="quiz" disabled={useTemplate ? !selectedQuizTemplate : !quizPrompt}>
                        题目 Prompt {useTemplate ? (!selectedQuizTemplate && '(未选择)') : (!quizPrompt && '(未输入)')}
                      </TabsTrigger>
                    </TabsList>
                    
                    {((useTemplate && selectedOutlineTemplate) || (!useTemplate && outlinePrompt)) && (
                      <TabsContent value="outline" className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">实际发送给AI的大纲生成Prompt:</span>
                            <Badge variant="outline" className="text-xs">
                              {useTemplate ? (outlineTemplates.find(t => t.id.toString() === selectedOutlineTemplate)?.name || '模板') : '直接输入'}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => {
                              const promptToUse = useTemplate 
                                ? processPromptWithVariables(outlinePrompt, outlineVariables)
                                : outlinePrompt.replace(/{{topic}}/g, question);
                              navigator.clipboard.writeText(promptToUse);
                              toast.success('大纲Prompt已复制');
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="bg-white rounded p-3 border text-xs font-mono max-h-32 overflow-y-auto">
                          {useTemplate 
                            ? processPromptWithVariables(outlinePrompt, outlineVariables)
                            : outlinePrompt.replace(/{{topic}}/g, question)
                          }
                        </div>
                        
                        {/* 大纲变量配置 - 仅在模板模式下显示 */}
                        {(() => {
                          if (!useTemplate || !outlineTemplates || outlineTemplates.length === 0) return false;
                          const template = outlineTemplates.find(t => t.id.toString() === selectedOutlineTemplate);
                          const vars = template?.variables?.filter(v => v.name && v.name !== '{{topic}}');
                          return vars && vars.length > 0;
                        })() && (
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">参数配置:</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {outlineTemplates
                                .find(t => t.id.toString() === selectedOutlineTemplate)
                                ?.variables?.filter(v => v.name && v.name !== '{{topic}}')
                                .map(variable => {
                                  const varKey = variable.name ? variable.name.replace(/[{}]/g, '') : '';
                                  return (
                                    <div key={variable.name || varKey} className="space-y-1">
                                      <Label className="text-xs">{variable.displayName}</Label>
                                      {renderVariableInput(
                                        variable,
                                        outlineVariables[varKey],
                                        (val) => setOutlineVariables({
                                          ...outlineVariables,
                                          [varKey]: val
                                        })
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    )}
                    
                    {((useTemplate && selectedQuizTemplate) || (!useTemplate && quizPrompt)) && (
                      <TabsContent value="quiz" className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">题目生成Prompt模板:</span>
                            <Badge variant="outline" className="text-xs">
                              {useTemplate ? (quizTemplates.find(t => t.id.toString() === selectedQuizTemplate)?.name || '模板') : '直接输入'}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => {
                              navigator.clipboard.writeText(quizPrompt);
                              toast.success('题目Prompt已复制');
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="bg-white rounded p-3 border text-xs font-mono max-h-32 overflow-y-auto">
                          {quizPrompt}
                        </div>
                        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                          <div className="flex items-start gap-2">
                            <Target className="w-3 h-3 mt-0.5 text-amber-600" />
                            <div>
                              <div className="font-medium mb-1">动态变量替换说明：</div>
                              <div>• <code className="bg-amber-100 px-1 rounded">{'{{chapter_title}}'}</code> - 每个章节的标题会自动注入</div>
                              <div>• <code className="bg-amber-100 px-1 rounded">{'{{chapter_content}}'}</code> - 每个章节的详细内容会自动注入</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Step 3: 模型和参数 - 紧凑布局 */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">AI 模型</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        <div className="flex justify-between items-center w-full">
                          <span>{model.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            输入: {model.input_price_display || `$${model.input_price_per_1m}/1M`} | 输出: {model.output_price_display || `$${model.output_price_per_1m}/1M`}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>模型参数</Label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>参数调节</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      T:{temperature[0]} / M:{maxTokens[0]} / P:{topP[0]}
                    </span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </Button>
              </div>
            </div>
            
            {/* 参数调节 - 折叠式 */}
            {showAdvanced && (
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Temperature: {temperature[0]}</Label>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Max Tokens: {maxTokens[0]}</Label>
                      <Slider
                        value={maxTokens}
                        onValueChange={setMaxTokens}
                        min={100}
                        max={4000}
                        step={100}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Top P: {topP[0]}</Label>
                      <Slider
                        value={topP}
                        onValueChange={setTopP}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 进度显示 */}
          {generationProgress && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {generationProgress.step === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    )}
                    <span className="text-sm font-medium">{generationProgress.message}</span>
                  </div>
                  
                  {generationProgress.progress !== undefined && (
                    <div className="space-y-2">
                      <Progress value={generationProgress.progress} className="w-full" />
                      <div className="text-xs text-muted-foreground text-right">
                        {generationProgress.progress}%
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    {generationProgress.step === 'outline' && '📚 正在分析您的主题并创建详细的学习大纲...'}
                    {generationProgress.step === 'quiz' && '📝 正在为每个章节生成练习题目，这可能需要几分钟时间...'}
                    {generationProgress.step === 'completed' && '✅ 所有内容都已生成完成，即将跳转到详情页面！'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleGenerate} 
            disabled={!question || !selectedModel || isGenerating || (useTemplate ? !selectedOutlineTemplate : !outlinePrompt)}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                生成中...
              </div>
            ) : (
              '生成知识内容和题目'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}