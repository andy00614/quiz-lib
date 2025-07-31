#!/bin/bash

# 构建Docker镜像脚本

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始构建Docker镜像...${NC}"

# 检查是否在backend目录
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}错误：请在backend目录下运行此脚本${NC}"
    exit 1
fi

# 构建镜像
docker build -t quiz-lib-backend:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Docker镜像构建成功！${NC}"
    echo "镜像名称: quiz-lib-backend:latest"
    
    # 显示镜像信息
    docker images quiz-lib-backend:latest
else
    echo -e "${RED}Docker镜像构建失败！${NC}"
    exit 1
fi