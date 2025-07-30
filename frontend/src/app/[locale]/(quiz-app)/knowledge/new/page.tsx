'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface Model {
  id: number;
  name: string;
  provider: string;
  input_price_per_1k: number;
  output_price_per_1k: number;
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

  useEffect(() => {
    // 从后端获取模型列表
    const fetchModels = async () => {
      try {
        const response = await apiClient.getModels();
        if (response.success && response.data) {
          setModels(response.data);
          if (response.data.length > 0) {
            setSelectedModel(response.data[0].id.toString());
          }
        }
      } catch (error) {
        console.error('获取模型列表失败:', error);
        toast.error('获取模型列表失败');
      }
    };

    fetchModels();
  }, []);

  const handleGenerate = async () => {
    if (!question || !selectedModel) return;
    
    setIsGenerating(true);
    setGenerationProgress({
      step: 'outline',
      message: '正在生成学习大纲...',
      progress: 10
    });

    try {
      // 第一步：生成大纲
      const outlineResponse = await apiClient.generateOutline({
        title: question,
        model_id: parseInt(selectedModel),
        temperature: temperature[0],
        max_tokens: maxTokens[0],
        top_p: topP[0],
        outline_prompt: outlinePrompt || undefined,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">选择模型</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="选择一个模型" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      <div className="flex justify-between items-center w-full">
                        <span>{model.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          (输入: ${model.input_price_per_1k}/1k, 输出: ${model.output_price_per_1k}/1k)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Temperature: {temperature[0]}</Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={0}
                max={2}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {maxTokens[0]}</Label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                min={100}
                max={4000}
                step={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Top P: {topP[0]}</Label>
              <Slider
                value={topP}
                onValueChange={setTopP}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">配置大纲 Prompt</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>配置大纲生成 Prompt</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="输入自定义的大纲生成 prompt，留空使用默认配置"
                  value={outlinePrompt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOutlinePrompt(e.target.value)}
                  className="min-h-[200px]"
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">配置题目 Prompt</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>配置题目生成 Prompt</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="输入自定义的题目生成 prompt，留空使用默认配置"
                  value={quizPrompt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuizPrompt(e.target.value)}
                  className="min-h-[200px]"
                />
              </DialogContent>
            </Dialog>
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
            disabled={!question || !selectedModel || isGenerating}
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