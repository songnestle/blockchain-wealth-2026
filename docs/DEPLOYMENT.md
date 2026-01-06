# 部署指南

## 环境要求

- Python 3.8+
- Node.js 16+
- npm 或 yarn

## 安装步骤

### 1. 后端安装

```bash
cd backend
pip install -r requirements.txt
```

### 2. 前端安装

```bash
cd frontend
npm install
```

## 启动服务

### 方式一：使用启动脚本（推荐）

```bash
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

**后端：**
```bash
cd backend
python app.py
```

**前端：**
```bash
cd frontend
npm run dev
```

## 访问地址

- 前端界面: http://localhost:3000
- 后端API: http://localhost:5000

## CSV文件格式

### Binance格式示例
```csv
Date(UTC),Coin,Change,Price
2025-01-01,BTC,0.5,45000
2025-01-02,ETH,2.0,3000
```

### Bybit格式示例
```csv
Time,Coin,Amount,Price,Fee,Type
2025-01-01 10:00:00,BTC,0.5,45000,10,trade
2025-01-02 11:00:00,ETH,2.0,3000,5,trade
```

### 通用格式示例
```csv
timestamp,asset,amount,price,fee
2025-01-01,BTC,0.5,45000,10
2025-01-02,ETH,2.0,3000,5
```

## 使用流程

1. 上传交易所CSV文件
2. 选择对应的交易所类型
3. 设置预测参数（风险偏好、月度投入、最大回撤）
4. 点击"生成预测"
5. 查看2026年度财富预测曲线和成本分析

## 技术栈

**后端：**
- Flask - Web框架
- Pandas - 数据处理
- NumPy - 数值计算

**前端：**
- React - UI框架
- Vite - 构建工具
- Recharts - 图表库
- Axios - HTTP客户端

## 项目结构

```
blockchain-wealth-2026/
├── backend/
│   ├── app.py              # Flask应用入口
│   ├── data_processor.py   # 数据标准化处理
│   ├── predictor.py        # 预测引擎
│   └── requirements.txt    # Python依赖
├── frontend/
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── App.jsx         # 主应用
│   │   └── main.jsx        # 入口文件
│   ├── package.json        # Node依赖
│   └── vite.config.js      # Vite配置
├── start.sh                # 启动脚本
└── README.md               # 项目说明
```

## 核心功能

### 1. 数据标准化
- 支持多交易所CSV格式
- 统一账本结构
- 自动识别字段映射

### 2. 资产轨迹重建
- 历史收益率计算
- 波动率分析
- 成本结构分析

### 3. 情景预测
- P10 悲观情景
- P50 基准情景
- P90 乐观情景

### 4. 可视化展示
- 交互式财富曲线图
- 成本拆解分析
- 风险指标展示

## 注意事项

- 本工具仅用于数据分析和预测参考
- 不构成投资建议
- 预测结果基于历史数据，实际结果可能有差异
- 请妥善保管个人交易数据
