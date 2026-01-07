# 🚀 快速开始指南

## 系统概述

**blockchain-wealth-2026** 是一个融合区块链交易数据与中国传统命理学的 2026 年财富预测系统。

## AI 服务商选择

系统支持两种 AI 服务商：

### 🌟 Gemini (Google)
- ✅ 支持图片分析（自动识别截图）
- ✅ 支持文本生成（自动生成报告）
- ✅ 完整自动化流程
- 💰 免费额度充足
- 🔗 获取 API Key: https://aistudio.google.com/app/apikey

### 🚀 DeepSeek (深度求索)
- ❌ 不支持图片分析
- ✅ 支持文本生成（自动生成报告）
- ✅ 中文理解能力更强
- 💰 成本更低
- 🔗 获取 API Key: https://platform.deepseek.com/api_keys

## 两种使用模式

### 🤖 自动模式（推荐）

#### 方案 A: 使用 Gemini（完整自动化）

**优点：**
- ✅ 一键完成，无需手动复制粘贴
- ✅ 速度快，准确度高
- ✅ 支持截图自动识别
- ✅ 完全自动化流程

**步骤：**

1. **获取 Gemini API Key**
   - 访问：https://aistudio.google.com/app/apikey
   - 登录 Google 账号并创建 API Key
   - 复制 API Key

2. **配置系统**
   - 在 Step 1 选择 "Gemini (Google)"
   - 输入 Gemini API Key

3. **使用流程**
   - Step 1: 上传截图 → 点击"AI自动分析截图"
   - Step 2: 输入八字信息
   - Step 3: 点击"使用 Gemini 自动生成完整报告"
   - 查看结果

#### 方案 B: 使用 DeepSeek（部分自动化）

**优点：**
- ✅ 中文理解能力更强
- ✅ 成本更低
- ✅ 报告质量优秀

**限制：**
- ❌ 不支持截图自动识别（需手动模式）

**步骤：**

1. **获取 DeepSeek API Key**
   - 访问：https://platform.deepseek.com/api_keys
   - 注册/登录账号并创建 API Key
   - 复制 API Key

2. **配置系统**
   - 在 Step 1 选择 "DeepSeek (深度求索)"
   - 输入 DeepSeek API Key

3. **使用流程**
   - Step 1: 使用手动模式（复制提示词到 ChatGPT/Claude）
   - Step 2: 输入八字信息
   - Step 3: 点击"使用 DeepSeek 自动生成完整报告"
   - 查看结果

---

### 📋 手动模式 - 使用 ChatGPT/Claude

**优点：**
- ✅ 无需 API Key
- ✅ 可使用任何 AI 工具
- ✅ 完全免费

**步骤：**

1. **启动系统**（同上）

2. **Step 1: 上传截图**
   - 上传交易所账单截图
   - 展开 "📋 手动模式"
   - 点击 "📋 复制AI识别提示词"
   - 打开 ChatGPT 或 Claude
   - 上传截图并粘贴提示词
   - 复制 AI 返回的 JSON
   - 粘贴到输入框
   - 点击 "✅ 导入交易数据"

3. **Step 2: 输入八字**（同上）

4. **Step 3: AI综合分析**
   - 展开 "📋 手动模式"
   - 点击 "📋 复制完整分析提示词"
   - 打开 ChatGPT 或 Claude
   - 粘贴提示词并发送
   - 复制 AI 返回的 JSON
   - 点击"下一步"

5. **Step 4: 导入报告**
   - 粘贴 AI 返回的 JSON
   - 点击 "🔍 预览清理后的JSON"（可选）
   - 点击 "✨ 生成2026年度完整报告"

6. **查看结果**（同上）

---

## 截图要求

### ✅ 推荐截图类型

1. **详细交易记录**
   - 包含日期、时间
   - 包含交易对（如 BTC/USDT）
   - 包含买入/卖出金额
   - 包含盈亏数据

2. **年度报告摘要**
   - 总交易笔数
   - 总盈亏金额
   - 主要交易资产
   - 时间范围

### ⚠️ 注意事项

- 截图清晰，文字可读
- 支持多张截图
- 单张图片 < 4MB
- 支持 JPG, PNG, WebP 格式

---

## 八字信息说明

### 必填信息

- **出生日期**：年、月、日、时（24小时制）
- **四柱干支**：年柱、月柱、日柱、时柱
- **大运信息**：起运年龄、第一步大运

### 如何获取八字

1. **在线排盘工具**
   - 搜索 "八字排盘"
   - 输入出生信息
   - 获取四柱干支

2. **示例**
   ```
   出生日期：1990年5月15日 10时
   年柱：庚午
   月柱：辛巳
   日柱：甲子
   时柱：己巳
   起运年龄：3岁
   第一步大运：壬午
   ```

---

## 常见问题

### Q1: Gemini API Key 在哪里获取？
A: 访问 https://aistudio.google.com/app/apikey，登录 Google 账号即可免费创建。

### Q2: API Key 安全吗？
A: API Key 仅存储在浏览器 localStorage，不会发送到我们的服务器。

### Q3: 自动模式和手动模式有什么区别？
A: 自动模式使用 Gemini API 直接处理，手动模式需要你复制粘贴到 ChatGPT/Claude。

### Q4: 截图识别不准确怎么办？
A: 可以切换到手动模式，或者上传更清晰的截图。

### Q5: 不知道自己的八字怎么办？
A: 使用在线八字排盘工具，输入出生日期即可获取。

### Q6: 系统支持哪些交易所？
A: 支持所有主流交易所（Binance、OKX、Bybit 等），只要截图包含交易数据即可。

### Q7: 可以预测其他年份吗？
A: 当前版本专注于 2026 年预测，未来会支持更多年份。

### Q8: 数据会被保存吗？
A: 所有数据仅在浏览器本地处理，不会上传到服务器。

---

## 技术支持

- **GitHub Issues**: https://github.com/yourusername/blockchain-wealth-2026/issues
- **文档**: 查看项目根目录下的 `GEMINI_API_INTEGRATION.md`

---

## 系统要求

- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js**: 16+
- **Python**: 3.8+

---

## 更新日志

### v2.0.0 (2026-01-07)
- ✨ 新增 Gemini API 自动模式
- ✨ 优化 JSON 解析和错误处理
- ✨ 添加加载动画和状态提示
- 🐛 修复白屏问题
- 🐛 修复数据不显示问题
- 📝 完善文档和使用指南

### v1.0.0 (2026-01-06)
- 🎉 初始版本发布
- ✨ 融合模式：交易数据 + 八字命理
- ✨ K线图可视化
- ✨ 完整年度报告

---

## 开始使用

```bash
# 克隆项目
git clone https://github.com/yourusername/blockchain-wealth-2026.git
cd blockchain-wealth-2026

# 安装依赖
cd backend && pip3 install -r requirements.txt
cd ../frontend && npm install

# 启动系统
# 终端1: 启动后端
cd backend && python3 app.py

# 终端2: 启动前端
cd frontend && npm run dev

# 访问系统
open http://localhost:3001
```

祝你 2026 年财运亨通！🎉
