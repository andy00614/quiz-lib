# 数据库 Schema 设计

## 1. 模型表 (models)
存储支持的 AI 模型信息
```sql
CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 如 openai, anthropic, google
    version VARCHAR(50),
    input_price_per_1k DECIMAL(10, 6), -- 每1000 token的输入价格
    output_price_per_1k DECIMAL(10, 6), -- 每1000 token的输出价格
    max_tokens INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 2. Prompt 模板表 (prompt_templates)
存储默认的 prompt 配置
```sql
CREATE TABLE prompt_templates (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'outline' 或 'quiz'
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    variables JSONB, -- 存储可用的变量占位符
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. 知识记录表 (knowledge_records)
存储用户创建的知识主题
```sql
CREATE TABLE knowledge_records (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL, -- 用户输入的问题/主题
    model_id INTEGER REFERENCES models(id),
    temperature DECIMAL(3, 2) DEFAULT 0.7,
    max_tokens INTEGER,
    top_p DECIMAL(3, 2),
    outline_prompt_id INTEGER REFERENCES prompt_templates(id),
    quiz_prompt_id INTEGER REFERENCES prompt_templates(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 4. 大纲表 (outlines)
存储生成的大纲内容
```sql
CREATE TABLE outlines (
    id SERIAL PRIMARY KEY,
    knowledge_id INTEGER REFERENCES knowledge_records(id) ON DELETE CASCADE,
    content JSONB NOT NULL, -- 存储结构化的大纲内容
    raw_response TEXT, -- 原始 AI 响应
    model_id INTEGER REFERENCES models(id),
    prompt_used TEXT, -- 实际使用的完整 prompt
    input_tokens INTEGER,
    output_tokens INTEGER,
    response_time_ms INTEGER, -- 响应时间（毫秒）
    cost DECIMAL(10, 6), -- 计算得出的成本
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 5. 章节表 (chapters)
存储大纲中的章节信息
```sql
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    outline_id INTEGER REFERENCES outlines(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    quiz_generation_status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 6. 题目表 (quizzes)
存储生成的题目
```sql
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- 存储 A, B, C, D 选项
    correct_answer CHAR(1) NOT NULL, -- A, B, C, 或 D
    explanation TEXT,
    model_id INTEGER REFERENCES models(id),
    prompt_used TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    response_time_ms INTEGER,
    cost DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 7. API 请求日志表 (api_request_logs)
记录所有 AI API 请求
```sql
CREATE TABLE api_request_logs (
    id SERIAL PRIMARY KEY,
    knowledge_id INTEGER REFERENCES knowledge_records(id),
    request_type VARCHAR(50) NOT NULL, -- 'outline_generation' 或 'quiz_generation'
    model_id INTEGER REFERENCES models(id),
    prompt TEXT NOT NULL,
    request_params JSONB, -- 存储温度、max_tokens 等参数
    response TEXT,
    status VARCHAR(50) NOT NULL, -- success, failed, timeout
    error_message TEXT,
    input_tokens INTEGER,
    output_tokens INTEGER,
    response_time_ms INTEGER,
    cost DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 8. 模型性能统计表 (model_performance_stats)
用于缓存模型性能统计数据
```sql
CREATE TABLE model_performance_stats (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES models(id),
    task_type VARCHAR(50) NOT NULL, -- 'outline' 或 'quiz'
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
    period_date DATE NOT NULL,
    avg_response_time_ms DECIMAL(10, 2),
    p95_response_time_ms DECIMAL(10, 2),
    total_requests INTEGER,
    success_count INTEGER,
    error_count INTEGER,
    avg_input_tokens DECIMAL(10, 2),
    avg_output_tokens DECIMAL(10, 2),
    avg_cost DECIMAL(10, 6),
    total_cost DECIMAL(10, 4),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(model_id, task_type, period_type, period_date)
);
```

## 索引设计
```sql
-- 提高查询性能的索引
CREATE INDEX idx_knowledge_records_created_at ON knowledge_records(created_at DESC);
CREATE INDEX idx_api_request_logs_created_at ON api_request_logs(created_at DESC);
CREATE INDEX idx_api_request_logs_model_id ON api_request_logs(model_id);
CREATE INDEX idx_api_request_logs_request_type ON api_request_logs(request_type);
CREATE INDEX idx_chapters_outline_id ON chapters(outline_id);
CREATE INDEX idx_quizzes_chapter_id ON quizzes(chapter_id);
CREATE INDEX idx_model_performance_stats_lookup ON model_performance_stats(model_id, task_type, period_type, period_date);
```

## 未来扩展考虑

### 用户系统集成（V2）
如果要添加用户系统，只需：
1. 创建 users 表
2. 在 knowledge_records 表中添加 user_id 外键
3. 在 prompt_templates 表中添加 user_id（支持用户自定义模板）
4. 添加相应的索引

这样的改动成本很小，不会影响现有的表结构设计。



