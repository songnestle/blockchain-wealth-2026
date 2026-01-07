import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './WealthChart.css'

function WealthChart({ data, title = '📈 多情景趋势分析' }) {
  if (!data || !data.p50 || !Array.isArray(data.p50)) return null
  if (!data.p10 || !Array.isArray(data.p10)) return null
  if (!data.p90 || !Array.isArray(data.p90)) return null

  // 转换数据格式
  const chartData = data.p50.map((item, index) => ({
    month: `${item.month}月`,
    P10: data.p10[index]?.value || 0,
    P50: item.value,
    P90: data.p90[index]?.value || 0
  }))

  return (
    <div className="wealth-chart">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: '参考值', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip formatter={(value) => `参考值: ${value.toFixed(2)}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="P10"
            stroke="#ff6b6b"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="保守情景 (P10)"
          />
          <Line
            type="monotone"
            dataKey="P50"
            stroke="#4ecdc4"
            strokeWidth={3}
            name="基准情景 (P50)"
          />
          <Line
            type="monotone"
            dataKey="P90"
            stroke="#95e1d3"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="积极情景 (P90)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="dot p10"></span>
          <span>P10 - 保守情景：较低参考区间</span>
        </div>
        <div className="legend-item">
          <span className="dot p50"></span>
          <span>P50 - 基准情景：中位参考区间</span>
        </div>
        <div className="legend-item">
          <span className="dot p90"></span>
          <span>P90 - 积极情景：较高参考区间</span>
        </div>
      </div>
      <p className="chart-disclaimer">⚠️ 虚线表示情景推演，实线表示基准参考。本图表为趋势分析可视化，不构成投资建议��</p>
    </div>
  )
}

export default WealthChart
