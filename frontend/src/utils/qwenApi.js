// 阿里通义千问 API 配置（OpenAI 兼容模式）
export const QWEN_MODELS = {
  'plus': 'qwen-plus',
  'turbo': 'qwen-turbo',
  'max': 'qwen-max'
}

export const QWEN_MODEL_NAMES = {
  'plus': 'Qwen Plus (推荐)',
  'turbo': 'Qwen Turbo (快速)',
  'max': 'Qwen Max (最强)'
}

const QWEN_API_BASE = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

/**
 * 使用千问 API 分析截图并提取交易数据（使用 OpenAI 兼容模式）
 */
export async function analyzeScreenshotsWithQwen(imageFiles, prompt, apiKey) {
  if (!apiKey) {
    throw new Error('请先配置阿里云 API Key')
  }

  // 将图片文件转换为 base64
  const imageContents = await Promise.all(
    imageFiles.map(async (file) => {
      const base64 = await fileToBase64(file)
      return {
        type: 'image_url',
        image_url: {
          url: base64
        }
      }
    })
  )

  // 构建消息内容（文本 + 图片）
  const content = [
    {
      type: 'text',
      text: prompt
    },
    ...imageContents
  ]

  const requestBody = {
    model: 'qwen-vl-plus',
    messages: [
      {
        role: 'user',
        content: content
      }
    ]
  }

  try {
    const response = await fetch(`${QWEN_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`千问 API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      throw new Error('千问 API 返回数据格式错误')
    }

    console.log('千问 API 原始响应:', text)
    return text
  } catch (error) {
    console.error('千问 API 调用失败:', error)
    throw new Error(`千问 API 调用失败: ${error.message}`)
  }
}

/**
 * 使用千问 API 生成融合预测报告（使用 OpenAI 兼容模式）
 */
export async function generateReportWithQwen(prompt, apiKey, modelKey = 'plus') {
  if (!apiKey) {
    throw new Error('请先配置阿里云 API Key')
  }

  const modelName = QWEN_MODELS[modelKey] || QWEN_MODELS['plus']

  const requestBody = {
    model: modelName,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  }

  try {
    const response = await fetch(`${QWEN_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`千问 API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      throw new Error('千问 API 返回数据格式错误')
    }

    console.log('千问 API 原始响应:', text)
    return text
  } catch (error) {
    console.error('千问 API 调用失败:', error)
    throw new Error(`千问 API 调用失败: ${error.message}`)
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
