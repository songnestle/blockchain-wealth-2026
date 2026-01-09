import { useState } from 'react'
import IntegratedInput from './components/IntegratedInput'
import IntegratedReport from './components/IntegratedReport'
import KLineChart from './components/KLineChart'
import SolanaPayment from './components/SolanaPayment'
import './App.css'

function App() {
  const [prediction, setPrediction] = useState(null)

  const handleGenerateReport = (reportData) => {
    setPrediction(reportData)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-badge">AI 驱动 · 多维分析</div>
        <h1>🔮 2026 区块链年度趋势分析报告</h1>
        <p className="header-subtitle">财富趋势 + 人生趋势 双轨情景推演系统</p>
        <p className="header-description">
          基于多模态 AI 技术，结合交易数据与命理分析，为您生成专属的 2026 年度趋势预测报告
        </p>
      </header>

      <div className="container">
        <section className="input-section">
          <div className="section-header">
            <h2>📊 开始分析</h2>
            <p className="section-desc">上传您的交易数据或截图，填写基本信息，即可生成专属报告</p>
          </div>
          <IntegratedInput onGenerateReport={handleGenerateReport} />
        </section>

        {prediction && (
          <>
            <div className="divider">
              <span className="divider-text">分析结果</span>
            </div>

            <IntegratedReport data={prediction} />

            <section className="chart-section">
              <div className="section-header">
                <h2>📈 趋势可视化</h2>
                <p className="section-desc">基于 AI 分析生成的 2026 年度趋势预测图表</p>
              </div>
              <KLineChart data={prediction.predictions} title="🧬 2026人生趋势区间图" isProjection={true} />
            </section>
          </>
        )}

        <div className="divider">
          <span className="divider-text">支持我们</span>
        </div>

        <SolanaPayment />
      </div>
    </div>
  )
}

export default App
