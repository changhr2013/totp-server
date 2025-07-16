/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置为静态导出
  output: 'export',
  // 禁用图片优化（Cloudflare Pages不需要）
  images: {
    unoptimized: true
  },
  // 确保所有路径都是相对路径
  trailingSlash: true
}

module.exports = nextConfig