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
              <h4>整体运势倾向</h4>
              <div className="score">参考评分: {bazi_analysis.fortune_score}/10</div>
              <p>{bazi_analysis.fortune_summary}</p>
            </div>
            <div className="analysis-card">
              <h4>财运倾向分析</h4>
              <div className="score">参考评分: {bazi_analysis.wealth_score}/10</div>
              <p>{bazi_analysis.wealth_luck}</p>
            </div>
            <div className="analysis-card">
              <h4>事业运势倾向</h4>
              <div className="score">参考评分: {bazi_analysis.career_score}/10</div>
              <p>{bazi_analysis.career_luck}</p>
            </div>
          </div>

          <div className="months-info">
            <div className="good-months">
              <h4>✨ 相对有利月份</h4>
              <div className="month-tags">
                {bazi_analysis.best_months?.map((month, i) => (
                  <span key={i} className="month-tag good">{month}</span>
                ))}
              </div>
            </div>
            <div className="bad-months">
              <h4>⚠️ 需谨慎月份</h4>
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
          <h2>📊 行为风格分析</h2>
          <div className="trading-grid">
            <div className="trading-card">
              <h4>行为风格</h4>
              <p>{trading_analysis.style}</p>
            </div>
            <div className="trading-card">
              <h4>风险倾向</h4>
              <p>{trading_analysis.risk_profile}</p>
            </div>
            <div className="trading-card">
              <h4>历史模式</h4>
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
          <h2>🎯 融合情景分析</h2>

          <div className="alignment-analysis">
            <h3>命理与行为契合度</h3>
            <p>{integrated_prediction.fortune_wealth_alignment}</p>
          </div>

          {integrated_prediction.key_opportunities?.length > 0 && (
            <div className="opportunities">
              <h3>💎 相对有利时段</h3>
              {integrated_prediction.key_opportunities.map((opp, i) => (
                <div key={i} className="opportunity-card">
                  <div className="month-badge">{opp.month}</div>
                  <div className="opportunity-content">
                    <p><strong>命理分析:</strong> {opp.fortune_reason}</p>
                    <p><strong>行为分析:</strong> {opp.trading_reason}</p>
                    <p className="recommendation">💡 参考思路: {opp.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {integrated_prediction.risk_warnings?.length > 0 && (
            <div className="warnings">
              <h3>⚠️ 需谨慎时段</h3>
              {integrated_prediction.risk_warnings.map((warn, i) => (
                <div key={i} className="warning-card">
                  <div className="month-badge warning">{warn.month}</div>
                  <div className="warning-content">
                    <p><strong>命理分析:</strong> {warn.fortune_reason}</p>
                    <p><strong>行为分析:</strong> {warn.trading_reason}</p>
                    <p className="recommendation">🛡️ 参考思路: {warn.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {annual_summary && (
        <section className="report-section summary-section">
          <h2>📝 2026年度情景总结</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h4>命理倾向总评</h4>
              <p>{annual_summary.fortune_outlook}</p>
            </div>
            <div className="summary-card">
              <h4>行为倾向总评</h4>
              <p>{annual_summary.wealth_outlook}</p>
            </div>
            <div className="summary-card full-width">
              <h4>综合参考思路</h4>
              <p>{annual_summary.integrated_advice}</p>
            </div>
          </div>

          {annual_summary.lucky_assets?.length > 0 && (
            <div className="assets-info">
              <h4>🎯 可关注方向（仅供参考）</h4>
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

      <section className="report-section disclaimer-section">
        <h2>📋 使用说明与风险提示</h2>
        <div className="disclaimer-content">
          <p><strong>内容性质：</strong>本页面内容为基于历史数据与模型假设的趋势性分析与情景推演，旨在提供参考视角，不构成任何投资建议、收益承诺或交易指导。</p>
          <p><strong>数据来源：</strong>分析基于用户提供的历史数据及命理推演模型，数据准确性和模型适用性存在局限。</p>
          <p><strong>风险提示：</strong>任何投资决策应基于个人独立判断，并充分考虑自身风险承受能力。过往表现不代表未来结果，市场存在不可预测的波动风险。</p>
          <p><strong>免责声明：</strong>本工具仅供娱乐和参考用途，使用者应对自身决策负全部责任。</p>
        </div>
      </section>
    </div>
  )
}

export default IntegratedReport
