import { useState } from 'react'
import './FileUpload.css'

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null)
  const [exchange, setExchange] = useState('binance')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (file) {
      onUpload(file, exchange)
    }
  }

  return (
    <form className="file-upload" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>选择交易所</label>
        <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
          <option value="binance">Binance</option>
          <option value="bybit">Bybit</option>
          <option value="generic">通用格式</option>
        </select>
      </div>

      <div className="form-group">
        <label>上传CSV文件</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button type="submit" disabled={!file}>
        上传数据
      </button>
    </form>
  )
}

export default FileUpload
