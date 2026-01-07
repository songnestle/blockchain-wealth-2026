/**
 * DeepSeek API 集成
 * 使用 DeepSeek API 分析截图和生成报告
 */

/**
 * 使用 DeepSeek API 分析截图并提取交易数据
 */
export async function analyzeScreenshotsWithDeepSeek(imageFiles, prompt, apiKey) {
  if (!apiKey) {
    throw new Error('请先配置 DeepSeek API Key')
  }

  // DeepSeek 目前不支持图片输入，返回提示信息
  throw new Error('DeepSeek API 暂不支持图片分析，请使用 Gemini API 或手动模式')
}

/**
 * 使用 DeepSeek API 生成融合预测报告
 */
export async function generateReportWithDeepSeek(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('请先配置 DeepSeek API Key')
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`DeepSeek API 调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      throw new Error('DeepSeek API 返回数据格式错误')
    }

    console.log('DeepSeek API 原始响应:', text)
    return text
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error)
    throw new Error(`DeepSeek API 调用失败: ${error.message}`)
  }
}
