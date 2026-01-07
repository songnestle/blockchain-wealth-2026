# Gemini API 故障排除指南

## 常见错误及解决方案

### 错误 1: 404 Model Not Found

**错误信息：**
```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404] models/gemini-1.5-flash is not found for API version v1beta
```

**原因：**
模型名称不正确。Gemini API 的模型名称需要包含版本后缀。

**解决方案：**
✅ 已修复！将模型名称从 `gemini-1.5-flash` 改为 `gemini-1.5-flash-latest`

**可用的模型名称：**
- `gemini-1.5-flash-latest` - 最新的 Flash 模型（推荐）
- `gemini-1.5-pro-latest` - 最新的 Pro 模型（更强大但更慢）
- `gemini-pro` - 旧版 Pro 模型
- `gemini-pro-vision` - 旧版视觉模型

---

### 错误 2: 401 Unauthorized

**错误信息：**
```
[GoogleGenerativeAI Error]: [401] API key not valid
```

**原因：**
API Key 无效、过期或未正确配置。

**解决方案：**
1. 访问 https://aistudio.google.com/app/apikey
2. 检查 API Key 是否正确
3. 重新生成新的 API Key
4. 在系统中重新输入

---

### 错误 3: 429 Too Many Requests

**错误信息：**
```
[GoogleGenerativeAI Error]: [429] Resource has been exhausted
```

**原因：**
超出 API 调用频率限制。

**免费额度限制：**
- 60 requests/minute
- 1500 requests/day

**解决方案：**
1. 等待 1 分钟后重试
2. 升级到付费计划
3. 切换到 DeepSeek API

---

### 错误 4: 400 Bad Request

**错误信息：**
```
[GoogleGenerativeAI Error]: [400] Invalid request
```

**可能原因：**
1. 图片格式不支持
2. 图片太大（>4MB）
3. 提示词格式错误

**解决方案：**
1. 确保图片格式为 JPG/PNG/WebP
2. 压缩图片到 4MB 以下
3. 检查提示词是否包含特殊字符

---

### 错误 5: 500 Internal Server Error

**错误信息：**
```
[GoogleGenerativeAI Error]: [500] Internal server error
```

**原因：**
Google 服务器临时故障。

**解决方案：**
1. 等待几分钟后重试
2. 检查 Google API 状态页面
3. 临时切换到 DeepSeek API

---

## 调试技巧

### 1. 查看控制台日志

打开浏览器开发者工具（F12），查看 Console 标签：
```javascript
console.log('Gemini API 原始响应:', text)
console.error('Gemini API 调用失败:', error)
```

### 2. 测试 API Key

使用 curl 命令测试：
```bash
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY"
```

### 3. 检查网络连接

确保可以访问 Google 服务：
```bash
ping generativelanguage.googleapis.com
```

---

## 性能优化

### 1. 减少图片大小

```javascript
// 压缩图片到合适大小
const MAX_SIZE = 4 * 1024 * 1024 // 4MB
if (file.size > MAX_SIZE) {
  // 提示用户压缩图片
}
```

### 2. 使用批量请求

如果有多张截图，一次性发送而不是分批：
```javascript
const imageParts = await Promise.all(
  imageFiles.map(async (file) => {
    // 转换所有图片
  })
)
```

### 3. 添加重试机制

```javascript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

---

## API 配额管理

### 免费额度

| 限制类型 | 额度 |
|---------|------|
| 每分钟请求数 | 60 |
| 每天请求数 | 1500 |
| 每分钟 tokens | 32,000 |
| 每天 tokens | 50,000 |

### 监控使用量

访问 Google AI Studio 查看使用统计：
https://aistudio.google.com/app/apikey

---

## 切换到备用方案

如果 Gemini API 持续出现问题：

### 方案 1: 使用 DeepSeek API
1. 在 Step 1 切换到 "DeepSeek"
2. 输入 DeepSeek API Key
3. 使用手动模式处理截图
4. 使用 DeepSeek 生成报告

### 方案 2: 完全手动模式
1. 使用 ChatGPT/Claude 处理截图
2. 手动粘贴 JSON 数据
3. 使用 ChatGPT/Claude 生成报告
4. 手动粘贴最终报告

---

## 联系支持

如果问题仍未解决：

1. **Google AI Studio 支持**
   - https://aistudio.google.com/app/help

2. **GitHub Issues**
   - 提交问题到项目仓库

3. **社区论坛**
   - Stack Overflow: `google-gemini-api`

---

## 更新日志

### 2026-01-07
- ✅ 修复：将模型名称从 `gemini-1.5-flash` 改为 `gemini-1.5-flash-latest`
- ✅ 添加：详细的错误处理和提示
- ✅ 添加：故障排除文档

---

## 快速检查清单

遇到问题时，按顺序检查：

- [ ] API Key 是否正确输入
- [ ] 网络连接是否正常
- [ ] 是否超出 API 配额
- [ ] 图片格式和大小是否符合要求
- [ ] 浏览器控制台是否有错误信息
- [ ] 是否使用了正确的模型名称
- [ ] Google API 服务是否正常运行

如果所有检查都通过但仍有问题，请切换到 DeepSeek API 或手动模式。
