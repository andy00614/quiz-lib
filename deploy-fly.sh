#!/bin/bash

# Fly.io 部署脚本 - Quiz-Lib Backend
# 使用说明: ./deploy-fly.sh

set -e

echo "🚀 开始部署 Quiz-Lib 到 Fly.io..."

# 检查是否安装了 flyctl
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl 未安装。请先安装: https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# 检查是否已登录
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ 请先登录 Fly.io: flyctl auth login"
    exit 1
fi

# 检查配置文件
if [ ! -f "fly.toml" ]; then
    echo "❌ 找不到 fly.toml 配置文件"
    exit 1
fi

if [ ! -f "nixpacks.toml" ]; then
    echo "❌ 找不到 nixpacks.toml 配置文件"
    exit 1
fi

if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ 找不到 backend/requirements.txt 文件"
    exit 1
fi

echo "✅ 配置文件检查通过"

# 检查环境变量
echo "🔧 检查环境变量..."

REQUIRED_SECRETS=(
    "DATABASE_URL"
    "OPENAI_API_KEY"
    "ANTHROPIC_API_KEY"
    "GOOGLE_API_KEY"
)

echo "请确保以下环境变量已通过 'flyctl secrets set' 命令设置："
for secret in "${REQUIRED_SECRETS[@]}"; do
    echo "  - $secret"
done

read -p "是否已设置所有必需的环境变量? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 请先设置环境变量，例如："
    echo "flyctl secrets set DATABASE_URL='postgresql://user:password@host:port/dbname'"
    echo "flyctl secrets set OPENAI_API_KEY='your-openai-key'"
    echo "flyctl secrets set ANTHROPIC_API_KEY='your-anthropic-key'"
    echo "flyctl secrets set GOOGLE_API_KEY='your-google-key'"
    exit 1
fi

# 部署应用
echo "🚀 开始部署..."

# 部署到 Fly.io
flyctl deploy --verbose

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo ""
    echo "🌐 应用访问地址:"
    flyctl status --verbose
    echo ""
    echo "📝 有用的命令:"
    echo "  查看日志: flyctl logs"
    echo "  查看状态: flyctl status"
    echo "  打开应用: flyctl open"
    echo "  SSH 连接: flyctl ssh console"
else
    echo "❌ 部署失败"
    echo "查看日志: flyctl logs"
    exit 1
fi