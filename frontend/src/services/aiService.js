import { GoogleGenerativeAI } from '@google/generative-ai'

// AI 服务配置
const AI_PROVIDERS = {
  GEMINI: 'gemini',
  QWEN: 'qwen'
}

// Gemini API 集成
class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async generatePrediction(systemPrompt, userPrompt) {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`
    const result = await this.model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()
  }
}

// 阿里千问 API 集成
class QwenService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
  }

  async generatePrediction(systemPrompt, userPrompt) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        input: {
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ]
        },
        parameters: {
          result_format: 'message'
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Qwen API 错误: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.output.choices[0].message.content
  }
}

// 统一的 AI 服务接口
export class AIService {
  constructor(provider, apiKey) {
    this.provider = provider

    switch (provider) {
      case AI_PROVIDERS.GEMINI:
        this.service = new GeminiService(apiKey)
        break
      case AI_PROVIDERS.QWEN:
        this.service = new QwenService(apiKey)
        break
      default:
        throw new Error(`不支持的 AI 提供商: ${provider}`)
    }
  }

  async generatePrediction(systemPrompt, userPrompt) {
    try {
      const response = await this.service.generatePrediction(systemPrompt, userPrompt)
      return this.parseResponse(response)
    } catch (error) {
      throw new Error(`AI 生成失败: ${error.message}`)
    }
  }

  parseResponse(response) {
    let jsonContent = response.trim()

    // 提取 ```json ... ``` 中的内容
    const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim()
    } else {
      const jsonStartIndex = jsonContent.indexOf('{')
      const jsonEndIndex = jsonContent.lastIndexOf('}')
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        jsonContent = jsonContent.substring(jsonStartIndex, jsonEndIndex + 1)
      }
    }

    return JSON.parse(jsonContent)
  }
}

export { AI_PROVIDERS }
