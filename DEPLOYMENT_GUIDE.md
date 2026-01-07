# 🚀 部署到 Vercel 指南

## 步骤 1: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息:
   - Repository name: `blockchain-wealth-2026`
   - Description: `2026区块链年度财富曲线 - AI驱动的加密货币投资预测与可视化平台`
   - 选择 Public
   - **不要**勾选 "Add a README file"
3. 点击 "Create repository"

## 步骤 2: 推送代码到 GitHub

在终端执行以下命令:

```bash
cd /Users/nestle/blockchain-wealth-2026
git remote add origin https://github.com/YOUR_USERNAME/blockchain-wealth-2026.git
git branch -M main
git push -u origin main
```

**注意**: 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名

## 步骤 3: 部署到 Vercel

### 方式 1: 通过 Vercel 网站 (推荐)

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In" (使用 GitHub 账号登录)
3. 点击 "Add New..." → "Project"
4. 选择 `blockchain-wealth-2026` 仓库
5. 配置项目:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 "Deploy"

### 方式 2: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd frontend
vercel --prod
```

## 步骤 4: 配置环境变量 (可选)

如果需要配置后端 API 地址:

1. 在 Vercel 项目设置中
2. 进入 "Settings" → "Environment Variables"
3. 添加:
   - Name: `VITE_API_URL`
   - Value: 你的后端 API 地址

## 注意事项

### 关于后端部署

当前配置只部署前端。后端 Flask 应用需要单独部署:

**选项 1: 部署到 Railway/Render**
- Railway: https://railway.app
- Render: https://render.com

**选项 2: 使用 Vercel Serverless Functions**
- 需要将 Flask 代码转换为 Vercel Functions 格式

**选项 3: 使用其他云服务**
- AWS Lambda
- Google Cloud Functions
- Azure Functions

### 前端配置

如果后端部署到其他地方，需要更新 `frontend/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.com', // 更新为实际后端地址
        changeOrigin: true
      }
    }
  }
})
```

## 部署后访问

部署成功后，Vercel 会提供一个 URL，例如:
- https://blockchain-wealth-2026.vercel.app

## 自定义域名 (可选)

1. 在 Vercel 项目设置中
2. 进入 "Settings" → "Domains"
3. 添加你的自定义域名
4. 按照提示配置 DNS

## 故障排查

### 构建失败
- 检查 `package.json` 中的依赖是否完整
- 确保 Node.js 版本兼容 (推荐 18.x)

### 页面空白
- 检查浏览器控制台错误
- 确认 API 代理配置正确

### API 请求失败
- 确认后端已部署并可访问
- 检查 CORS 配置
- 更新 API 地址配置

---

**当前状态**: ✅ Git 仓库已初始化并提交代码
**下一步**: 创建 GitHub 仓库并推送代码
