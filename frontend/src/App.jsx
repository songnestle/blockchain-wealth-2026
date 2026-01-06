import { useState } from 'react'
import axios from 'axios'
import FileUpload from './components/FileUpload'
import UserParams from './components/UserParams'
import AIPromptGenerator from './components/AIPromptGenerator'
import WealthChart from './components/WealthChart'
import KLineChart from './components/KLineChart'
import CostAnalysis from './components/CostAnalysis'
import './App.css'

function App() {
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
      // 模拟交易数据摘要
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

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 2026 区块链年度财富曲线</h1>
        <p>跨交易所数据聚合与年度财富预测</p>
      </header>

      <div className="container">
        <section className="upload-section">
          <h2>📊 数据导入</h2>
          <FileUpload onUpload={handleFileUpload} />
          {uploadStatus && (
            <div className={uploadStatus.error ? 'status error' : 'status success'}>
              {uploadStatus.error || uploadStatus.message}
            </div>
          )}
        </section>

        <section className="params-section">
          <h2>⚙️ 预测方式</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>传统算法预测</h3>
              <UserParams onSubmit={handlePredict} loading={loading} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>AI智能预测</h3>
              <AIPromptGenerator
                transactionData={transactionData}
                onAIDataImport={setPrediction}
              />
            </div>
          </div>
        </section>

        {prediction && (
          <>
            <section className="chart-section">
              <h2>📈 2026年度财富预测曲线</h2>
              <WealthChart data={prediction.predictions} />
            </section>

            <section className="chart-section">
              <KLineChart data={prediction.predictions} />
            </section>

            <section className="analysis-section">
              <h2>💰 成本分析</h2>
              <CostAnalysis data={prediction.cost_analysis} />
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default App
