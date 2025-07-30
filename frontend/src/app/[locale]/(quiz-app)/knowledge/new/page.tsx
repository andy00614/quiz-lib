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
    try {
      // 直接生成大纲（会自动创建知识记录）
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
      toast.success('知识内容生成成功！');
      router.push(`/knowledge/${knowledgeId}`);
    } catch (error) {
      console.error('生成失败:', error);
      toast.error(error instanceof Error ? error.message : '生成失败，请稍后重试');
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

          <Button 
            onClick={handleGenerate} 
            disabled={!question || !selectedModel || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? '生成中...' : '生成知识内容'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}