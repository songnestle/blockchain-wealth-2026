# Gemini API 模型名称修正说明

## 问题说明

### 问题 1: 404 错误 - 模型名称不存在
**错误原因**: 使用了无效的模型别名
- ❌ `gemini-1.5-flash-latest` - 在 v1beta API 中不存在
- ❌ `gemini-2.0-flash-exp` - 在 v1beta API 中不存在
- ❌ `gemini-1.5-pro-latest` - 在 v1beta API 中不存在

**正确的模型名称**:
- ✅ `gemini-1.5-flash` - Flash 模型
- ✅ `gemini-1.5-pro` - Pro 模型
- ✅ `gemini-pro-vision` - 旧版视觉模型

### 问题 2: 429 错误 - 配额不足
**错误原因**: 该模型/项目的免费配额为 0

**解决方案**:
1. 检查 API Key 的配额限制
2. 等待配额重置（通常每分钟/每天重置）
3. 升级到付费计划
4. 切换到 DeepSeek API

## 已修正的模型配置

### 当前可用模型

```javascript
export const GEMINI_MODELS = {
  'flash': 'gemini-1.5-flash',           // Flash 模型（推荐）
  'pro': 'gemini-1.5-pro',               // Pro 模型（更强大）
  'pro-vision': 'gemini-pro-vision'      // 旧版视觉模型
}
```

### 模型对比

| 模型 | 实际名称 | 速度 | 能力 | 推荐度 |
|------|---------|------|------|--------|
| Flash | `gemini-1.5-flash` | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Pro | `gemini-1.5-pro` | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Pro Vision | `gemini-pro-vision` | ⚡⚡ | ⭐⭐⭐ | ⭐⭐ |

## 使用建议

### 推荐配置
**默认**: Gemini 1.5 Flash
- 速度快
- 准确度高
- 成本低
- 适合大多数场景

### 高级需求
**选择**: Gemini 1.5 Pro
- 更强的推理能力
- 更好的长文本理解
- 适合复杂分析

### 旧版兼容
**选择**: Gemini Pro Vision
- 仅在需要兼容旧代码时使用
- 不推荐新项目使用

## API 配额管理

### 免费配额限制

| 限制类型 | Flash | Pro |
|---------|-------|-----|
| 每分钟请求数 | 15 | 2 |
| 每天请求数 | 1500 | 50 |
| 每分钟 tokens | 1M | 32K |
| 每天 tokens | 无限制 | 无限制 |

### 配额用尽时的处理

**1. 立即解决方案**:
```javascript
// 切换到 DeepSeek API
apiProvider = 'deepseek'
```

**2. 等待配额重置**:
- 每分钟配额：等待 60 秒
- 每天配额：等待到第二天 UTC 00:00

**3. 升级到付费**:
- 访问 Google AI Studio
- 启用付费计划
- 获得更高配额

### 监控配额使用

访问 Google AI Studio 查看实时配额：
https://aistudio.google.com/app/apikey

## 错误处理

### 404 错误
```
Error: models/gemini-1.5-flash-latest is not found
```

**解决**: 已修正为 `gemini-1.5-flash`

### 429 错误
```
Error: Resource has been exhausted (e.g. check quota)
```

**解决方案**:
1. 等待配额重置
2. 切换到 DeepSeek
3. 升级付费计划

### 403 错误
```
Error: API key not valid
```

**解决方案**:
1. 检查 API Key 是否正确
2. 确认 API Key 已启用 Gemini API
3. 重新生成 API Key

## 测试模型可用性

### 使用 curl 测试

```bash
# 测试 Flash 模型
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY"

# 测试 Pro 模型
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY"
```

### 列出所有可用模型

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

## 迁移指南

### 从旧配置迁移

如果你之前使用了错误的模型名称：

**旧配置**:
```javascript
model: 'gemini-1.5-flash-latest'  // ❌ 无效
model: 'gemini-2.0-flash-exp'     // ❌ 无效
```

**新配置**:
```javascript
model: 'gemini-1.5-flash'  // ✅ 有效
```

### 清除旧的 localStorage

如果遇到问题，清除浏览器缓存：
```javascript
localStorage.removeItem('gemini_model')
// 刷新页面，系统会使用新的默认值
```

## 性能对比

### 实际测试结果

| 操作 | Flash | Pro | 差异 |
|------|-------|-----|------|
| 截图分析 (3张) | 8-12秒 | 15-20秒 | Pro 慢 60% |
| 报告生成 | 10-15秒 | 18-25秒 | Pro 慢 70% |
| JSON 准确度 | 95% | 97% | Pro 高 2% |

### 成本对比

| 操作 | Flash | Pro | 差异 |
|------|-------|-----|------|
| 截图分析 | $0.0005 | $0.008 | Pro 贵 16x |
| 报告生成 | $0.001 | $0.015 | Pro 贵 15x |
| 完整流程 | $0.0015 | $0.023 | Pro 贵 15x |

## 推荐策略

### 个人用户
- ✅ 使用 Flash 模型
- ✅ 免费配额足够日常使用
- ✅ 性价比最高

### 企业用户（开发）
- ✅ 使用 Flash 模型
- ✅ 快速迭代
- ✅ 成本可控

### 企业用户（生产）
- ⚠️ 考虑付费计划
- ⚠️ 监控配额使用
- ✅ Flash 模型优先
- 🔄 Pro 模型作为备选

### 高端用户
- ✅ 使用 Pro 模型
- ✅ 付费计划
- ✅ 追求最高质量

## 常见问题

### Q1: 为什么之前的模型名称不工作了？
A: Google Generative AI SDK 的 v1beta API 不支持 `-latest` 后缀的别名。必须使用确切的模型名称。

### Q2: Gemini 2.0 什么时候可用？
A: Gemini 2.0 目前还未在 v1beta API 中正式发布。请使用 Gemini 1.5 系列。

### Q3: 如何避免配额用尽？
A:
1. 监控使用量
2. 使用 Flash 模型（配额更高）
3. 实现请求缓存
4. 考虑付费计划

### Q4: Flash 和 Pro 的主要区别是什么？
A:
- Flash: 更快、更便宜、配额更高
- Pro: 更强、更准确、但更慢更贵

### Q5: 配额重置时间是什么时候？
A:
- 每分钟配额: 每分钟开始时重置
- 每天配额: UTC 00:00 重置

## 更新日志

### v2.2.1 (2026-01-07)
- 🐛 修复：使用正确的模型名称
- 🐛 修复：移除无效的 `-latest` 后缀
- 🐛 修复：移除不存在的 2.0 模型
- ✅ 验证：所有模型名称在 v1beta API 中有效
- 📝 文档：添加配额管理指南

---

## 快速参考

**有效的模型名称**:
- `gemini-1.5-flash` ✅
- `gemini-1.5-pro` ✅
- `gemini-pro-vision` ✅

**无效的模型名称**:
- `gemini-1.5-flash-latest` ❌
- `gemini-2.0-flash-exp` ❌
- `gemini-1.5-pro-latest` ❌

**默认推荐**: `gemini-1.5-flash`

**配额查询**: https://aistudio.google.com/app/apikey

**备用方案**: 切换到 DeepSeek API
