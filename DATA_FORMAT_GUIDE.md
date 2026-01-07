# 📊 数据上传格式说明

## CSV 文件格式要求

你的CSV文件必须包含以下列（顺序可以不同）：

```csv
Date,Type,Asset,Amount,Price,Total,Fee
2025-01-15,Buy,BTC,0.5,42000,21000,10.5
2025-02-10,Buy,ETH,5,2800,14000,7
2025-03-05,Sell,BTC,0.2,45000,9000,4.5
```

### 字段说明

| 字段 | 说明 | 示例 | 必填 |
|------|------|------|------|
| Date | 交易日期 | 2025-01-15 | ✅ |
| Type | 交易类型 | Buy / Sell | ✅ |
| Asset | 资产名称 | BTC, ETH, USDT | ✅ |
| Amount | 交易数量 | 0.5 | ✅ |
| Price | 单价 | 42000 | ✅ |
| Total | 总金额 | 21000 | ✅ |
| Fee | 手续费 | 10.5 | ✅ |

## 示例文件

我已经为你创建了一个示例文件：
`/Users/nestle/blockchain-wealth-2026/test-data.csv`

你可以直接使用这个文件测试上传功能。

## 如何上传

1. 打开浏览器访问: http://localhost:3000
2. 在"数据导入"区域点击"选择文件"
3. 选择你的CSV文件
4. 选择交易所（如 Binance, OKX, Coinbase 等）
5. 点击"上传"

## 常见问题

### 问题1: "Request failed with status code 404"

**原因**: 前端无法连接到后端API

**解决方案**:

1. 确认后端正在运行:
```bash
lsof -i :5001
```

2. 如果后端没运行，启动它:
```bash
cd /Users/nestle/blockchain-wealth-2026/backend
python3 app.py
```

3. 确认前端正在运行:
```bash
cd /Users/nestle/blockchain-wealth-2026/frontend
npm run dev
```

4. 检查浏览器控制台的错误信息

### 问题2: CORS 错误

**解决方案**: 后端已配置CORS，如果仍有问题，重启后端服务

### 问题3: 文件格式错误

**解决方案**:
- 确保CSV文件是UTF-8编码
- 确保包含所有必需字段
- 检查日期格式是否正确 (YYYY-MM-DD)

## 测试上传

你可以用以下命令测试上传功能:

```bash
curl -X POST http://localhost:5001/api/upload \
  -F "file=@/Users/nestle/blockchain-wealth-2026/test-data.csv" \
  -F "exchange=binance"
```

预期返回:
```json
{
  "success": true,
  "records": 12,
  "message": "Successfully processed 12 transactions"
}
```

## 支持的交易所格式

目前支持通用CSV格式，适用于:
- Binance
- OKX
- Coinbase
- Kraken
- 其他主流交易所

如果你的交易所导出格式不同，请提供样例，我可以帮你调整。
