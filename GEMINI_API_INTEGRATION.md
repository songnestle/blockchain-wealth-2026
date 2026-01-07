# Gemini API 集成说明

## 功能概述

已完成 Google Gemini API 集成，用户现在可以选择两种模式：

### 🤖 自动模式（推荐）
- 使用 Gemini Vision API 自动分析截图
- 使用 Gemini API 自动生成融合报告
- 无需手动复制粘贴
- 一键完成整个流程

### 📋 手动模式
- 复制提示词到 ChatGPT/Claude
- 手动粘贴 AI 返回的 JSON
- 适合没有 Gemini API Key 的用户

## 使用步骤

### 1. 获取 Gemini API Key

访问：https://aistudio.google.com/app/apikey

- 登录 Google 账号
- 创建新的 API Key
- 复制 API Key

### 2. 配置 API Key

在 Step 1（上传截图）页面：
- 找到 "🔑 Gemini API Key" 输入框
- 粘贴你的 API Key
- API Key 会自动保存到浏览器 localStorage

### 3. 自动分析截图（Step 1）

上传交易截图后：
- 点击 "🤖 AI自动分析截图 (推荐)" 按钮
- 等待 AI 处理（通常 5-10 秒）
- 自动提取交易数据
- 显示数据摘要

### 4. 自动生成报告（Step 3）

输入八字信息后：
- 点击 "🤖 AI自动生成完整报告 (推荐)" 按钮
- 等待 AI 生成融合报告（通常 10-20 秒）
- 自动跳转到结果页面
- 显示完整的 2026 年度预测

## 技术实现

### 新增文件

#### `/frontend/src/utils/geminiApi.js`
```javascript
// 截图分析函数
export async function analyzeScreenshotsWithGemini(imageFiles, prompt, apiKey)

// 报告生成函数
export async function generateReportWithGemini(prompt, apiKey)
```

### 修改文件

#### `/frontend/src/components/IntegratedInput.jsx`

新增功能：
- `geminiApiKey` state - 存储 API Key
- `handleAutoAnalyzeScreenshots()` - 自动分析截图
- `handleAutoGenerateReport()` - 自动生成报告
- `loading` state - 显示加载状态
- Loading overlay - 全屏加载提示

UI 改进：
- API Key 输入框（密码类型）
- "AI自动分析" 按钮（Step 1）
- "AI自动生成报告" 按钮（Step 3）
- 手动模式折叠面板（`<details>`）
- 加载动画遮罩层

## API 调用流程

### Step 1: 截图分析

```
用户上传截图
  ↓
点击 "AI自动分析截图"
  ↓
调用 analyzeScreenshotsWithGemini()
  ↓
将图片转为 base64
  ↓
发送到 Gemini Vision API
  ↓
返回 JSON 文本
  ↓
extractAndCleanJSON() 清理
  ↓
parseJSON() 解析
  ↓
validateTradingData() 验证
  ↓
setExtractedData() 保存
  ↓
显示数据摘要
```

### Step 3: 报告生成

```
用户输入八字信息
  ↓
点击 "AI自动生成完整报告"
  ↓
调用 generateReportWithGemini()
  ↓
发送融合提示词到 Gemini API
  ↓
返回完整报告 JSON
  ↓
extractAndCleanJSON() 清理
  ↓
parseJSON() 解析
  ↓
validateReportData() 验证
  ↓
转换为 reportData 格式
  ↓
onGenerateReport() 回调
  ↓
显示完整报告
```

## 错误处理

所有 API 调用都包含完整的错误处理：

1. **API Key 检查**
   - 如果未配置，显示错误提示

2. **数据验证**
   - 截图必须上传
   - JSON 格式必须正确

3. **网络错误**
   - 捕获 API 调用失败
   - 显示详细错误信息

4. **JSON 解析错误**
   - 使用 `jsonParser.js` 清理和解析
   - 提供详细的错误位置信息

## 用户体验优化

1. **加载状态**
   - 全屏遮罩层
   - 动画提示
   - 禁用按钮防止重复点击

2. **API Key 持久化**
   - 自动保存到 localStorage
   - 下次访问自动填充

3. **模式切换**
   - 自动模式优先显示
   - 手动模式折叠隐藏
   - 用户可自由选择

4. **错误提示**
   - 清晰的错误信息
   - 建议解决方案
   - 不影响手动模式使用

## 成本估算

Gemini API 定价（2026年1月）：
- gemini-1.5-flash: 免费额度充足
- 每次截图分析：约 0.001-0.01 USD
- 每次报告生成：约 0.01-0.05 USD

建议：
- 个人使用完全免费
- 大量使用可考虑付费计划

## 安全性

1. **API Key 存储**
   - 仅存储在浏览器 localStorage
   - 不发送到后端服务器
   - 用户完全控制

2. **数据隐私**
   - 截图直接发送到 Google Gemini
   - 不经过第三方服务器
   - 符合 Google 隐私政策

## 兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 已知限制

1. **图片大小**
   - 单张图片建议 < 4MB
   - 总大小建议 < 20MB

2. **API 限制**
   - 免费额度：60 requests/minute
   - 超出后需等待或升级

3. **识别准确度**
   - 依赖截图清晰度
   - 复杂表格可能需要手动调整

## 下一步优化

- [ ] 添加批量截图处理进度条
- [ ] 支持更多 AI 模型（Claude API, OpenAI API）
- [ ] 添�� API 调用历史记录
- [ ] 优化提示词以提高准确度
- [ ] 添加结果编辑功能

## 测试建议

1. 准备测试截图（交易记录或年度报告）
2. 获取 Gemini API Key
3. 测试 Step 1 自动分析
4. 测试 Step 3 自动生成
5. 对比手动模式结果
6. 验证数据准确性
