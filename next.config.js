/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置为静态导出
  output: 'export',
  
  // 浏览器兼容性配置
  transpilePackages: ['lucide-react'],
  
  // 编译器配置 - 支持更广泛的浏览器
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 禁用图片优化（Cloudflare Pages不需要）
  images: {
    unoptimized: true
  },
  
  // 确保所有路径都是相对路径
  trailingSlash: true,
  
  // 实验性配置 - 禁用CSS优化以避免critters依赖
  experimental: {
    // 禁用CSS优化，避免critters依赖
    optimizeCss: false,
  }
}

module.exports = nextConfig