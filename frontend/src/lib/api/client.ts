import { env } from '@/env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL || 'http://localhost:9001';
const API_VERSION = '/api/v1';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_VERSION}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // 对于列表端点添加斜杠，对于具体资源端点不添加
      let normalizedEndpoint = endpoint;
      if (!endpoint.includes('?') && !endpoint.endsWith('/')) {
        // 检查是否是列表端点（不包含数字ID）
        const segments = endpoint.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        const isListEndpoint = !lastSegment || isNaN(Number(lastSegment));
        
        if (isListEndpoint) {
          normalizedEndpoint = `${endpoint}/`;
        }
      }
      
      const response = await fetch(`${this.baseUrl}${normalizedEndpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  // Models API
  async getModels() {
    return this.request<any[]>('/models');
  }

  async getModel(id: number) {
    return this.request<any>(`/models/${id}`);
  }

  // Prompt Templates API
  async getPromptTemplates(type?: 'outline' | 'quiz') {
    const params = type ? `?type_filter=${type}` : '';
    return this.request<any[]>(`/prompts${params}`);
  }

  async getPromptTemplate(id: number) {
    return this.request<any>(`/prompts/${id}`);
  }

  async createPromptTemplate(data: {
    type: 'outline' | 'quiz';
    name: string;
    content: string;
    is_default?: boolean;
    variables?: any[];
  }) {
    return this.request<any>('/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePromptTemplate(id: number, data: {
    name?: string;
    content?: string;
    is_default?: boolean;
    variables?: any[];
  }) {
    return this.request<any>(`/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePromptTemplate(id: number) {
    return this.request<void>(`/prompts/${id}`, {
      method: 'DELETE',
    });
  }

  async setDefaultTemplate(id: number) {
    return this.request<any>(`/prompts/${id}/set-default`, {
      method: 'PATCH',
    });
  }

  async parseTemplateVariables(content: string) {
    return this.request<any[]>('/prompts/parse-variables', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Knowledge Records API
  async getKnowledgeRecords() {
    return this.request<any[]>('/knowledge');
  }

  async getKnowledgeRecord(id: number) {
    return this.request<any>(`/knowledge/${id}`);
  }

  async createKnowledgeRecord(data: any) {
    return this.request<any>('/knowledge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generation API
  async generateOutline(data: {
    title: string;
    model_id: number;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    outline_prompt?: string;
  }) {
    return this.request<any>('/generation/outline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateQuiz(data: {
    chapter_id: number;
    model_id: number;
    question_count?: number;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    quiz_prompt?: string;
  }) {
    return this.request<any>('/generation/quiz', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateBatchQuiz(knowledgeId: number) {
    return this.request<{
      total_chapters: number;
      success_count: number;
      failed_count: number;
      chapter_results: Array<{
        chapter_id: number;
        chapter_title: string;
        status: 'success' | 'failed';
        quiz_count?: number;
        cost?: number;
        tokens?: number;
        error?: string;
      }>;
      total_cost: number;
      total_tokens: number;
    }>(`/generation/quiz/batch?knowledge_id=${knowledgeId}`, {
      method: 'POST',
    });
  }

  // Analytics API
  async getDashboardStats() {
    return this.request<any>('/analytics/dashboard');
  }

  async getModelStats() {
    return this.request<any[]>('/analytics/models/stats');
  }

  async getRequestLogs(params?: {
    model_id?: number | string;
    knowledge_id?: number;
    status?: string;
    request_type?: string;
    limit?: number;
    offset?: number;
    skip?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    return this.request<any[]>(`/analytics/logs${queryString ? `?${queryString}` : ''}`);
  }

  async getModelPerformance(modelId: number) {
    return this.request<any[]>(`/analytics/models/${modelId}/performance`);
  }

  // Chapters API
  async getChapters(knowledgeId: number) {
    return this.request<any[]>(`/knowledge/${knowledgeId}/chapters`);
  }

  // Quizzes API
  async getQuizzes(knowledgeId: number, chapterId: number) {
    return this.request<any[]>(`/knowledge/${knowledgeId}/chapters/${chapterId}/quizzes`);
  }

  async exportQuizzes(chapterId: number, format: 'csv' | 'json' | 'markdown') {
    const response = await fetch(
      `${this.baseUrl}/chapters/${chapterId}/quizzes/export?format=${format}`
    );
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    return response;
  }
}

export const apiClient = new ApiClient();