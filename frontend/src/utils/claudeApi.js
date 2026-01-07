/**
 * Claude API 集成
 * 使用 Anthropic Claude API 分析截图和生成报告
 */

// 可用的 Claude 模型
export const CLAUDE_MODELS = {
  'sonnet': 'claude-3-5-sonnet-20241022',    // Sonnet 3.5 (推荐)
  'opus': 'claude-3-opus-20240229',          // Opus 3 (最强)
  'haiku': 'claude-3-haiku-20240307'         // Haiku 3 (最快)
}

export const CLAUDE_MODEL_NAMES = {
  'sonnet': 'Claude 3.5 Sonnet (推荐)',
  'opus': 'Claude 3 Opus (最强)',
  'haiku': 'Claude 3 Haiku (最快)'
}

/**
 * 使用 Claude API 分析截图并提取交易数据
 */
export async function analyzeScreenshotsWithClaude(imageFiles, prompt, apiKey, modelKey = 'sonnet') {
  if (!apiKey) {
    throw new Error('请先配置 Claude API Key')
  }

  const modelName = CLAUDE_MODELS[modelKey] || CLAUDE_MODELS['sonnet']

  // 将图片文件转换为 base64
  const imageParts = await Promise.all(
    imageFiles.map(async (file) => {
      const base64 = await fileToBase64(file)
      const base64Data = base64.split(',')[1]

      // 获取 media type
      let mediaType = 'image/jpeg'
      if (file.type === 'image/png') mediaType = 'image/png'
      else if (file.type === 'image/webp') mediaType = 'image/webp'
      else if (file.type === 'image/gif') mediaType = 'image/gif'

      return {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data
        }
      }
    })
  )

  // 构建消息内容
  const content = [
    {
      type: 'text',
      text: prompt
    },
    ...imageParts
  ]

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: content
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Claude API 调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) {
      throw new Error('Claude API 返回数据格式错误')
    }

    console.log('Claude API 原始响应:', text)
    return text
  } catch (error) {
    console.error('Claude API 调用失败:', error)
    throw new Error(`Claude API 调用失败: ${error.message}`)
  }
}

/**
 * 使用 Claude API 生成融合预测报告
 */
export async function generateReportWithClaude(prompt, apiKey, modelKey = 'sonnet') {
  if (!apiKey) {
    throw new Error('请先配置 Claude API Key')
  }

  const modelName = CLAUDE_MODELS[modelKey] || CLAUDE_MODELS['sonnet']

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Claude API 调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text

    if (!text) {
      throw new Error('Claude API 返回数据格式错误')
    }

    console.log('Claude API 原始响应:', text)
    return text
  } catch (error) {
    console.error('Claude API 调用失败:', error)
    throw new Error(`Claude API 调用失败: ${error.message}`)
  }
}

/**
 * 将文件转换为 base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
