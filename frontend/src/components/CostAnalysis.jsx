import './CostAnalysis.css'

function CostAnalysis({ data }) {
  if (!data) return null

  const { total_fees, breakdown, avg_fee_per_tx } = data

  return (
    <div className="cost-analysis">
      <div className="cost-summary">
        <div className="cost-card">
          <h3>总手续费</h3>
          <p className="value">${total_fees.toFixed(2)}</p>
        </div>
        <div className="cost-card">
          <h3>平均每笔费用</h3>
          <p className="value">${avg_fee_per_tx.toFixed(4)}</p>
        </div>
      </div>

      <div className="cost-breakdown">
        <h3>成本拆解</h3>
        <div className="breakdown-list">
          {Object.entries(breakdown).map(([type, amount]) => (
            <div key={type} className="breakdown-item">
              <span className="type">{type}</span>
              <span className="amount">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cost-insights">
        <h3>💡 成本洞察</h3>
        <ul>
          <li>手续费占比: {((total_fees / 10000) * 100).toFixed(2)}%</li>
          <li>主要成本来源: {Object.keys(breakdown)[0] || 'N/A'}</li>
          <li>优化建议: 考虑减少高频交易以降低手续费</li>
        </ul>
      </div>
    </div>
  )
}

export default CostAnalysis
