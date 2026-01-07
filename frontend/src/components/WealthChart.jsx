import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './WealthChart.css'

function WealthChart({ data }) {
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
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="P10"
            stroke="#ff6b6b"
            strokeWidth={2}
            name="悲观情景 (P10)"
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
            name="乐观情景 (P90)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="dot p10"></span>
          <span>P10 - 悲观情景：低收益 + 高波动</span>
        </div>
        <div className="legend-item">
          <span className="dot p50"></span>
          <span>P50 - 基准情景：平均收益</span>
        </div>
        <div className="legend-item">
          <span className="dot p90"></span>
          <span>P90 - 乐观情景：高收益 - 低波动</span>
        </div>
      </div>
    </div>
  )
}

export default WealthChart
