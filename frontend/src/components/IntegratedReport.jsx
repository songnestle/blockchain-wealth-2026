import './IntegratedReport.css'

function IntegratedReport({ data }) {
  if (!data || !data.predictions) return null

  const { bazi_analysis, trading_analysis, integrated_prediction, annual_summary, predictions } = data

  return (
    <div className="integrated-report">
      {bazi_analysis && (
        <section className="report-section bazi-section">
          <h2>🔮 八字命理分析</h2>
          <div className="bazi-grid">
            <div className="bazi-card">
              <h3>四柱</h3>
              <div className="pillars">
                {bazi_analysis.pillars?.map((pillar, i) => (
                  <span key={i} className="pillar">{pillar}</span>
                ))}
              </div>
            </div>
            <div className="bazi-card">
              <h3>2026年流年</h3>
              <p className="year-info">{bazi_analysis.year_2026}</p>
            </div>
          </div>

          <div className="analysis-grid">
            <div className="analysis-card">
              <h4>整体运势</h4>
              <div className="score">评分: {bazi_analysis.fortune_score}/10</div>
              <p>{bazi_analysis.fortune_summary}</p>
            </div>
            <div className="analysis-card">
              <h4>财运分析</h4>
              <div className="score">评分: {bazi_analysis.wealth_score}/10</div>
              <p>{bazi_analysis.wealth_luck}</p>
            </div>
            <div className="analysis-card">
              <h4>事业运势</h4>
              <div className="score">评分: {bazi_analysis.career_score}/10</div>
              <p>{bazi_analysis.career_luck}</p>
            </div>
          </div>

          <div className="months-info">
            <div className="good-months">
              <h4>✨ 吉月</h4>
              <div className="month-tags">
                {bazi_analysis.best_months?.map((month, i) => (
                  <span key={i} className="month-tag good">{month}</span>
                ))}
              </div>
            </div>
            <div className="bad-months">
              <h4>⚠️ 凶月</h4>
              <div className="month-tags">
                {bazi_analysis.worst_months?.map((month, i) => (
                  <span key={i} className="month-tag bad">{month}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {trading_analysis && (
        <section className="report-section trading-section">
          <h2>📊 交易风格分析</h2>
          <div className="trading-grid">
            <div className="trading-card">
              <h4>交易风格</h4>
              <p>{trading_analysis.style}</p>
            </div>
            <div className="trading-card">
              <h4>风险偏好</h4>
              <p>{trading_analysis.risk_profile}</p>
            </div>
            <div className="trading-card">
              <h4>盈亏模式</h4>
              <p>{trading_analysis.profit_pattern}</p>
            </div>
            <div className="trading-card">
              <h4>成本结构</h4>
              <p>{trading_analysis.cost_structure}</p>
            </div>
          </div>
        </section>
      )}

      {integrated_prediction && (
        <section className="report-section integrated-section">
          <h2>🎯 融合预测分析</h2>

          <div className="alignment-analysis">
            <h3>命理与财富契合度</h3>
            <p>{integrated_prediction.fortune_wealth_alignment}</p>
          </div>

          {integrated_prediction.key_opportunities?.length > 0 && (
            <div className="opportunities">
              <h3>💎 关键机会月份</h3>
              {integrated_prediction.key_opportunities.map((opp, i) => (
                <div key={i} className="opportunity-card">
                  <div className="month-badge">{opp.month}</div>
                  <div className="opportunity-content">
                    <p><strong>命理分析:</strong> {opp.fortune_reason}</p>
                    <p><strong>交易分析:</strong> {opp.trading_reason}</p>
                    <p className="recommendation">💡 {opp.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {integrated_prediction.risk_warnings?.length > 0 && (
            <div className="warnings">
              <h3>⚠️ 风险警示月份</h3>
              {integrated_prediction.risk_warnings.map((warn, i) => (
                <div key={i} className="warning-card">
                  <div className="month-badge warning">{warn.month}</div>
                  <div className="warning-content">
                    <p><strong>命理分析:</strong> {warn.fortune_reason}</p>
                    <p><strong>交易分析:</strong> {warn.trading_reason}</p>
                    <p className="recommendation">🛡️ {warn.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {annual_summary && (
        <section className="report-section summary-section">
          <h2>📝 2026年度总结</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h4>命理总评</h4>
              <p>{annual_summary.fortune_outlook}</p>
            </div>
            <div className="summary-card">
              <h4>财富总评</h4>
              <p>{annual_summary.wealth_outlook}</p>
            </div>
            <div className="summary-card full-width">
              <h4>综合建议</h4>
              <p>{annual_summary.integrated_advice}</p>
            </div>
          </div>

          {annual_summary.lucky_assets?.length > 0 && (
            <div className="assets-info">
              <h4>🎯 推荐关注资产</h4>
              <div className="asset-tags">
                {annual_summary.lucky_assets.map((asset, i) => (
                  <span key={i} className="asset-tag">{asset}</span>
                ))}
              </div>
            </div>
          )}

          {annual_summary.avoid_periods?.length > 0 && (
            <div className="avoid-info">
              <h4>⚠️ 需谨慎时期</h4>
              <div className="period-tags">
                {annual_summary.avoid_periods.map((period, i) => (
                  <span key={i} className="period-tag">{period}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default IntegratedReport
