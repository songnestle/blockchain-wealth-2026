from flask import Flask, request, jsonify
from flask_cors import CORS
from data_processor import DataProcessor
from predictor import WealthPredictor

app = Flask(__name__)
CORS(app)

processor = DataProcessor()
predictor = WealthPredictor()

@app.route('/api/upload', methods=['POST'])
def upload_data():
    """处理CSV文件上传"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    exchange = request.form.get('exchange', 'unknown')

    try:
        ledger = processor.process_csv(file, exchange)
        return jsonify({
            'success': True,
            'records': len(ledger),
            'message': f'Successfully processed {len(ledger)} transactions'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """生成2026年度财富预测"""
    data = request.json
    risk_profile = data.get('risk_profile', 'balanced')
    monthly_input = data.get('monthly_input', 0)
    max_drawdown = data.get('max_drawdown', 0.3)

    try:
        ledger = processor.get_ledger()
        if not ledger:
            return jsonify({'error': 'No data available'}), 400

        prediction = predictor.predict(ledger, risk_profile, monthly_input, max_drawdown)
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    """获取历史数据分析"""
    try:
        ledger = processor.get_ledger()
        analysis = processor.analyze_history(ledger)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
