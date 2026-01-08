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
        <h1>🔮 2026 区块链年度趋势分析报告</h1>
        <p>财富趋势 + 人生趋势 双轨情景推演系统</p>
      </header>

      <div className="container">
        <IntegratedInput onGenerateReport={handleGenerateReport} />

        {prediction && (
          <>
            <IntegratedReport data={prediction} />

            <section className="chart-section">
              <KLineChart data={prediction.predictions} title="🧬 2026人生趋势区间图" isProjection={true} />
            </section>
          </>
        )}

        <SolanaPayment />
      </div>
    </div>
  )
}

export default App
