-- 更新模板类型：将 quiz_outline 改为 outline，移除 test_outline 类型
-- 这个脚本将现有的模板类型从三种简化为两种

-- 1. 将 quiz_outline 类型更新为 outline
UPDATE prompt_templates 
SET type = 'outline' 
WHERE type = 'quiz_outline';

-- 2. 可以选择删除 test_outline 类型的模板，或者将其转换为 outline 类型
-- 选项A：删除 test_outline 类型的模板
DELETE FROM prompt_templates 
WHERE type = 'test_outline';

-- 选项B：如果要保留 test_outline 模板，将其转换为 outline 类型
-- UPDATE prompt_templates 
-- SET type = 'outline' 
-- WHERE type = 'test_outline';

-- 3. 检查更新结果
SELECT type, COUNT(*) as count 
FROM prompt_templates 
GROUP BY type;