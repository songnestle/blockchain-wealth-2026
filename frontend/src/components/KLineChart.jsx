import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts'
import './KLineChart.css'

function KLineChart({ data, title = '📊 2026财富K线图' }) {
  if (!data || !Array.isArray(data)) return null

  // 处理两种数据格式：直接数组 或 {p50, p90, p10} 对象
  let klineData

  if (Array.isArray(data)) {
    // 直接是数组格式（life_kline）
    klineData = data.map((item, index) => {
      const prevValue = index > 0 ? data[index - 1].close : item.open
      return {
        month: `${item.month}月`,
        monthNum: item.month,
        open: item.open || prevValue,
        close: item.close,
        high: item.high,
        low: item.low,
        isUp: item.close >= (item.open || prevValue),
        bodyRange: [Math.min(item.open || prevValue, item.close), Math.max(item.open || prevValue, item.close)]
      }
    })
  } else if (data.p50 && Array.isArray(data.p50)) {
    // 对象格式（p50/p90/p10）
    klineData = data.p50.map((item, index) => {
      const prevValue = index > 0 ? data.p50[index - 1].value : item.value
      const high = data.p90?.[index]?.value || item.value
      const low = data.p10?.[index]?.value || item.value
      const close = item.value
      const open = prevValue

      return {
        month: `${item.month}月`,
        monthNum: item.month,
        open,
        close,
        high,
        low,
        isUp: close >= open,
        bodyRange: [Math.min(open, close), Math.max(open, close)]
      }
    })
  } else {
    return null
  }

  if (!klineData || klineData.length === 0) return null

  const maxHigh = Math.max(...klineData.map(d => d.high))
  const quarterMarks = klineData.filter(d => d.monthNum % 3 === 1)

  const CandleShape = (props) => {
    const { x, y, width, height, payload, yAxis } = props
    const isUp = payload.close >= payload.open
    const color = isUp ? '#22c55e' : '#ef4444'
    const strokeColor = isUp ? '#15803d' : '#b91c1c'

    let highY = y
    let lowY = y + height

    if (yAxis && typeof yAxis.scale === 'function') {
      try {
        highY = yAxis.scale(payload.high)
        lowY = yAxis.scale(payload.low)
      } catch (e) {
        highY = y
        lowY = y + height
      }
    }

    const center = x + width / 2
    const renderHeight = height < 2 ? 2 : height

    return (
      <g>
        <line x1={center} y1={highY} x2={center} y2={lowY} stroke={strokeColor} strokeWidth={2} />
        <rect x={x} y={y} width={width} height={renderHeight} fill={color} stroke={strokeColor} strokeWidth={1} rx={1} />
      </g>
    )
  }

  const PeakLabel = (props) => {
    const { x, y, width, value } = props
    if (value !== maxHigh) return null

    return (
      <g>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          transform={`translate(${x + width / 2 - 6}, ${y - 24}) scale(0.5)`}
          fill="#ef4444"
          stroke="#b91c1c"
          strokeWidth="1"
        />
        <text x={x + width / 2} y={y - 28} fill="#b91c1c" fontSize={10} fontWeight="bold" textAnchor="middle">
          ${value.toFixed(0)}
        </text>
      </g>
    )
  }

  return (
    <div className="kline-chart">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="legend-badges">
          <span className="badge badge-up">涨 ▲</span>
          <span className="badge badge-down">跌 ▼</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={klineData} margin={{ top: 30, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} label={{ value: '月份', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }} />
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} label={{ value: '财富($)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload
                const isUp = d.close >= d.open
                const change = ((d.close - d.open) / d.open * 100).toFixed(2)

                return (
                  <div className="custom-tooltip-enhanced">
                    <div className="tooltip-header">
                      <span className="tooltip-month">{d.month}</span>
                      <span className={`tooltip-badge ${isUp ? 'up' : 'down'}`}>{isUp ? '涨 ▲' : '跌 ▼'}</span>
                    </div>
                    <div className="tooltip-grid">
                      <div><span>开盘</span><strong>${d.open.toFixed(2)}</strong></div>
                      <div><span>收盘</span><strong>${d.close.toFixed(2)}</strong></div>
                      <div><span>最高</span><strong>${d.high.toFixed(2)}</strong></div>
                      <div><span>最低</span><strong>${d.low.toFixed(2)}</strong></div>
                    </div>
                    <div className={`tooltip-change ${isUp ? 'up' : 'down'}`}>{isUp ? '↑' : '↓'} {Math.abs(change)}%</div>
                  </div>
                )
              }
              return null
            }}
            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          {quarterMarks.map((point, index) => (
            <ReferenceLine key={`q-${index}`} x={point.month} stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth={1} />
          ))}
          <Bar dataKey="bodyRange" shape={<CandleShape />} isAnimationActive={true} animationDuration={1500}>
            <LabelList dataKey="high" position="top" content={<PeakLabel />} />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      <div className="kline-legend">
        <div className="legend-note">
          <p>💡 K线图说明</p>
          <ul>
            <li><strong>实体</strong>: 开盘价与收盘价之间的区域</li>
            <li><strong>上影线</strong>: 最高价与实体顶部的距离</li>
            <li><strong>下影线</strong>: 最低价与实体底部的距离</li>
            <li><strong>红星⭐</strong>: 标记年度财富最高点</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default KLineChart
