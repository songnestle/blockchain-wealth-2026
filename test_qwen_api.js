// 测试阿里通义千问 API（OpenAI 兼容模式）
const QWEN_API_ENDPOINT = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

async function testQwenAPI(apiKey) {
  console.log('🧪 开始测试千问 API（OpenAI 兼容模式）...\n')

  if (!apiKey) {
    console.error('❌ 错误: 请提供 API Key')
    console.log('使用方法: node test_qwen_api.js YOUR_API_KEY')
    process.exit(1)
  }

  const requestBody = {
    model: 'qwen-plus',
    messages: [
      {
        role: 'user',
        content: '你好，请用一句话介绍你自己。'
      }
    ]
  }

  try {
    console.log('📡 正在调用千问 API...')
    console.log(`端点: ${QWEN_API_ENDPOINT}`)
    console.log(`模型: qwen-plus\n`)

    const response = await fetch(QWEN_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log(`响应状态: ${response.status} ${response.statusText}\n`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API 调用失败:')
      console.error(errorText)
      process.exit(1)
    }

    const data = await response.json()
    console.log('✅ API 调用成功!\n')
    console.log('📝 完整响应:')
    console.log(JSON.stringify(data, null, 2))
    console.log('\n💬 AI 回复:')
    console.log(data.choices?.[0]?.message?.content || '无响应内容')
    console.log('\n✨ 测试通过！千问 API 工作正常。')

  } catch (error) {
    console.error('❌ 测试失败:')
    console.error(error.message)
    process.exit(1)
  }
}

// 从命令行参数获取 API Key
const apiKey = process.argv[2]
testQwenAPI(apiKey)
