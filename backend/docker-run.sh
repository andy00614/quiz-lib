#!/bin/bash

# Docker运行脚本

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
    echo -e "${RED}错误：.env文件不存在${NC}"
    echo "请创建.env文件并配置必要的环境变量"
    exit 1
fi

# 加载环境变量
export $(cat .env | grep -v '^#' | xargs)

echo -e "${GREEN}启动Docker容器...${NC}"

# 停止并删除旧容器（如果存在）
docker stop quiz-lib-backend 2>/dev/null
docker rm quiz-lib-backend 2>/dev/null

# 运行容器
docker run -d \
    --name quiz-lib-backend \
    -p 8000:8000 \
    --env-file .env \
    -v $(pwd)/logs:/app/logs \
    --restart unless-stopped \
    quiz-lib-backend:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}容器启动成功！${NC}"
    echo -e "${YELLOW}访问地址: http://localhost:8000${NC}"
    echo -e "${YELLOW}API文档: http://localhost:8000/docs${NC}"
    
    # 显示容器状态
    echo -e "\n容器状态:"
    docker ps --filter name=quiz-lib-backend
    
    # 显示日志
    echo -e "\n${YELLOW}查看日志: docker logs -f quiz-lib-backend${NC}"
else
    echo -e "${RED}容器启动失败！${NC}"
    exit 1
fi