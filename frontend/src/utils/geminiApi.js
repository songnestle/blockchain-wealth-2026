import { GoogleGenerativeAI } from '@google/generative-ai'

// 可用的 Gemini 模型（SDK 支持的模型名称）
export const GEMINI_MODELS = {
  'pro': 'gemini-pro',                   // Pro 模型（稳定）
  'pro-vision': 'gemini-pro-vision',     // 视觉模型（推荐）
  'flash': 'gemini-1.5-flash-latest'     // Flash 模型（实验性）
}

export const GEMINI_MODEL_NAMES = {
  'pro': 'Gemini Pro (推荐)',
  'pro-vision': 'Gemini Pro Vision (图片分析)',
  'flash': 'Gemini 1.5 Flash (实验性)'
}

// 默认使用 Gemini Pro（最稳定）
const DEFAULT_MODEL = GEMINI_MODELS['pro']

/**
 * 使用 Gemini API 分析截图并提取交易数据
 */
export async function analyzeScreenshotsWithGemini(imageFiles, prompt, apiKey, modelKey = 'pro-vision') {
  if (!apiKey) {
    throw new Error('请先配置 Gemini API Key')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // 图片分析必须使用 pro-vision 模型
  const modelName = GEMINI_MODELS['pro-vision']
  const model = genAI.getGenerativeModel({ model: modelName })

  // 将图片文件转换为 base64
  const imageParts = await Promise.all(
    imageFiles.map(async (file) => {
      const base64 = await fileToBase64(file)
      return {
        inlineData: {
          data: base64.split(',')[1], // 移除 data:image/xxx;base64, 前缀
          mimeType: file.type
        }
      }
    })
  )

  // 构建请求内容
  const contents = [
    prompt,
    ...imageParts
  ]

  try {
    const result = await model.generateContent(contents)
    const response = await result.response
    const text = response.text()

    console.log('Gemini API 原始响应:', text)

    return text
  } catch (error) {
    console.error('Gemini API 调用失败:', error)
    throw new Error(`Gemini API 调用失败: ${error.message}`)
  }
}

/**
 * 使用 Gemini API 生成融合预测报告
 */
export async function generateReportWithGemini(prompt, apiKey, modelKey = 'pro') {
  if (!apiKey) {
    throw new Error('请先配置 Gemini API Key')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // 文本生成使用 pro 模型
  const modelName = GEMINI_MODELS[modelKey] || DEFAULT_MODEL
  const model = genAI.getGenerativeModel({ model: modelName })

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('Gemini API 原始响应:', text)

    return text
  } catch (error) {
    console.error('Gemini API 调用失败:', error)
    throw new Error(`Gemini API 调用失败: ${error.message}`)
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
