import { useState } from 'react'
import { WEALTH_PREDICTION_PROMPT } from '../constants'
import './AIPromptGenerator.css'

function AIPromptGenerator({ transactionData, onAIDataImport }) {
  const [step, setStep] = useState(1)
  const [jsonInput, setJsonInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const generateUserPrompt = () => {
    const summary = transactionData ? `
【交易历史摘要】
总交易笔数: ${transactionData.totalTrades || 0}
交易资产: ${transactionData.assets?.join(', ') || '未知'}
交易时间范围: ${transactionData.dateRange || '未知'}
总投入: $${transactionData.totalInvestment?.toFixed(2) || 0}
当前价值: $${transactionData.currentValue?.toFixed(2) || 0}
盈亏: ${transactionData.profitLoss >= 0 ? '+' : ''}$${transactionData.profitLoss?.toFixed(2) || 0}
` : '【无交易历史数据】'

    return `${summary}

任务：
1. 分析上述交易历史，识别交易风格和风险偏好
2. 生成2026年1-12月的财富预测K线数据
3. 在 reason 字段中提供每月的投资建议
4. 生成带评分的投资分析报告

请严格按照系统指令生成 JSON 数据。务必只返回纯JSON格式数据，不要包含任何markdown代码块标记或其他文字说明。`
  }

  const copyFullPrompt = async () => {
    const fullPrompt = `=== 系统指令 (System Prompt) ===\n\n${WEALTH_PREDICTION_PROMPT}\n\n=== 用户数据 (User Data) ===\n\n${generateUserPrompt()}`

    try {
      await navigator.clipboard.writeText(fullPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败', err)
    }
  }

  const handleImport = () => {
    setError(null)

    if (!jsonInput.trim()) {
      setError('请粘贴 AI 返回的 JSON 数据')
      return
    }

    try {
      let jsonContent = jsonInput.trim()

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

      const data = JSON.parse(jsonContent)

      if (!data.chartPoints || !Array.isArray(data.chartPoints)) {
        throw new Error('数据格式不正确：缺少 chartPoints 数组')
      }

      if (data.chartPoints.length !== 12) {
        throw new Error('数据不完整：需要12个月的数据')
      }

      // 转换为应用所需格式
      const prediction = {
        predictions: {
          p50: data.chartPoints.map(p => ({ month: p.month, value: p.close })),
          p10: data.chartPoints.map(p => ({ month: p.month, value: p.low })),
          p90: data.chartPoints.map(p => ({ month: p.month, value: p.high }))
        },
        analysis: {
          tradingStyle: data.tradingStyle || '未知',
          riskProfile: data.riskProfile || '未知',
          profitPattern: data.profitPattern || '未知',
          marketTiming: data.marketTiming || '未知',
          recommendation: data.recommendation || '未知',
          bestMonth: data.bestMonth || '未知',
          worstMonth: data.worstMonth || '未知'
        },
        cost_analysis: {
          total_fees: 0,
          avg_fee_per_tx: 0,
          breakdown: {}
        }
      }

      onAIDataImport(prediction)
    } catch (err) {
      setError(`解析失败：${err.message}`)
    }
  }

  return (
    <div className="ai-prompt-generator">
      <div className="step-indicator">
        {[1, 2].map(s => (
          <div key={s} className={`step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="step-content">
          <h3>🤖 AI智能预测</h3>
          <p className="desc">使用AI大模型生成个性化的2026年财富预测</p>

          <div className="prompt-preview">
            <h4>📝 提示词预览</h4>
            <pre>{generateUserPrompt().substring(0, 300)}...</pre>
          </div>

          <button onClick={copyFullPrompt} className={`copy-btn ${copied ? 'copied' : ''}`}>
            {copied ? '✓ 已复制' : '📋 复制完整提示词'}
          </button>

          <div className="instructions">
            <h4>使用说明</h4>
            <ol>
              <li>点击上方按钮复制提示词</li>
              <li>打开 ChatGPT、Claude 或 Gemini</li>
              <li>粘贴提示词并发送</li>
              <li>复制 AI 的 JSON 回复</li>
              <li>返回这里导入数据</li>
            </ol>
          </div>

          <button onClick={() => setStep(2)} className="next-btn">
            下一步：导入AI预测 →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h3>📥 导入AI预测</h3>
          <p className="desc">粘贴AI返回的JSON数据</p>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='粘贴 AI 返回的 JSON 数据...\n\n例如:\n{\n  "tradingStyle": "...",\n  "chartPoints": [...],\n  ...\n}'
            className="json-input"
          />

          {error && <div className="error">{error}</div>}

          <div className="button-group">
            <button onClick={() => setStep(1)} className="back-btn">
              ← 上一步
            </button>
            <button onClick={handleImport} className="import-btn">
              ✨ 生成预测图表
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIPromptGenerator
