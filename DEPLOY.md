# Cloudflare Pages 部署指南

## 一键部署

### 1. 安装依赖并构建
```bash
npm install
npm run build:deploy
```

### 2. 获取部署包
构建完成后，会生成 `totp-demo-cloudflare.tar.gz` 文件，可用于直接上传到 Cloudflare Pages。

## 手动部署步骤

### 方法1：使用Cloudflare Dashboard
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 **Pages** → **Create a project**
3. 选择 **Upload assets**
4. 上传 `totp-demo-cloudflare.tar.gz` 文件
5. 设置站点名称并完成部署

### 方法2：使用Wrangler CLI
```bash
# 安装Wrangler
npm install -g wrangler

# 登录Cloudflare
wrangler login

# 部署到Pages
wrangler pages deploy out --project-name=totp-demo
```

### 方法3：GitHub集成（推荐）
1. 将代码推送到GitHub仓库
2. 在Cloudflare Pages中选择 **Connect to Git**
3. 选择GitHub仓库
4. 设置构建设置：
   - **构建命令**: `npm run export`
   - **构建输出目录**: `out`

## 构建设置配置

### 环境变量
在Cloudflare Pages设置中添加：
```
NODE_VERSION=18
```

### 构建设置
- **Framework preset**: None
- **Build command**: `npm run export`
- **Build output directory**: `out`
- **Root directory**: `/`

## 验证部署

部署完成后，访问您的域名，应该能看到TOTP演示系统正常运行。

## 注意事项

1. 由于是静态站点，所有数据存储在浏览器localStorage中
2. 不同浏览器/设备间的数据不共享
3. 清除浏览器数据会丢失所有用户信息
4. 适合演示和测试用途

## 故障排除

### 构建失败
如果构建失败，请检查：
- Node.js版本 >= 16
- 所有依赖已正确安装
- 项目结构完整

### 样式问题
确保所有CSS文件和静态资源正确上传。