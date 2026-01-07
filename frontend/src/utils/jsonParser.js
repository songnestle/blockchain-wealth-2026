/**
 * 从文本中提取并清理 JSON
 * 处理 AI 返回的各种格式问题
 */
export function extractAndCleanJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('输入文本为���或格式不正确')
  }

  let jsonContent = text.trim()

  // 1. 提取 markdown 代码块中的内容（支持多种格式）
  const codeBlockPatterns = [
    /```json\s*([\s\S]*?)```/,
    /```\s*([\s\S]*?)```/,
    /`([\s\S]*?)`/
  ]

  for (const pattern of codeBlockPatterns) {
    const match = jsonContent.match(pattern)
    if (match) {
      jsonContent = match[1].trim()
      break
    }
  }

  // 2. 移除单行注释 (// ...)
  jsonContent = jsonContent.replace(/\/\/.*$/gm, '')

  // 3. 移除多行注释 (/* ... */)
  jsonContent = jsonContent.replace(/\/\*[\s\S]*?\*\//g, '')

  // 4. 移除 AI 常见的解释性文本
  // 移除 "Here is the JSON:" 等开头
  jsonContent = jsonContent.replace(/^.*?(?=\{)/s, '')

  // 移除结尾的解释文本
  jsonContent = jsonContent.replace(/\}[^}]*$/s, '}')

  // 5. 查找第一个 { 和最后一个 }
  const firstBrace = jsonContent.indexOf('{')
  const lastBrace = jsonContent.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error('未找到有效的 JSON 对象（缺少 { 或 }）\n\n请确保粘贴的是完整的 JSON 数据')
  }

  jsonContent = jsonContent.substring(firstBrace, lastBrace + 1)

  // 6. 移除尾随逗号（JSON 标准不允许）
  jsonContent = jsonContent.replace(/,(\s*[}\]])/g, '$1')

  // 7. 替换单引号为双引号（仅在属性名位置）
  // 这个比较危险，但可以尝试
  jsonContent = jsonContent.replace(/'([^']+)':/g, '"$1":')

  // 8. 移除多余的空白字符
  jsonContent = jsonContent.replace(/\s+/g, ' ').trim()

  return jsonContent
}

/**
 * 解析并验证 JSON
 */
export function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    // 提供更详细的错误信息
    const lines = jsonString.split('\n')
    const errorMatch = error.message.match(/position (\d+)/)

    if (errorMatch) {
      const position = parseInt(errorMatch[1])
      let currentPos = 0
      let lineNum = 0
      let charNum = 0

      for (let i = 0; i < lines.length; i++) {
        if (currentPos + lines[i].length >= position) {
          lineNum = i + 1
          charNum = position - currentPos
          break
        }
        currentPos += lines[i].length + 1
      }

      const errorLine = lines[lineNum - 1] || ''
      const preview = errorLine.substring(Math.max(0, charNum - 20), charNum + 20)

      throw new Error(
        `JSON 解析失败（第 ${lineNum} 行，第 ${charNum} 字符）\n\n` +
        `错误位置附近: ...${preview}...\n\n` +
        `原始错误: ${error.message}\n\n` +
        `常见问题：\n` +
        `- 属性名必须用双引号 "name": value\n` +
        `- 不能有尾随逗号 {"a": 1,}\n` +
        `- 字符串必须用双引号 "text"\n` +
        `- 不能有注释 // 或 /* */`
      )
    }

    throw new Error(`JSON 解析失败：${error.message}`)
  }
}

/**
 * 验证交易数据 JSON 结构
 */
export function validateTradingData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('数据格式不正确：不是有效的对象')
  }

  if (!data.summary || typeof data.summary !== 'object') {
    throw new Error('数据格式不正确：缺少 summary 对象')
  }

  // transactions 可以为空数组（年度摘要模式）
  if (!data.transactions) {
    data.transactions = []
  }

  if (!Array.isArray(data.transactions)) {
    throw new Error('数据格式不正确：transactions 必须是数组')
  }

  return data
}

/**
 * 验证最终报告 JSON 结构
 */
export function validateReportData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('数据格式不正确：不是有效的对象')
  }

  if (!data.life_kline || !Array.isArray(data.life_kline)) {
    throw new Error('数据格式不正确：缺少 life_kline 数组')
  }

  if (data.life_kline.length !== 12) {
    throw new Error('数据不完整：需要12个月的数据')
  }

  return data
}
