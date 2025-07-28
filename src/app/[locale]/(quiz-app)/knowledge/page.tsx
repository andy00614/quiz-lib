'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Bot } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface KnowledgeItem {
  id: number;
  title: string;
  model: {
    id: number;
    name: string;
  };
  created_at: string;
  status: string;
  outlines?: any[];
}

export default function KnowledgeListPage() {
  const router = useRouter();
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    // 从后端获取知识列表
    const fetchKnowledgeList = async () => {
      try {
        const response = await apiClient.getKnowledgeRecords();
        if (response.success && response.data) {
          setKnowledgeList(response.data);
        }
      } catch (error) {
        console.error('获取知识列表失败:', error);
        toast.error('获取知识列表失败');
      }
    };

    fetchKnowledgeList();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-600">已完成</span>;
      case 'generating':
        return <span className="text-blue-600">生成中</span>;
      case 'failed':
        return <span className="text-red-600">失败</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">知识库</h1>
        <Button onClick={() => router.push('/knowledge/new')}>
          <Plus className="w-4 h-4 mr-2" />
          创建新知识
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {knowledgeList.map((item) => (
          <Card 
            key={item.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/knowledge/${item.id}`)}
          >
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="w-4 h-4" />
                <span>{item.model.name}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>大纲数:</span>
                  <span className="font-medium">{item.outlines?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>状态:</span>
                  <span className="font-medium">{getStatusBadge(item.status)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground pt-2 border-t">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{new Date(item.created_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {knowledgeList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">还没有创建任何知识</p>
          <Button onClick={() => router.push('/knowledge/new')}>
            <Plus className="w-4 h-4 mr-2" />
            创建第一个知识
          </Button>
        </div>
      )}
    </div>
  );
}