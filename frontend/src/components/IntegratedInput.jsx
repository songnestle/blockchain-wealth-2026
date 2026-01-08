import { useState, useEffect } from 'react'
import { SCREENSHOT_ANALYSIS_PROMPT, INTEGRATED_FORTUNE_PROMPT, CSV_ANALYSIS_PROMPT } from '../constants'
import { extractAndCleanJSON, parseJSON, validateTradingData, validateReportData } from '../utils/jsonParser'
import { analyzeScreenshotsWithGemini, generateReportWithGemini, GEMINI_MODEL_NAMES } from '../utils/geminiApi'
import { analyzeScreenshotsWithDeepSeek, generateReportWithDeepSeek } from '../utils/deepseekApi'
import { analyzeScreenshotsWithClaude, generateReportWithClaude, CLAUDE_MODEL_NAMES } from '../utils/claudeApi'
import { analyzeScreenshotsWithQwen, generateReportWithQwen, QWEN_MODEL_NAMES } from '../utils/qwenApi'
import { calculateBazi, calculateStartAge, calculateFirstDayun } from '../utils/baziCalculator'
import './IntegratedInput.css'

function IntegratedInput({ onGenerateReport }) {
  const [step, setStep] = useState(1)
  const [dataInputType, setDataInputType] = useState('screenshot') // 'screenshot' or 'csv'
  const [screenshots, setScreenshots] = useState([])
  const [screenshotFiles, setScreenshotFiles] = useState([]) // 保存原始文件对象
  const [csvFiles, setCsvFiles] = useState([])
  const [csvContent, setCsvContent] = useState('')
  const [apiProvider, setApiProvider] = useState(localStorage.getItem('api_provider') || 'gemini')
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
  const [geminiModel, setGeminiModel] = useState(localStorage.getItem('gemini_model') || 'flash')
  const [deepseekApiKey, setDeepseekApiKey] = useState(localStorage.getItem('deepseek_api_key') || '')
  const [claudeApiKey, setClaudeApiKey] = useState(localStorage.getItem('claude_api_key') || '')
  const [claudeModel, setClaudeModel] = useState(localStorage.getItem('claude_model') || 'sonnet')
  const [qwenApiKey, setQwenApiKey] = useState(localStorage.getItem('qwen_api_key') || '')
  const [qwenModel, setQwenModel] = useState(localStorage.getItem('qwen_model') || 'plus')
  const [baziInfo, setBaziInfo] = useState({
    name: '',
    gender: 'Male',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    yearPillar: '',
    monthPillar: '',
    dayPillar: '',
    hourPillar: '',
    startAge: '',
    firstDaYun: ''
  })
  const [extractedData, setExtractedData] = useState(null)
  const [tradingDataJson, setTradingDataJson] = useState('')
  const [cleanedTradingJson, setCleanedTradingJson] = useState('')
  const [aiReportJson, setAiReportJson] = useState('')
  const [cleanedReportJson, setCleanedReportJson] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files)
    setScreenshotFiles(files) // 保存原始文件
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setScreenshots(prev => [...prev, ...imageUrls])
  }

  const removeScreenshot = (index) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
    setScreenshotFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleCsvUpload = (e) => {
    const files = Array.from(e.target.files)
    setCsvFiles(files)

    // 读取所有CSV文件内容
    Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve({ name: file.name, content: e.target.result })
        reader.readAsText(file)
      })
    })).then(results => {
      const combinedContent = results.map(r => `=== ${r.name} ===\n${r.content}`).join('\n\n')
      setCsvContent(combinedContent)
    })
  }

  const removeCsvFile = (index) => {
    setCsvFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleApiProviderChange = (e) => {
    const provider = e.target.value
    setApiProvider(provider)
    localStorage.setItem('api_provider', provider)
  }

  const handleGeminiApiKeyChange = (e) => {
    const key = e.target.value
    setGeminiApiKey(key)
    localStorage.setItem('gemini_api_key', key)
  }

  const handleGeminiModelChange = (e) => {
    const model = e.target.value
    setGeminiModel(model)
    localStorage.setItem('gemini_model', model)
  }

  const handleDeepseekApiKeyChange = (e) => {
    const key = e.target.value
    setDeepseekApiKey(key)
    localStorage.setItem('deepseek_api_key', key)
  }

  const handleClaudeApiKeyChange = (e) => {
    const key = e.target.value
    setClaudeApiKey(key)
    localStorage.setItem('claude_api_key', key)
  }

  const handleClaudeModelChange = (e) => {
    const model = e.target.value
    setClaudeModel(model)
    localStorage.setItem('claude_model', model)
  }

  const handleQwenApiKeyChange = (e) => {
    const key = e.target.value
    setQwenApiKey(key)
    localStorage.setItem('qwen_api_key', key)
  }

  const handleQwenModelChange = (e) => {
    const model = e.target.value
    setQwenModel(model)
    localStorage.setItem('qwen_model', model)
  }

  const handleAutoAnalyzeScreenshots = async () => {
    setError(null)
    setLoading(true)

    const currentApiKey = apiProvider === 'gemini' ? geminiApiKey : deepseekApiKey

    if (!currentApiKey) {
      setError(`请先��置 ${apiProvider === 'gemini' ? 'Gemini' : 'DeepSeek'} API Key`)
      setLoading(false)
      return
    }

    if (screenshotFiles.length === 0) {
      setError('请先上传截图')
      setLoading(false)
      return
    }

    try {
      console.log(`开始调用 ${apiProvider} API 分析截图...`)

      let responseText
      if (apiProvider === 'gemini') {
        responseText = await analyzeScreenshotsWithGemini(
          screenshotFiles,
          SCREENSHOT_ANALYSIS_PROMPT,
          geminiApiKey,
          geminiModel
        )
      } else if (apiProvider === 'claude') {
        responseText = await analyzeScreenshotsWithClaude(
          screenshotFiles,
          SCREENSHOT_ANALYSIS_PROMPT,
          claudeApiKey,
          claudeModel
        )
      } else if (apiProvider === 'qwen') {
        responseText = await analyzeScreenshotsWithQwen(
          screenshotFiles,
          SCREENSHOT_ANALYSIS_PROMPT,
          qwenApiKey
        )
      } else {
        responseText = await analyzeScreenshotsWithDeepSeek(
          screenshotFiles,
          SCREENSHOT_ANALYSIS_PROMPT,
          deepseekApiKey
        )
      }

      console.log('AI 返回的文本:', responseText)

      // 解析返回的 JSON
      const cleanedJson = extractAndCleanJSON(responseText)
      const data = parseJSON(cleanedJson)
      const validatedData = validateTradingData(data)

      setExtractedData(validatedData)
      setError(null)

      const dataType = validatedData.data_type === 'annual_summary' ? '年度摘要' : '详细交易记录'
      alert(`✅ AI 自动分析成功！\n数据类型: ${dataType}`)
    } catch (err) {
      console.error('AI 分析失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoAnalyzeCsv = async () => {
    setError(null)
    setLoading(true)

    const currentApiKey = apiProvider === 'gemini' ? geminiApiKey :
                          apiProvider === 'claude' ? claudeApiKey :
                          apiProvider === 'qwen' ? qwenApiKey : deepseekApiKey

    if (!currentApiKey) {
      setError(`请先配置 ${apiProvider} API Key`)
      setLoading(false)
      return
    }

    if (!csvContent) {
      setError('请先上传CSV文件')
      setLoading(false)
      return
    }

    try {
      console.log(`开始调用 ${apiProvider} API 分析CSV数据...`)

      const prompt = `${CSV_ANALYSIS_PROMPT}\n\n以下是用户上传的CSV数据：\n\n${csvContent.substring(0, 15000)}`

      let responseText
      if (apiProvider === 'gemini') {
        responseText = await generateReportWithGemini(prompt, geminiApiKey, geminiModel)
      } else if (apiProvider === 'claude') {
        responseText = await generateReportWithClaude(prompt, claudeApiKey, claudeModel)
      } else if (apiProvider === 'qwen') {
        responseText = await generateReportWithQwen(prompt, qwenApiKey, qwenModel)
      } else {
        responseText = await generateReportWithDeepSeek(prompt, deepseekApiKey)
      }

      console.log('AI 返回的文本:', responseText)

      const cleanedJson = extractAndCleanJSON(responseText)
      const data = parseJSON(cleanedJson)
      const validatedData = validateTradingData(data)

      setExtractedData(validatedData)
      setError(null)

      const dataType = validatedData.data_type === 'annual_summary' ? '年度摘要' : '详细交易记录'
      alert(`✅ CSV数据分析成功！\n数据类型: ${dataType}`)
    } catch (err) {
      console.error('CSV分析失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBaziChange = (e) => {
    setBaziInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // 自动计算八字
  useEffect(() => {
    const { birthYear, birthMonth, birthDay, birthHour, gender } = baziInfo

    if (birthYear && birthMonth && birthDay) {
      const bazi = calculateBazi(
        parseInt(birthYear),
        parseInt(birthMonth),
        parseInt(birthDay),
        birthHour ? parseInt(birthHour) : null
      )

      if (bazi) {
        const startAge = calculateStartAge(
          parseInt(birthYear),
          parseInt(birthMonth),
          parseInt(birthDay),
          gender
        )

        const firstDayun = calculateFirstDayun(
          parseInt(birthYear),
          parseInt(birthMonth),
          gender
        )

        setBaziInfo(prev => ({
          ...prev,
          yearPillar: bazi.yearPillar,
          monthPillar: bazi.monthPillar,
          dayPillar: bazi.dayPillar,
          hourPillar: bazi.hourPillar || prev.hourPillar,
          startAge: startAge.toString(),
          firstDaYun: firstDayun
        }))
      }
    }
  }, [baziInfo.birthYear, baziInfo.birthMonth, baziInfo.birthDay, baziInfo.birthHour, baziInfo.gender])

  const generatePromptForScreenshots = () => {
    return `${SCREENSHOT_ANALYSIS_PROMPT}\n\n用户上传了 ${screenshots.length} 张交易截图，请分析所有截图并合并提取交易数据。`
  }

  const generateIntegratedPrompt = () => {
    const baziData = `
【八字信息】
姓名: ${baziInfo.name || '未提供'}
性别: ${baziInfo.gender === 'Male' ? '男' : '女'}
出生日期: ${baziInfo.birthYear}年${baziInfo.birthMonth}月${baziInfo.birthDay}日${baziInfo.birthHour}时
四柱: ${baziInfo.yearPillar} ${baziInfo.monthPillar} ${baziInfo.dayPillar} ${baziInfo.hourPillar}
起运年龄: ${baziInfo.startAge}岁
第一步大运: ${baziInfo.firstDaYun}
`

    const tradingData = extractedData ? `
【交易数据】
交易所: ${extractedData.exchange}
交易笔数: ${extractedData.summary?.total_transactions || 0}
时间范围: ${extractedData.summary?.date_range || '未知'}
总交易量: $${extractedData.summary?.total_volume || 0}
` : '【交易数据】未提供'

    return `${INTEGRATED_FORTUNE_PROMPT}\n\n${baziData}\n${tradingData}\n\n请生成融合命理与财富的2026年度完整预测报告。`
  }

  const copyPrompt = async (promptText) => {
    try {
      await navigator.clipboard.writeText(promptText)
      alert('✅ 提示词已复制！请粘贴到AI工具（ChatGPT/Claude）')
    } catch (err) {
      console.error('复制失败', err)
    }
  }

  const handleImportTradingData = () => {
    setError(null)

    if (!tradingDataJson.trim()) {
      setError('请粘贴AI提取的交易数据JSON')
      return
    }

    try {
      const cleanedJson = extractAndCleanJSON(tradingDataJson)
      setCleanedTradingJson(cleanedJson)

      const data = parseJSON(cleanedJson)
      const validatedData = validateTradingData(data)

      setExtractedData(validatedData)
      setError(null)
      setShowPreview(false)

      const dataType = validatedData.data_type === 'annual_summary' ? '年度摘要' : '详细交易记录'
      alert(`✅ 交易数据导入成功！\n数据类型: ${dataType}`)
    } catch (err) {
      setError(err.message)
      setShowPreview(true) // 出错时显示预览
    }
  }

  const handlePreviewTradingData = () => {
    try {
      const cleanedJson = extractAndCleanJSON(tradingDataJson)
      setCleanedTradingJson(cleanedJson)
      setShowPreview(true)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGenerateReport = () => {
    console.log('=== 开始生成报告 ===')
    setError(null)

    if (!aiReportJson.trim()) {
      console.log('错误: JSON 输入为空')
      setError('请粘贴AI返回的JSON数据')
      return
    }

    console.log('步骤1: 原始输入长度:', aiReportJson.length)
    console.log('步骤1: 原始输入前100字符:', aiReportJson.substring(0, 100))

    try {
      console.log('步骤2: 开始清理 JSON...')
      const cleanedJson = extractAndCleanJSON(aiReportJson)
      console.log('步骤2: 清理完成，长度:', cleanedJson.length)
      console.log('步骤2: 清理后前200字符:', cleanedJson.substring(0, 200))
      setCleanedReportJson(cleanedJson)

      console.log('步骤3: 开始解析 JSON...')
      const data = parseJSON(cleanedJson)
      console.log('步骤3: 解析成功')
      console.log('步骤3: 数据键:', Object.keys(data))
      console.log('步骤3: 完整数据:', data)

      console.log('步骤4: 开始验证数据...')
      const validatedData = validateReportData(data)
      console.log('步骤4: 验证成功')
      console.log('步骤4: life_kline 长度:', validatedData.life_kline?.length)
      console.log('步骤4: life_kline 第一项:', validatedData.life_kline?.[0])

      console.log('步骤5: 开始转换数据格式...')
      const reportData = {
        predictions: validatedData.life_kline,
        bazi_analysis: validatedData.bazi_analysis,
        trading_analysis: validatedData.trading_analysis,
        integrated_prediction: validatedData.integrated_prediction,
        annual_summary: validatedData.annual_summary,
        cost_analysis: {
          total_fees: 0,
          avg_fee_per_tx: 0,
          breakdown: {}
        }
      }
      console.log('步骤5: 转换完成')
      console.log('步骤5: reportData.predictions 长度:', reportData.predictions?.length)
      console.log('步骤5: reportData 键:', Object.keys(reportData))
      console.log('步骤5: 完整 reportData:', reportData)

      console.log('步骤6: 调用 onGenerateReport...')
      onGenerateReport(reportData)
      console.log('步骤6: onGenerateReport 调用完成')

      setShowPreview(false)
      alert('✅ 报告生成成功！')
      console.log('=== 报告生成流程完成 ===')
    } catch (err) {
      console.error('❌ 生成报告失败')
      console.error('错误类型:', err.name)
      console.error('错误信息:', err.message)
      console.error('错误堆栈:', err.stack)
      setError(err.message)
      setShowPreview(true)
    }
  }

  const handleAutoGenerateReport = async () => {
    setError(null)
    setLoading(true)

    const currentApiKey = apiProvider === 'gemini' ? geminiApiKey : deepseekApiKey

    if (!currentApiKey) {
      setError(`请先配置 ${apiProvider === 'gemini' ? 'Gemini' : 'DeepSeek'} API Key`)
      setLoading(false)
      return
    }

    try {
      console.log(`开始调用 ${apiProvider} API 生成融合报告...`)

      let responseText
      if (apiProvider === 'gemini') {
        responseText = await generateReportWithGemini(
          generateIntegratedPrompt(),
          geminiApiKey,
          geminiModel
        )
      } else if (apiProvider === 'claude') {
        responseText = await generateReportWithClaude(
          generateIntegratedPrompt(),
          claudeApiKey,
          claudeModel
        )
      } else if (apiProvider === 'qwen') {
        responseText = await generateReportWithQwen(
          generateIntegratedPrompt(),
          qwenApiKey,
          qwenModel
        )
      } else {
        responseText = await generateReportWithDeepSeek(
          generateIntegratedPrompt(),
          deepseekApiKey
        )
      }

      console.log('AI 返回的报告文本:', responseText)

      const cleanedJson = extractAndCleanJSON(responseText)
      const data = parseJSON(cleanedJson)
      const validatedData = validateReportData(data)

      const reportData = {
        predictions: validatedData.life_kline,
        bazi_analysis: validatedData.bazi_analysis,
        trading_analysis: validatedData.trading_analysis,
        integrated_prediction: validatedData.integrated_prediction,
        annual_summary: validatedData.annual_summary,
        cost_analysis: {
          total_fees: 0,
          avg_fee_per_tx: 0,
          breakdown: {}
        }
      }

      onGenerateReport(reportData)
      alert('✅ AI 自动生成报告成功！')
    } catch (err) {
      console.error('AI 生成报告失败:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewReport = () => {
    try {
      const cleanedJson = extractAndCleanJSON(aiReportJson)
      setCleanedReportJson(cleanedJson)
      setShowPreview(true)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="integrated-input">
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>AI处理中...</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>请稍候，这可能需要几秒钟</div>
          </div>
        </div>
      )}

      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. 上传数据</div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. 输入八字</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. AI分析</div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. 生成报告</div>
      </div>

      {step === 1 && (
        <div className="step-content">
          <h2>📊 上传交易数据</h2>
          <p className="desc">上传截图或CSV文件，AI将自动识别交易数据</p>

          <div className="data-type-selector">
            <button
              className={`type-btn ${dataInputType === 'screenshot' ? 'active' : ''}`}
              onClick={() => setDataInputType('screenshot')}
            >
              📸 截图上传
            </button>
            <button
              className={`type-btn ${dataInputType === 'csv' ? 'active' : ''}`}
              onClick={() => setDataInputType('csv')}
            >
              📄 CSV文件
            </button>
          </div>

          <div className="form-section">
            <h4>🤖 选择 AI 服务商</h4>
            <select
              value={apiProvider}
              onChange={handleApiProviderChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '16px' }}
            >
              <option value="gemini">Gemini (Google) - 支持图片分析</option>
              <option value="claude">Claude (Anthropic) - 支持图片分析</option>
              <option value="qwen">通义千问 (阿里云) - 支持图片分析</option>
              <option value="deepseek">DeepSeek (深度求索) - 仅支持文本生成</option>
            </select>
          </div>

          {apiProvider === 'gemini' && (
            <div className="form-section">
              <h4>🔑 Gemini API Key</h4>
              <input
                type="password"
                value={geminiApiKey}
                onChange={handleGeminiApiKeyChange}
                placeholder="输入你的 Gemini API Key"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '12px' }}
              />
              <h4>🎯 选择 Gemini 模型</h4>
              <select
                value={geminiModel}
                onChange={handleGeminiModelChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                {Object.entries(GEMINI_MODEL_NAMES).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                💡 获取API Key: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">https://aistudio.google.com/app/apikey</a>
              </p>
            </div>
          )}

          {apiProvider === 'claude' && (
            <div className="form-section">
              <h4>🔑 Claude API Key</h4>
              <input
                type="password"
                value={claudeApiKey}
                onChange={handleClaudeApiKeyChange}
                placeholder="输入你的 Claude API Key"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '12px' }}
              />
              <h4>🎯 选择 Claude 模型</h4>
              <select
                value={claudeModel}
                onChange={handleClaudeModelChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                {Object.entries(CLAUDE_MODEL_NAMES).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                💡 获取API Key: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">https://console.anthropic.com/settings/keys</a>
              </p>
            </div>
          )}

          {apiProvider === 'deepseek' && (
            <div className="form-section">
              <h4>🔑 DeepSeek API Key</h4>
              <input
                type="password"
                value={deepseekApiKey}
                onChange={handleDeepseekApiKeyChange}
                placeholder="输入你的 DeepSeek API Key"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                💡 获取API Key: <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">https://platform.deepseek.com/api_keys</a>
              </p>
              <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '8px' }}>
                ⚠️ DeepSeek 暂不支持图片分析，截图分析请使用手动模式或切换到 Gemini
              </p>
            </div>
          )}

          {apiProvider === 'qwen' && (
            <div className="form-section">
              <h4>🔑 通义千问 API Key</h4>
              <input
                type="password"
                value={qwenApiKey}
                onChange={handleQwenApiKeyChange}
                placeholder="输入你的阿里云 API Key"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '12px' }}
              />
              <h4>🎯 选择千问模型</h4>
              <select
                value={qwenModel}
                onChange={handleQwenModelChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                {Object.entries(QWEN_MODEL_NAMES).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                💡 获取API Key: <a href="https://dashscope.console.aliyun.com/apiKey" target="_blank" rel="noopener noreferrer">https://dashscope.console.aliyun.com/apiKey</a>
              </p>
            </div>
          )}

          {dataInputType === 'screenshot' && (
            <>
              <div className="screenshot-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleScreenshotUpload}
                  id="screenshot-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="screenshot-input" className="upload-btn">
                  📷 选择截图 (可多选)
                </label>
              </div>

              {screenshots.length > 0 && (
                <div className="screenshot-preview">
                  <h3>已上传 {screenshots.length} 张截图</h3>
                  <div className="screenshot-grid">
                    {screenshots.map((url, index) => (
                      <div key={index} className="screenshot-item">
                        <img src={url} alt={`Screenshot ${index + 1}`} />
                        <button onClick={() => removeScreenshot(index)} className="remove-btn">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="ai-instructions">
                <h4>🤖 AI识别步骤</h4>
                <div className="screenshot-tips">
                  <p><strong>💡 截图建议：</strong></p>
                  <ul>
                    <li>✅ 最佳：详细交易记录（包含日期、资产、金额等）</li>
                    <li>✅ 可用：年度报告摘要（总盈亏、交易笔数、主要资产）</li>
                    <li>⚠️ 即使只有摘要数据，系统也能工作</li>
                  </ul>
                </div>

                {((apiProvider === 'gemini' && geminiApiKey) || (apiProvider === 'claude' && claudeApiKey) || (apiProvider === 'qwen' && qwenApiKey)) && screenshots.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      onClick={handleAutoAnalyzeScreenshots}
                      className="import-data-btn"
                      disabled={loading}
                      style={{ width: '100%', marginBottom: '10px' }}
                    >
                      {loading ? '🔄 AI分析中...' : `🤖 使用 ${apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : '千问'} 自动分析截图 (推荐)`}
                    </button>
                    <p style={{ fontSize: '13px', color: '#059669', textAlign: 'center' }}>
                      ✨ 使用{apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : '千问'} API自动提取数据，无需手动复制粘贴
                    </p>
                  </div>
                )}

                <details style={{ marginTop: '16px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '12px' }}>
                    📋 手动模式 (点击展开)
                  </summary>
                  <ol>
                    <li>点击下方按钮复制AI提示词</li>
                    <li>打开ChatGPT或Claude，上传你的截图</li>
                    <li>粘贴提示词并发送</li>
                    <li>复制AI返回的JSON数据</li>
                    <li>粘贴提示词并发送</li>
                    <li>复制AI返回的JSON数据</li>
                    <li>粘贴到下方输入框并导入</li>
                  </ol>
                  <button onClick={() => copyPrompt(generatePromptForScreenshots())} className="copy-prompt-btn">
                    📋 复制AI识别提示词
                  </button>
                </details>
              </div>
            </>
          )}

          {dataInputType === 'csv' && (
            <>
              <div className="csv-upload">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  multiple
                  onChange={handleCsvUpload}
                  id="csv-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="csv-input" className="upload-btn">
                  📄 选择CSV/Excel文件 (可多选)
                </label>
              </div>

              {csvFiles.length > 0 && (
                <div className="csv-preview">
                  <h3>已上传 {csvFiles.length} 个文件</h3>
                  <div className="csv-file-list">
                    {csvFiles.map((file, index) => (
                      <div key={index} className="csv-file-item">
                        <span>📄 {file.name}</span>
                        <button onClick={() => removeCsvFile(index)} className="remove-btn">×</button>
                      </div>
                    ))}
                  </div>
                  {csvContent && (
                    <details style={{ marginTop: '12px' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '14px', color: '#6b7280' }}>
                        查看文件内容预览
                      </summary>
                      <pre style={{
                        background: '#f3f4f6',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        marginTop: '8px'
                      }}>
                        {csvContent.substring(0, 2000)}...
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="ai-instructions">
                <h4>🤖 CSV数据分析</h4>
                <div className="screenshot-tips">
                  <p><strong>💡 支持的文件类型：</strong></p>
                  <ul>
                    <li>✅ 账户变动明细 (资金流水)</li>
                    <li>✅ 交易记录导出 (买卖记录)</li>
                    <li>✅ 资产快照 (持仓记录)</li>
                    <li>✅ 盈亏报表 (收益统计)</li>
                  </ul>
                </div>

                {((apiProvider === 'gemini' && geminiApiKey) || (apiProvider === 'claude' && claudeApiKey) || (apiProvider === 'qwen' && qwenApiKey) || (apiProvider === 'deepseek' && deepseekApiKey)) && csvFiles.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      onClick={handleAutoAnalyzeCsv}
                      className="import-data-btn"
                      disabled={loading}
                      style={{ width: '100%', marginBottom: '10px' }}
                    >
                      {loading ? '🔄 AI分析中...' : `🤖 使用 ${apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : apiProvider === 'qwen' ? '千问' : 'DeepSeek'} 自动分析CSV`}
                    </button>
                    <p style={{ fontSize: '13px', color: '#059669', textAlign: 'center' }}>
                      ✨ AI将自动解析CSV数据并提取交易信息
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="data-import-section">
            <h4>📥 导入AI提取的交易数据</h4>
            <textarea
              className="json-input"
              value={tradingDataJson}
              onChange={(e) => setTradingDataJson(e.target.value)}
              placeholder='粘贴AI返回的交易数据JSON...\n\n例如:\n{\n  "exchange": "Binance",\n  "transactions": [...],\n  "summary": {...}\n}'
              style={{ height: '200px' }}
            />
            {error && <div className="error-message">{error}</div>}

            {showPreview && cleanedTradingJson && (
              <div className="json-preview">
                <h5>🔍 清理后的 JSON 预览</h5>
                <pre>{cleanedTradingJson.substring(0, 500)}...</pre>
                <p className="preview-hint">如果上面的内容看起来正确，点击"导入交易数据"</p>
              </div>
            )}

            <div className="button-row">
              <button onClick={handlePreviewTradingData} className="preview-btn">
                🔍 预览清理后的JSON
              </button>
              <button onClick={handleImportTradingData} className="import-data-btn">
                ✅ 导入交易数据
              </button>
            </div>
          </div>

          {extractedData && (
            <div className="data-summary">
              <h4>✅ 交易数据已导入</h4>
              <p><strong>数据类型:</strong> {extractedData.data_type === 'annual_summary' ? '年度摘要' : '详细交易记录'}</p>
              <p><strong>交易所:</strong> {extractedData.exchange || '未知'}</p>
              <p><strong>交易笔数:</strong> {extractedData.summary?.total_transactions || extractedData.transactions?.length || 0}</p>
              <p><strong>时间范围:</strong> {extractedData.summary?.date_range || '未知'}</p>
              {extractedData.summary?.total_profit_loss !== undefined && (
                <p><strong>总盈亏:</strong> ${extractedData.summary.total_profit_loss.toLocaleString()} ({extractedData.summary.profit_loss_percentage}%)</p>
              )}
              {extractedData.summary?.main_assets && (
                <p><strong>主要资产:</strong> {extractedData.summary.main_assets.join(', ')}</p>
              )}
            </div>
          )}

          <button onClick={() => setStep(2)} className="next-btn" disabled={!extractedData}>
            下一步：输入八字信息 →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <h2>🔮 输入八字信息</h2>
          <p className="desc">填写你的生辰八字，用于命理分析</p>

          <div className="bazi-form">
            <div className="form-row">
              <div className="form-field">
                <label>姓名 (可选)</label>
                <input type="text" name="name" value={baziInfo.name} onChange={handleBaziChange} placeholder="张三" />
              </div>
              <div className="form-field">
                <label>性别</label>
                <select name="gender" value={baziInfo.gender} onChange={handleBaziChange}>
                  <option value="Male">男 (乾造)</option>
                  <option value="Female">女 (坤造)</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h4>出生日期</h4>
              <div className="form-row">
                <input type="number" name="birthYear" value={baziInfo.birthYear} onChange={handleBaziChange} placeholder="年 (如1990)" />
                <input type="number" name="birthMonth" value={baziInfo.birthMonth} onChange={handleBaziChange} placeholder="月 (1-12)" />
                <input type="number" name="birthDay" value={baziInfo.birthDay} onChange={handleBaziChange} placeholder="日 (1-31)" />
                <input type="number" name="birthHour" value={baziInfo.birthHour} onChange={handleBaziChange} placeholder="时 (0-23)" />
              </div>
            </div>

            <div className="form-section">
              <h4>四柱干支 (自动计算)</h4>
              <div className="form-row">
                <input type="text" name="yearPillar" value={baziInfo.yearPillar} readOnly placeholder="年柱" style={{ backgroundColor: '#f3f4f6' }} />
                <input type="text" name="monthPillar" value={baziInfo.monthPillar} readOnly placeholder="月柱" style={{ backgroundColor: '#f3f4f6' }} />
                <input type="text" name="dayPillar" value={baziInfo.dayPillar} readOnly placeholder="日柱" style={{ backgroundColor: '#f3f4f6' }} />
                <input type="text" name="hourPillar" value={baziInfo.hourPillar} readOnly placeholder="时柱" style={{ backgroundColor: '#f3f4f6' }} />
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                💡 四柱会根据出生日期自动计算生成
              </p>
            </div>

            <div className="form-section">
              <h4>大运信息 (自动计算)</h4>
              <div className="form-row">
                <input type="text" name="startAge" value={baziInfo.startAge} readOnly placeholder="起运年龄 (虚岁)" style={{ backgroundColor: '#f3f4f6' }} />
                <input type="text" name="firstDaYun" value={baziInfo.firstDaYun} readOnly placeholder="第一步大运" style={{ backgroundColor: '#f3f4f6' }} />
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                💡 大运信息会根���出生日期和性别自动计算
              </p>
            </div>
          </div>

          <div className="button-group">
            <button onClick={() => setStep(1)} className="back-btn">← 上一步</button>
            <button onClick={() => setStep(3)} className="next-btn">下一步：AI综合分析 →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-content">
          <h2>🤖 AI综合分析</h2>
          <p className="desc">复制提示词到AI，获取融合命理与财富的完整分析</p>

          <div className="prompt-preview">
            <h4>提示词预览</h4>
            <pre>{generateIntegratedPrompt().substring(0, 500)}...</pre>
          </div>

          {((apiProvider === 'gemini' && geminiApiKey) || (apiProvider === 'claude' && claudeApiKey) || (apiProvider === 'deepseek' && deepseekApiKey) || (apiProvider === 'qwen' && qwenApiKey)) && (
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={handleAutoGenerateReport}
                className="generate-btn"
                disabled={loading}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {loading ? '🔄 AI生成中...' : `🤖 使用 ${apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : apiProvider === 'qwen' ? '千问' : 'DeepSeek'} 自动生成完整报告 (推荐)`}
              </button>
              <p style={{ fontSize: '13px', color: '#059669', textAlign: 'center' }}>
                ✨ 使用{apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : apiProvider === 'qwen' ? '千问' : 'DeepSeek'} API自动生成融合报告，直接跳到结果页面
              </p>
            </div>
          )}

          <details style={{ marginTop: '16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '12px' }}>
              📋 手动模式 (点击展开)
            </summary>
            <button onClick={() => copyPrompt(generateIntegratedPrompt())} className="copy-prompt-btn">
              📋 复制完整分析提示词
            </button>
            <div className="ai-instructions">
              <h4>使用说明</h4>
              <ol>
                <li>复制上方提示词</li>
                <li>打开ChatGPT或Claude</li>
                <li>粘贴提示词并发送</li>
                <li>等待AI生成完整的JSON报告</li>
                <li>复制JSON数据，进入下一步</li>
              </ol>
            </div>
          </details>

          <div className="button-group">
            <button onClick={() => setStep(2)} className="back-btn">← 上一步</button>
            <button onClick={() => setStep(4)} className="next-btn">下一步：导入报告 →</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step-content">
          <h2>📥 导入AI报告</h2>
          <p className="desc">粘贴AI返回的JSON数据</p>

          <textarea
            className="json-input"
            value={aiReportJson}
            onChange={(e) => setAiReportJson(e.target.value)}
            placeholder='粘贴AI返回的JSON数据...\n\n例如:\n{\n  "bazi_analysis": {...},\n  "trading_analysis": {...},\n  "integrated_prediction": {...},\n  "life_kline": [...]\n}'
          />

          {error && <div className="error-message">{error}</div>}

          {showPreview && cleanedReportJson && (
            <div className="json-preview">
              <h5>🔍 清理后的 JSON 预览</h5>
              <pre>{cleanedReportJson.substring(0, 500)}...</pre>
              <p className="preview-hint">如果上面的内容看起来正确，点击"生成报告"</p>
            </div>
          )}

          <div className="button-group">
            <button onClick={() => setStep(3)} className="back-btn">← 上一步</button>
            <button onClick={handlePreviewReport} className="preview-btn">
              🔍 预览清理后的JSON
            </button>
            <button onClick={handleGenerateReport} className="generate-btn">
              ✨ 生成2026年度完整报告
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IntegratedInput
