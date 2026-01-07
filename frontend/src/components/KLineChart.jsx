import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts'
import './KLineChart.css'

function KLineChart({ data, title = '📊 2026趋势区间图', isProjection = false }) {
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
        rangeStart: item.open || prevValue,  // 区间起点
        rangeEnd: item.close,                 // 区间终点
        upperBound: item.high,                // 区间上沿
        lowerBound: item.low,                 // 区间下沿
        isPositive: item.close >= (item.open || prevValue),
        bodyRange: [Math.min(item.open || prevValue, item.close), Math.max(item.open || prevValue, item.close)]
      }
    })
  } else if (data.p50 && Array.isArray(data.p50)) {
    // 对象格式（p50/p90/p10）
    klineData = data.p50.map((item, index) => {
      const prevValue = index > 0 ? data.p50[index - 1].value : item.value
      const upperBound = data.p90?.[index]?.value || item.value
      const lowerBound = data.p10?.[index]?.value || item.value
      const rangeEnd = item.value
      const rangeStart = prevValue

      return {
        month: `${item.month}月`,
        monthNum: item.month,
        rangeStart,
        rangeEnd,
        upperBound,
        lowerBound,
        isPositive: rangeEnd >= rangeStart,
        bodyRange: [Math.min(rangeStart, rangeEnd), Math.max(rangeStart, rangeEnd)]
      }
    })
  } else {
    return null
  }

  if (!klineData || klineData.length === 0) return null

  const maxUpper = Math.max(...klineData.map(d => d.upperBound))
  const quarterMarks = klineData.filter(d => d.monthNum % 3 === 1)

  const CandleShape = (props) => {
    const { x, y, width, height, payload, yAxis } = props
    const isPositive = payload.isPositive
    const color = isPositive ? '#22c55e' : '#ef4444'
    const strokeColor = isPositive ? '#15803d' : '#b91c1c'

    let upperY = y
    let lowerY = y + height

    if (yAxis && typeof yAxis.scale === 'function') {
      try {
        upperY = yAxis.scale(payload.upperBound)
        lowerY = yAxis.scale(payload.lowerBound)
      } catch (e) {
        upperY = y
        lowerY = y + height
      }
    }

    const center = x + width / 2
    const renderHeight = height < 2 ? 2 : height
    // 情景推演模式使用虚线和半透明
    const opacity = isProjection ? 0.7 : 1
    const strokeDash = isProjection ? '4 2' : 'none'

    return (
      <g opacity={opacity}>
        <line x1={center} y1={upperY} x2={center} y2={lowerY} stroke={strokeColor} strokeWidth={2} strokeDasharray={strokeDash} />
        <rect x={x} y={y} width={width} height={renderHeight} fill={color} stroke={strokeColor} strokeWidth={1} rx={1} strokeDasharray={strokeDash} />
      </g>
    )
  }

  const PeakLabel = (props) => {
    const { x, y, width, value } = props
    if (value !== maxUpper) return null

    return (
      <g>
        <text x={x + width / 2} y={y - 12} fill="#6366f1" fontSize={10} fontWeight="bold" textAnchor="middle">
          参考峰值
        </text>
        <text x={x + width / 2} y={y - 2} fill="#4b5563" fontSize={9} textAnchor="middle">
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
          <span className="badge badge-up">正向 ▲</span>
          <span className="badge badge-down">负向 ▼</span>
          {isProjection && <span className="badge badge-projection">情景推演</span>}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={klineData} margin={{ top: 30, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} label={{ value: '月份', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }} />
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} label={{ value: '参考值', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload
                const isPositive = d.isPositive
                const change = ((d.rangeEnd - d.rangeStart) / d.rangeStart * 100).toFixed(2)

                return (
                  <div className="custom-tooltip-enhanced">
                    <div className="tooltip-header">
                      <span className="tooltip-month">{d.month}</span>
                      <span className={`tooltip-badge ${isPositive ? 'up' : 'down'}`}>{isPositive ? '正向 ▲' : '负向 ▼'}</span>
                    </div>
                    <div className="tooltip-grid">
                      <div><span>区间起点</span><strong>${d.rangeStart.toFixed(2)}</strong></div>
                      <div><span>区间终点</span><strong>${d.rangeEnd.toFixed(2)}</strong></div>
                      <div><span>区间上沿</span><strong>${d.upperBound.toFixed(2)}</strong></div>
                      <div><span>区间下沿</span><strong>${d.lowerBound.toFixed(2)}</strong></div>
                    </div>
                    <div className={`tooltip-change ${isPositive ? 'up' : 'down'}`}>波动幅度参考: {isPositive ? '+' : ''}{change}%</div>
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
            <LabelList dataKey="upperBound" position="top" content={<PeakLabel />} />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      <div className="kline-legend">
        <div className="legend-note">
          <p>📊 趋势区间图说明</p>
          <ul>
            <li><strong>区间主体</strong>: 区间起点与终点之间的波动范围</li>
            <li><strong>上沿线</strong>: 该时段可能达到的参考上限</li>
            <li><strong>下沿线</strong>: 该时段可能达到的参考下限</li>
            <li><strong>颜色含义</strong>: 绿色表示正向趋势，红色表示负向趋势</li>
            {isProjection && <li><strong>虚线样式</strong>: 表示情景推演数据，非历史实际数据</li>}
          </ul>
          <p className="chart-disclaimer">⚠️ 本图表为趋势区间可视化，不代表真实市场价格或收益预测</p>
        </div>
      </div>
    </div>
  )
}

export default KLineChart
