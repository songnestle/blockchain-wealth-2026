#!/bin/bash
# 使用bash而不是zsh来避免配置问题

echo "🚀 启动 2026 区块链年度财富曲线系统"
echo ""

# 安装后端依赖
echo "📦 安装后端依赖..."
cd /Users/nestle/blockchain-wealth-2026/backend
/usr/local/opt/python@3.13/libexec/bin/pip3 install flask flask-cors pandas numpy python-dateutil 2>&1 | grep -v "Requirement already satisfied" || true

# 启动后端
echo ""
echo "📊 启动后端服务..."
/usr/local/opt/python@3.13/libexec/bin/python3 app.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端服务已启动 (PID: $BACKEND_PID)"

# 等待后端启动
sleep 3

# 安装前端依赖
echo ""
echo "📦 安装前端依赖..."
cd /Users/nestle/blockchain-wealth-2026/frontend
npm install 2>&1 | tail -5

# 启动前端
echo ""
echo "🎨 启动前端服务..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端服务已启动 (PID: $FRONTEND_PID)"

echo ""
echo "✅ 系统启动完成!"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端API: http://localhost:5000"
echo ""
echo "查看日志:"
echo "  后端: tail -f /tmp/backend.log"
echo "  前端: tail -f /tmp/frontend.log"
echo ""
echo "停止服务:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
