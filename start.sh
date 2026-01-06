#!/bin/bash

echo "🚀 启动 2026 区块链年度财富曲线系统"
echo ""

# 启动后端
echo "📊 启动后端服务..."
cd backend
python3 app.py &
BACKEND_PID=$!
echo "后端服务已启动 (PID: $BACKEND_PID)"

# 等待后端启动
sleep 3

# 启动前端
echo ""
echo "🎨 启动前端服务..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "前端服务已启动 (PID: $FRONTEND_PID)"

echo ""
echo "✅ 系统启动完成!"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端API: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait
