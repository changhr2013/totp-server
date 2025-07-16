# TOTP 前端演示系统

一个基于Next.js的TOTP（基于时间的一次性密码）双因子认证演示应用。实现了完整的用户注册、TOTP密钥生成、二维码展示、登录验证等功能。

## 功能特性

- ✅ **用户注册** - 创建账户并自动生成TOTP密钥和二维码
- ✅ **用户登录** - 使用用户名和TOTP验证码进行双因子认证
- ✅ **TOTP展示** - 实时显示所有用户的当前验证码
- ✅ **本地存储** - 使用localStorage存储用户数据，无需后端
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **实时更新** - TOTP验证码每30秒自动更新

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **TOTP实现**: 基于RFC 6238标准
- **二维码生成**: qrcode.js
- **加密**: crypto-js

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建Cloudflare Pages部署包

```bash
npm install
npm run build:deploy
```

这会生成 `totp-demo-cloudflare.tar.gz` (~470KB)，可直接上传到 Cloudflare Pages。

### 部署到Cloudflare Pages
1. **一键打包**: `npm run build:deploy`
2. **上传文件**: 将生成的压缩包上传到 Cloudflare Pages
3. **完成部署**: 无需额外配置，直接可用

## 部署方式

### Cloudflare Pages（推荐）
- **文件大小**: ~470KB 压缩包
- **部署时间**: < 1分钟
- **支持**: 全球CDN、自动HTTPS

### 其他平台
- **Vercel**: 直接连接GitHub仓库
- **Netlify**: 拖放上传或使用Git集成
- **GitHub Pages**: 使用GitHub Actions自动部署

## 使用说明

### 1. 注册新用户
- 点击"注册新账户"
- 填写用户名和邮箱
- 系统自动生成TOTP密钥和二维码
- 使用Google Authenticator等应用扫描二维码或手动输入密钥

### 2. 登录系统
- 点击"用户登录"
- 输入用户名和身份验证器显示的6位验证码
- 完成双因子认证登录

### 3. 查看TOTP
- 访问"TOTP口令"页面
- 选择任意用户查看实时验证码
- 验证码每30秒自动更新

## TOTP技术细节

- **算法**: HMAC-SHA-1
- **时间步长**: 30秒
- **验证码长度**: 6位数字
- **密钥格式**: Base32
- **标准**: RFC 6238 (TOTP)

## 项目结构

```
totp-frontend/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 布局组件
│   ├── page.tsx             # 首页
│   ├── register/            # 注册页面
│   ├── login/               # 登录页面
│   └── totp/                # TOTP展示页面
├── lib/
│   ├── types.ts             # TypeScript类型定义
│   ├── storage.ts           # 本地存储管理
│   └── totp.ts              # TOTP算法实现
├── components/
│   └── LoadingSpinner.tsx   # 加载组件
└── package.json
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

- 本应用为演示用途，所有数据存储在浏览器本地
- 清除浏览器数据会删除所有用户信息
- 实际生产环境请使用安全的后端存储

## 许可证

MIT License