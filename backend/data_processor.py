import pandas as pd
from datetime import datetime
from typing import List, Dict

class DataProcessor:
    def __init__(self):
        self.ledger = []

    def process_csv(self, file, exchange: str) -> List[Dict]:
        """将交易所CSV转换为统一账本格式"""
        df = pd.read_csv(file)

        if exchange.lower() == 'binance':
            return self._process_binance(df)
        elif exchange.lower() == 'bybit':
            return self._process_bybit(df)
        else:
            return self._process_generic(df)

    def _process_binance(self, df: pd.DataFrame) -> List[Dict]:
        """处理Binance格式"""
        records = []
        for _, row in df.iterrows():
            record = {
                'timestamp': row.get('Date(UTC)', ''),
                'source': 'Binance',
                'asset': row.get('Coin', ''),
                'amount': float(row.get('Change', 0)),
                'price_usd': float(row.get('Price', 0)),
                'fee_usd': 0,
                'type': 'trade',
                'tx_hash': None
            }
            records.append(record)
        self.ledger.extend(records)
        return records

    def _process_bybit(self, df: pd.DataFrame) -> List[Dict]:
        """处理Bybit格式"""
        records = []
        for _, row in df.iterrows():
            record = {
                'timestamp': row.get('Time', ''),
                'source': 'Bybit',
                'asset': row.get('Coin', ''),
                'amount': float(row.get('Amount', 0)),
                'price_usd': float(row.get('Price', 0)),
                'fee_usd': float(row.get('Fee', 0)),
                'type': row.get('Type', 'trade').lower(),
                'tx_hash': None
            }
            records.append(record)
        self.ledger.extend(records)
        return records

    def _process_generic(self, df: pd.DataFrame) -> List[Dict]:
        """处理通用格式"""
        records = []
        for _, row in df.iterrows():
            record = {
                'timestamp': row.get('timestamp', row.get('date', '')),
                'source': 'Generic',
                'asset': row.get('asset', row.get('coin', '')),
                'amount': float(row.get('amount', 0)),
                'price_usd': float(row.get('price', 0)),
                'fee_usd': float(row.get('fee', 0)),
                'type': 'trade',
                'tx_hash': None
            }
            records.append(record)
        self.ledger.extend(records)
        return records

    def get_ledger(self) -> List[Dict]:
        """获取统一账本"""
        return self.ledger

    def analyze_history(self, ledger: List[Dict]) -> Dict:
        """分析历史数据"""
        if not ledger:
            return {}

        total_fees = sum(r['fee_usd'] for r in ledger)
        total_volume = sum(abs(r['amount'] * r['price_usd']) for r in ledger)
        unique_assets = len(set(r['asset'] for r in ledger))

        return {
            'total_transactions': len(ledger),
            'total_fees': total_fees,
            'total_volume': total_volume,
            'unique_assets': unique_assets,
            'fee_ratio': total_fees / total_volume if total_volume > 0 else 0
        }
