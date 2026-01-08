// Solana 支付配置
export const SOLANA_CONFIG = {
  // 收款钱包地址（请替换为你的实际地址）
  RECIPIENT_ADDRESS: 'YOUR_SOLANA_WALLET_ADDRESS_HERE',

  // 价格（SOL）
  PRICE_SOL: 0.1,

  // 网络配置
  NETWORK: 'mainnet-beta', // 'mainnet-beta' 或 'devnet'
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',

  // 支付有效期（天）
  PAYMENT_VALIDITY_DAYS: 30
}

// 测试网配置（开发时使用）
export const SOLANA_DEVNET_CONFIG = {
  RECIPIENT_ADDRESS: 'YOUR_DEVNET_WALLET_ADDRESS_HERE',
  PRICE_SOL: 0.01,
  NETWORK: 'devnet',
  RPC_ENDPOINT: 'https://api.devnet.solana.com',
  PAYMENT_VALIDITY_DAYS: 30
}
