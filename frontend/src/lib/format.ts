/**
 * 格式化工具函数
 */

/**
 * 格式化价格显示
 * @param cost - 费用（美元）
 * @returns 格式化后的价格字符串
 */
export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.001) return '<$0.001';
  return `$${cost.toFixed(4)}`;
}

/**
 * 格式化成本计算详情
 * @param inputTokens - 输入Token数量
 * @param outputTokens - 输出Token数量
 * @param inputPrice - 输入Token单价（每百万个）
 * @param outputPrice - 输出Token单价（每百万个）
 * @returns 成本计算详情字符串
 */
export function formatCostDetails(
  inputTokens: number, 
  outputTokens: number, 
  inputPrice: number, 
  outputPrice: number
): string {
  const inputCost = (inputTokens / 1000000) * inputPrice;
  const outputCost = (outputTokens / 1000000) * outputPrice;
  const totalCost = inputCost + outputCost;
  
  return `输入: ${formatTokens(inputTokens)} × $${inputPrice.toFixed(1)}/1M = ${formatCost(inputCost)}\n` +
         `输出: ${formatTokens(outputTokens)} × $${outputPrice.toFixed(1)}/1M = ${formatCost(outputCost)}\n` +
         `总计: ${formatCost(totalCost)}`;
}

/**
 * 格式化Token数量
 * @param tokens - Token数量
 * @returns 格式化后的Token字符串
 */
export function formatTokens(tokens: number): string {
  if (tokens === 0) return '0';
  if (tokens < 1000) return tokens.toString();
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(1)}M`;
}

/**
 * 格式化输入输出Token
 * @param inputTokens - 输入Token数量
 * @param outputTokens - 输出Token数量
 * @returns 格式化后的Token字符串
 */
export function formatInputOutputTokens(inputTokens: number, outputTokens: number): string {
  return `${formatTokens(inputTokens)} / ${formatTokens(outputTokens)}`;
}

/**
 * 格式化时间（毫秒转换为易读格式）
 * @param timeMs - 时间（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTime(timeMs: number): string {
  if (timeMs === 0) return '0ms';
  if (timeMs < 1000) return `${timeMs}ms`;
  if (timeMs < 60000) return `${(timeMs / 1000).toFixed(1)}s`;
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * 格式化完成率
 * @param rate - 完成率（百分比）
 * @returns 格式化后的完成率字符串
 */
export function formatCompletionRate(rate: number): string {
  if (rate === 100) return '100%';
  if (rate === 0) return '0%';
  return `${rate.toFixed(1)}%`;
}

/**
 * 获取状态对应的颜色类名
 * @param status - 状态
 * @returns Tailwind CSS 类名
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'generating':
      return 'text-blue-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * 获取状态对应的中文文本
 * @param status - 状态
 * @returns 中文状态文本
 */
export function getStatusText(status: string): string {
  switch (status) {
    case 'completed':
      return '已完成';
    case 'generating':
      return '生成中';
    case 'failed':
      return '失败';
    case 'pending':
      return '待处理';
    default:
      return '未知';
  }
}