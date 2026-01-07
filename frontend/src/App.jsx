import { useState } from 'react'
import axios from 'axios'
import IntegratedInput from './components/IntegratedInput'
import IntegratedReport from './components/IntegratedReport'
import FileUpload from './components/FileUpload'
import UserParams from './components/UserParams'
import AIPromptGenerator from './components/AIPromptGenerator'
import WealthChart from './components/WealthChart'
import KLineChart from './components/KLineChart'
import CostAnalysis from './components/CostAnalysis'
import './App.css'

function App() {
  const [mode, setMode] = useState('integrated') // 'integrated' or 'legacy'
  const [uploadStatus, setUploadStatus] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [transactionData, setTransactionData] = useState(null)

  const handleFileUpload = async (file, exchange) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('exchange', exchange)

    try {
      const response = await axios.post('/api/upload', formData)
      setUploadStatus(response.data)
      setTransactionData({
        totalTrades: response.data.records,
        assets: ['BTC', 'ETH'],
        dateRange: '2025-01 ~ 2025-12',
        totalInvestment: 100000,
        currentValue: 120000,
        profitLoss: 20000
      })
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus({ error: error.message })
    }
  }

  const handlePredict = async (params) => {
    setLoading(true)
    try {
      const response = await axios.post('/api/predict', params)
      setPrediction(response.data)
    } catch (error) {
      console.error('Prediction failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = (reportData) => {
    console.log('生成报告:', reportData)
    setPrediction(reportData)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🔮 2026 区块链年度趋势分析报告</h1>
        <p>财富趋势 + 人生趋势 双轨情景推演系统</p>
      </header>

      <div className="mode-selector">
        <button
          className={mode === 'integrated' ? 'active' : ''}
          onClick={() => setMode('integrated')}
        >
          🔮 融合分析模式 (截图+八字)
        </button>
        <button
          className={mode === 'legacy' ? 'active' : ''}
          onClick={() => setMode('legacy')}
        >
          📈 传统分析模式 (CSV)
        </button>
      </div>

      <div className="container">
        {mode === 'integrated' ? (
          <>
            <IntegratedInput onGenerateReport={handleGenerateReport} />

            {prediction && (
              <>
                <IntegratedReport data={prediction} />

                <section className="chart-section">
                  <KLineChart data={prediction.predictions} title="🧬 2026人生趋势区间图" isProjection={true} />
                </section>
              </>
            )}
          </>
        ) : (
          <>
            <section className="upload-section">
              <h2>📥 数据导入</h2>
              <FileUpload onUpload={handleFileUpload} />
              {uploadStatus && (
                <div className={uploadStatus.error ? 'status error' : 'status success'}>
                  {uploadStatus.error || uploadStatus.message}
                </div>
              )}
            </section>

            <section className="params-section">
              <h2>⚙️ 分析方式</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>传统算法分析</h3>
                  <UserParams onSubmit={handlePredict} loading={loading} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>AI智能分析</h3>
                  <AIPromptGenerator
                    transactionData={transactionData}
                    onAIDataImport={setPrediction}
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {prediction && (
          <>
            <section className="chart-section">
              <WealthChart data={prediction.predictions} title="📈 多情景趋势分析" />
            </section>

            <section className="chart-section">
              <KLineChart data={prediction.predictions} title="💰 2026情景区间推演" isProjection={true} />
            </section>

            <section className="analysis-section">
              <h2>📊 成本结构分析</h2>
              <CostAnalysis data={prediction.cost_analysis} />
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default App
