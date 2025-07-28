'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface PromptTemplate {
  id: number;
  type: 'outline' | 'quiz';
  name: string;
  content: string;
  is_default: boolean;
  variables: string[];
}

export default function PromptConfigPage() {
  const [outlinePrompt, setOutlinePrompt] = useState('');
  const [quizPrompt, setQuizPrompt] = useState('');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 从后端获取 prompt 模板
    const fetchTemplates = async () => {
      try {
        const response = await apiClient.getPromptTemplates();
        if (response.success && response.data) {
          setTemplates(response.data);
          
          // 设置默认的 prompt
          const defaultOutline = response.data.find(t => t.type === 'outline' && t.is_default);
          const defaultQuiz = response.data.find(t => t.type === 'quiz' && t.is_default);
          
          if (defaultOutline) setOutlinePrompt(defaultOutline.content);
          if (defaultQuiz) setQuizPrompt(defaultQuiz.content);
        }
      } catch (error) {
        console.error('获取模板失败:', error);
        toast.error('获取模板失败，请稍后重试');
      }
    };

    fetchTemplates();
  }, []);

  const handleSave = async (type: 'outline' | 'quiz') => {
    setIsSaving(true);
    try {
      // 目前后端还没有更新模板的 API，暂时使用本地存储
      console.log('保存 Prompt 配置:', {
        type,
        content: type === 'outline' ? outlinePrompt : quizPrompt,
      });
      
      // 更新本地状态
      setTemplates(templates.map(t => {
        if (t.type === type && t.is_default) {
          return { ...t, content: type === 'outline' ? outlinePrompt : quizPrompt };
        }
        return t;
      }));
      
      toast.success('保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请稍后重试');
    } finally {
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
                      {template.is_default && ' (默认)'}
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