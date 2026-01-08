import { useState } from 'react'
import './SolanaPayment.css'

const RECIPIENT_ADDRESS = 'A8ZCfGnnSejoYhABCUDQXxEvMG4RWs2Ym6HevRzqJbQ1'

function SolanaPayment() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(RECIPIENT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="solana-payment">
      <div className="payment-card">
        <div className="payment-icon">💝</div>
        <h2>赞助支持</h2>
        <p className="payment-desc">您的赞助将帮助我们持续提供优质的 AI 分析服务</p>

        <div className="price-box">
          <div className="price">1 USDC</div>
          <div className="price-usd">≈ $1.00 USD (Solana 链)</div>
        </div>

        <div className="features-list">
          <div className="feature-item">✅ AI 自动分析交易数据</div>
          <div className="feature-item">✅ 八字命理融合分析</div>
          <div className="feature-item">✅ 2026 年度完整报告</div>
          <div className="feature-item">✅ 趋势图表可视化</div>
          <div className="feature-item">💎 支持项目持续发展</div>
        </div>

        <div style={{
          background: '#f3f4f6',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#374151' }}>
            收款地址（Solana USDC）：
          </p>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '8px',
            wordBreak: 'break-all',
            fontSize: '13px',
            fontFamily: 'monospace',
            marginBottom: '12px',
            border: '2px solid #e5e7eb'
          }}>
            {RECIPIENT_ADDRESS}
          </div>
          <button
            onClick={handleCopy}
            className="pay-button"
            style={{ marginBottom: '12px' }}
          >
            {copied ? '✅ 已复制' : '📋 复制地址'}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${RECIPIENT_ADDRESS}`}
              alt="收款二维码"
              style={{
                width: '200px',
                height: '200px',
                border: '4px solid white',
                borderRadius: '8px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 0 0' }}>
              扫码或复制地址，使用任意 Solana 钱包转账 1 USDC
            </p>
          </div>
        </div>

        <p className="payment-note">
          💡 支持 Phantom、Solflare 等所有 Solana 钱包
        </p>
      </div>
    </div>
  )
}

export default SolanaPayment
