'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';

interface PromptTemplate {
  id: number;
  type: 'outline' | 'quiz';
  name: string;
  content: string;
  isDefault: boolean;
  variables: string[];
}

export default function PromptConfigPage() {
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [quizPrompt, setQuizPrompt] = useState('');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // TODO: 从后端获取默认 prompt 配置
    const mockTemplates: PromptTemplate[] = [
      {
        id: 1,
        type: 'outline',
        name: '默认大纲生成模板',
        content: `请根据以下主题生成一个详细的学习大纲：
主题：{{topic}}

要求：
1. 大纲应该包含 4-6 个主要章节
2. 每个章节应该有清晰的学习目标
3. 内容应该由浅入深，循序渐进
4. 适合初学者学习

请以 JSON 格式返回大纲。`,
        isDefault: true,
        variables: ['topic'],
      },
      {
        id: 2,
        type: 'quiz',
        name: '默认题目生成模板',
        content: `请根据以下章节内容生成 10 道选择题：
章节标题：{{chapterTitle}}
章节内容：{{chapterContent}}

要求：
1. 每道题目应该有 4 个选项（A、B、C、D）
2. 只有一个正确答案
3. 题目难度应该适中
4. 包含答案解析
5. 覆盖章节的关键知识点

请以 JSON 格式返回题目。`,
        isDefault: true,
        variables: ['chapterTitle', 'chapterContent'],
      },
    ];

    setTemplates(mockTemplates);
    setOutlinePrompt(mockTemplates.find(t => t.type === 'outline' && t.isDefault)?.content || '');
    setQuizPrompt(mockTemplates.find(t => t.type === 'quiz' && t.isDefault)?.content || '');
  }, []);

  const handleSave = async (type: 'outline' | 'quiz') => {
    setIsSaving(true);
    try {
      // TODO: 保存到后端
      console.log('保存 Prompt 配置:', {
        type,
        content: type === 'outline' ? outlinePrompt : quizPrompt,
      });
      
      // 模拟保存延迟
      setTimeout(() => {
        setIsSaving(false);
        alert('保存成功！');
      }, 1000);
    } catch (error) {
      console.error('保存失败:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Prompt 配置</h1>
        <p className="text-muted-foreground mt-2">
          配置默认的大纲和题目生成 Prompt 模板
        </p>
      </div>

      <Tabs defaultValue="outline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="outline">大纲生成 Prompt</TabsTrigger>
          <TabsTrigger value="quiz">题目生成 Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="outline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>大纲生成 Prompt 模板</CardTitle>
              <CardDescription>
                配置用于生成知识大纲的默认 Prompt。支持使用变量占位符，如 {`{{topic}}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outline-prompt">Prompt 内容</Label>
                <Textarea
                  id="outline-prompt"
                  value={outlinePrompt}
                  onChange={(e) => setOutlinePrompt(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">可用变量：</h4>
                <div className="flex flex-wrap gap-2">
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{topic}}`}</code>
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{language}}`}</code>
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{difficulty}}`}</code>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('outline')} 
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '保存中...' : '保存大纲 Prompt'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>题目生成 Prompt 模板</CardTitle>
              <CardDescription>
                配置用于生成章节题目的默认 Prompt。支持使用变量占位符
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-prompt">Prompt 内容</Label>
                <Textarea
                  id="quiz-prompt"
                  value={quizPrompt}
                  onChange={(e) => setQuizPrompt(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">可用变量：</h4>
                <div className="flex flex-wrap gap-2">
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{chapterTitle}}`}</code>
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{chapterContent}}`}</code>
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{questionCount}}`}</code>
                  <code className="bg-background px-2 py-1 rounded text-xs">{`{{difficulty}}`}</code>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('quiz')} 
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '保存中...' : '保存题目 Prompt'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Prompt 模板库</CardTitle>
          <CardDescription>
            预设的 Prompt 模板，可以快速应用到配置中
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      类型: {template.type === 'outline' ? '大纲生成' : '题目生成'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (template.type === 'outline') {
                        setOutlinePrompt(template.content);
                      } else {
                        setQuizPrompt(template.content);
                      }
                    }}
                  >
                    应用模板
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}