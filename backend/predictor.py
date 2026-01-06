import numpy as np
from typing import List, Dict
from datetime import datetime, timedelta

class WealthPredictor:
    def __init__(self):
        self.risk_multipliers = {
            'conservative': 0.5,
            'balanced': 1.0,
            'aggressive': 1.5
        }

    def predict(self, ledger: List[Dict], risk_profile: str, monthly_input: float, max_drawdown: float) -> Dict:
        """生成2026年度财富预测"""

        # 计算历史统计
        returns = self._calculate_returns(ledger)
        volatility = self._calculate_volatility(returns)
        avg_return = np.mean(returns) if returns else 0

        # 调整风险系数
        risk_mult = self.risk_multipliers.get(risk_profile, 1.0)

        # 生成12个月预测
        months = 12
        predictions = self._generate_scenarios(
            avg_return,
            volatility,
            risk_mult,
            monthly_input,
            months
        )

        # 计算成本分析
        cost_analysis = self._analyze_costs(ledger)

        return {
            'predictions': predictions,
            'cost_analysis': cost_analysis,
            'risk_metrics': {
                'historical_volatility': volatility,
                'avg_monthly_return': avg_return,
                'max_drawdown': max_drawdown
            }
        }

    def _calculate_returns(self, ledger: List[Dict]) -> List[float]:
        """计算历史收益率"""
        if not ledger:
            return []

        # 简化计算：基于交易金额变化
        returns = []
        for i in range(1, len(ledger)):
            prev_val = ledger[i-1]['amount'] * ledger[i-1]['price_usd']
            curr_val = ledger[i]['amount'] * ledger[i]['price_usd']
            if prev_val != 0:
                ret = (curr_val - prev_val) / abs(prev_val)
                returns.append(ret)
        return returns

    def _calculate_volatility(self, returns: List[float]) -> float:
        """计算波动率"""
        if not returns:
            return 0.1
        return np.std(returns)

    def _generate_scenarios(self, avg_return: float, volatility: float, risk_mult: float, monthly_input: float, months: int) -> Dict:
        """生成P10/P50/P90情景预测"""

        base_value = 10000  # 假设初始资产

        # 生成三种情景
        scenarios = {
            'p10': [],  # 悲观
            'p50': [],  # 基准
            'p90': []   # 乐观
        }

        for month in range(months):
            # P10 (悲观): 低收益 + 高波动
            p10_return = avg_return - volatility * risk_mult * 1.5
            p10_value = base_value * (1 + p10_return) ** month + monthly_input * month
            scenarios['p10'].append({
                'month': month + 1,
                'value': max(0, p10_value)
            })

            # P50 (基准): 平均收益
            p50_return = avg_return
            p50_value = base_value * (1 + p50_return) ** month + monthly_input * month
            scenarios['p50'].append({
                'month': month + 1,
                'value': max(0, p50_value)
            })

            # P90 (乐观): 高收益 - 低波动
            p90_return = avg_return + volatility * risk_mult * 1.5
            p90_value = base_value * (1 + p90_return) ** month + monthly_input * month
            scenarios['p90'].append({
                'month': month + 1,
                'value': max(0, p90_value)
            })

        return scenarios

    def _analyze_costs(self, ledger: List[Dict]) -> Dict:
        """分析成本结构"""
        total_fees = sum(r['fee_usd'] for r in ledger)

        # 按类型分类成本
        cost_by_type = {}
        for record in ledger:
            tx_type = record['type']
            cost_by_type[tx_type] = cost_by_type.get(tx_type, 0) + record['fee_usd']

        return {
            'total_fees': total_fees,
            'breakdown': cost_by_type,
            'avg_fee_per_tx': total_fees / len(ledger) if ledger else 0
        }
