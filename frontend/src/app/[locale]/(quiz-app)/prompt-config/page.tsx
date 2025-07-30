'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Save, Plus, Edit2, Trash2, Star, StarOff, Copy, Eye, Search, Filter, Type, ChevronDown
} from 'lucide-react';
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
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'outline' | 'quiz'>('all');
  const [parsedVariables, setParsedVariables] = useState<any[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.getPromptTemplates();
      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('获取模板失败:', error);
      toast.error('获取模板失败，请稍后重试');
    }
  };

  // 解析模板变量
  const parseTemplateContent = async (content: string) => {
    try {
      const response = await apiClient.parseTemplateVariables(content);
      if (response.success && response.data) {
        setParsedVariables(response.data);
      }
    } catch (error) {
      console.error('解析变量失败:', error);
    }
  };

  // 插入变量到当前光标位置
  const insertVariable = (variableName: string) => {
    if (!editingTemplate || !textareaRef) return;
    
    const textarea = textareaRef;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = editingTemplate.content;
    
    const newContent = content.substring(0, start) + `{{${variableName}}}` + content.substring(end);
    
    setEditingTemplate({ ...editingTemplate, content: newContent });
    parseTemplateContent(newContent);
    
    // 设置光标位置到插入变量之后
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + `{{${variableName}}}`.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // 预定义变量库
  const predefinedVariables = {
    outline: [
      { name: 'topic', displayName: '主题', description: '知识内容的主题', icon: '📚' },
      { name: 'level', displayName: '难度等级', description: '内容难度级别（初级/中级/高级）', icon: '📊' },
      { name: 'chapters', displayName: '章节数量', description: '生成的章节数量', icon: '📋' },
      { name: 'language', displayName: '语言', description: '内容使用的语言', icon: '🌐' }
    ],
    quiz: [
      { name: 'chapter_title', displayName: '章节标题', description: '当前章节的标题', icon: '📖' },
      { name: 'chapter_content', displayName: '章节内容', description: '章节的详细内容', icon: '📝' },
      { name: 'question_count', displayName: '题目数量', description: '生成的题目数量', icon: '🔢' },
      { name: 'question_type', displayName: '题目类型', description: '题目的类型（单选/多选/判断）', icon: '❓' }
    ]
  };

  // 创建模板
  const handleCreateTemplate = async () => {
    if (!editingTemplate) return;
    
    setIsSaving(true);
    try {
      const response = await apiClient.createPromptTemplate({
        ...editingTemplate,
        variables: parsedVariables
      });
      
      if (response.success) {
        toast.success('模板创建成功！');
        setIsCreating(false);
        setEditingTemplate(null);
        fetchTemplates();
      }
    } catch (error) {
      console.error('创建模板失败:', error);
      toast.error('创建模板失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 更新模板
  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    setIsSaving(true);
    try {
      const response = await apiClient.updatePromptTemplate(editingTemplate.id, {
        name: editingTemplate.name,
        content: editingTemplate.content,
        is_default: editingTemplate.is_default,
        variables: parsedVariables
      });
      
      if (response.success) {
        toast.success('模板更新成功！');
        setEditingTemplate(null);
        fetchTemplates();
      }
    } catch (error) {
      console.error('更新模板失败:', error);
      toast.error('更新模板失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 删除模板
  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('确定要删除这个模板吗？')) return;
    
    try {
      const response = await apiClient.deletePromptTemplate(templateId);
      if (response.success) {
        toast.success('模板删除成功！');
        fetchTemplates();
      }
    } catch (error) {
      console.error('删除模板失败:', error);
      toast.error('删除模板失败');
    }
  };

  // 设置默认模板
  const handleSetDefault = async (templateId: number) => {
    try {
      const response = await apiClient.setDefaultTemplate(templateId);
      if (response.success) {
        toast.success('设置默认模板成功！');
        fetchTemplates();
      }
    } catch (error) {
      console.error('设置默认模板失败:', error);
      toast.error('设置默认模板失败');
    }
  };

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Prompt 模板管理中心</h1>
        <p className="text-muted-foreground mt-2">
          创建、管理和组织您的 Prompt 模板
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：模板列表 */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle>模板列表</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsCreating(true);
                    setEditingTemplate({
                      id: 0,
                      type: 'outline',
                      name: '',
                      content: '',
                      is_default: false,
                      variables: []
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新建
                </Button>
              </div>
              
              {/* 搜索和筛选 */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索模板..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Tabs defaultValue="all" value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="outline">大纲</TabsTrigger>
                    <TabsTrigger value="quiz">题目</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <div className="flex gap-1">
                          {template.is_default && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {template.type === 'outline' ? '大纲' : '题目'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：模板详情/编辑器 */}
        <div className="lg:col-span-2">
          {(selectedTemplate || editingTemplate) ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {isCreating ? '创建新模板' : editingTemplate ? '编辑模板' : '模板详情'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!editingTemplate && selectedTemplate && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTemplate(selectedTemplate)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newTemplate = { ...selectedTemplate, id: 0, name: `${selectedTemplate.name} (复制)` };
                            setEditingTemplate(newTemplate);
                            setIsCreating(true);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          复制
                        </Button>
                        {!selectedTemplate.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            删除
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(selectedTemplate.id)}
                        >
                          {selectedTemplate.is_default ? <StarOff className="w-4 h-4 mr-1" /> : <Star className="w-4 h-4 mr-1" />}
                          {selectedTemplate.is_default ? '取消默认' : '设为默认'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {editingTemplate ? (
                  <>
                    {/* 编辑表单 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>模板名称</Label>
                        <Input
                          value={editingTemplate.name}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                          placeholder="输入模板名称"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>模板类型</Label>
                        <Select
                          value={editingTemplate.type}
                          onValueChange={(v) => setEditingTemplate({ ...editingTemplate, type: v as 'outline' | 'quiz' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outline">大纲生成</SelectItem>
                            <SelectItem value="quiz">题目生成</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Prompt 编辑器和变量面板 */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* 左侧：Prompt 编辑器 */}
                      <div className="col-span-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Prompt 内容</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => parseTemplateContent(editingTemplate.content)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            解析变量
                          </Button>
                        </div>
                        <Textarea
                          ref={setTextareaRef}
                          value={editingTemplate.content}
                          onChange={(e) => {
                            setEditingTemplate({ ...editingTemplate, content: e.target.value });
                            setCursorPosition(e.target.selectionStart);
                            // 自动解析变量
                            parseTemplateContent(e.target.value);
                          }}
                          onSelect={(e: any) => setCursorPosition(e.target.selectionStart)}
                          className="min-h-[350px] font-mono text-sm"
                          placeholder="输入 Prompt 内容...\n\n💡 提示：使用右侧变量面板快速插入变量，或手动输入 {{变量名}} 格式"
                        />
                      </div>
                      
                      {/* 右侧：变量插入面板 */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Type className="w-4 h-4" />
                          <Label className="text-sm font-medium">变量库</Label>
                        </div>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-3">
                            <div className="space-y-3">
                              {/* 通用变量 */}
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">通用变量</h4>
                                <div className="space-y-1">
                                  {predefinedVariables.outline.concat(predefinedVariables.quiz)
                                    .filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i)
                                    .map(variable => (
                                    <Button
                                      key={variable.name}
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start h-auto p-2 text-left"
                                      onClick={() => insertVariable(variable.name)}
                                    >
                                      <div className="flex items-start gap-2 w-full">
                                        <span className="text-sm">{variable.icon}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-medium truncate">{variable.displayName}</div>
                                          <div className="text-xs text-muted-foreground truncate">{variable.name}</div>
                                        </div>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              
                              {/* 类型特定变量 */}
                              {editingTemplate.type && (
                                <div>
                                  <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                                    {editingTemplate.type === 'outline' ? '大纲专用' : '题目专用'}
                                  </h4>
                                  <div className="space-y-1">
                                    {predefinedVariables[editingTemplate.type].map(variable => (
                                      <Button
                                        key={variable.name}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start h-auto p-2 text-left"
                                        onClick={() => insertVariable(variable.name)}
                                      >
                                        <div className="flex items-start gap-2 w-full">
                                          <span className="text-sm">{variable.icon}</span>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium truncate">{variable.displayName}</div>
                                            <div className="text-xs text-muted-foreground truncate">{variable.name}</div>
                                          </div>
                                        </div>
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <Separator />
                              
                              {/* 使用说明 */}
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div className="font-medium">💡 使用提示：</div>
                                <div>• 点击变量名快速插入</div>
                                <div>• 变量格式：{'{{变量名}}'}</div>
                                <div>• 支持自定义变量</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    {/* 显示解析出的变量 - 更美观的展示 */}
                    {parsedVariables.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>模板中的变量</Label>
                          <Badge variant="outline" className="text-xs">
                            {parsedVariables.length} 个
                          </Badge>
                        </div>
                        <Card className="border-green-200 bg-green-50/30">
                          <CardContent className="p-3">
                            <div className="grid grid-cols-2 gap-2">
                              {parsedVariables.map((variable, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{variable.displayName}</div>
                                    <div className="text-xs text-muted-foreground font-mono truncate">{variable.name}</div>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {variable.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingTemplate(null);
                          setIsCreating(false);
                          setParsedVariables([]);
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        onClick={isCreating ? handleCreateTemplate : handleUpdateTemplate}
                        disabled={isSaving || !editingTemplate.name || !editingTemplate.content}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? '保存中...' : (isCreating ? '创建模板' : '保存更改')}
                      </Button>
                    </div>
                  </>
                ) : selectedTemplate ? (
                  <>
                    {/* 模板详情展示 */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">模板信息</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">类型：</span>
                            <Badge variant="outline" className="ml-2">
                              {selectedTemplate.type === 'outline' ? '大纲生成' : '题目生成'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">状态：</span>
                            {selectedTemplate.is_default && (
                              <Badge className="ml-2">默认模板</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold mb-2">Prompt 内容</h3>
                        <Card>
                          <CardContent className="pt-4">
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                              {selectedTemplate.content}
                            </pre>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="font-semibold mb-2">模板变量</h3>
                            <div className="space-y-2">
                              {selectedTemplate.variables.map((variable: any, index) => (
                                <Card key={index}>
                                  <CardContent className="pt-4">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <span className="font-medium">{variable.name || variable}</span>
                                        <span className="text-muted-foreground ml-2">({variable.displayName || ''})</span>
                                      </div>
                                      <div className="text-right">
                                        <Badge variant="outline">{variable.type || 'string'}</Badge>
                                        {variable.required && <Badge variant="destructive" className="ml-2">必填</Badge>}
                                      </div>
                                    </div>
                                    {variable.description && (
                                      <p className="text-xs text-muted-foreground mt-2">{variable.description}</p>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">选择一个模板查看详情，或创建新模板</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}