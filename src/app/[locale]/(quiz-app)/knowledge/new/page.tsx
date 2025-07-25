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

interface Model {
  id: number;
  name: string;
  provider: string;
  inputPricePer1k: number;
  outputPricePer1k: number;
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
    // TODO: 从后端获取模型列表
    const mockModels: Model[] = [
      { id: 1, name: 'GPT-4o', provider: 'OpenAI', inputPricePer1k: 0.005, outputPricePer1k: 0.015 },
      { id: 2, name: 'GPT-3.5-turbo', provider: 'OpenAI', inputPricePer1k: 0.0005, outputPricePer1k: 0.0015 },
      { id: 3, name: 'Claude 3 Opus', provider: 'Anthropic', inputPricePer1k: 0.015, outputPricePer1k: 0.075 },
    ];
    setModels(mockModels);
    setSelectedModel('1');
  }, []);

  const handleGenerate = async () => {
    if (!question || !selectedModel) return;
    
    setIsGenerating(true);
    try {
      // TODO: 调用后端API生成知识内容
      // const response = await fetch('/api/knowledge/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     question,
      //     modelId: selectedModel,
      //     temperature: temperature[0],
      //     maxTokens: maxTokens[0],
      //     topP: topP[0],
      //     outlinePrompt,
      //     quizPrompt,
      //   }),
      // });
      
      // 模拟生成完成后跳转
      setTimeout(() => {
        router.push('/knowledge/1'); // TODO: 使用实际的知识ID
      }, 2000);
    } catch (error) {
      console.error('生成失败:', error);
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
                          (输入: ${model.inputPricePer1k}/1k, 输出: ${model.outputPricePer1k}/1k)
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