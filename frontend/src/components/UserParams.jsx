import { useState } from 'react'
import './UserParams.css'

function UserParams({ onSubmit, loading }) {
  const [params, setParams] = useState({
    risk_profile: 'balanced',
    monthly_input: 1000,
    max_drawdown: 0.3
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(params)
  }

  return (
    <form className="user-params" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>风险偏好</label>
        <select
          value={params.risk_profile}
          onChange={(e) => setParams({ ...params, risk_profile: e.target.value })}
        >
          <option value="conservative">保守</option>
          <option value="balanced">平衡</option>
          <option value="aggressive">激进</option>
        </select>
      </div>

      <div className="form-group">
        <label>预期月度投入 (USD)</label>
        <input
          type="number"
          value={params.monthly_input}
          onChange={(e) => setParams({ ...params, monthly_input: parseFloat(e.target.value) })}
        />
      </div>

      <div className="form-group">
        <label>最大可接受回撤</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={params.max_drawdown}
          onChange={(e) => setParams({ ...params, max_drawdown: parseFloat(e.target.value) })}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? '生成中...' : '生成预测'}
      </button>
    </form>
  )
}

export default UserParams
