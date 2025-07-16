import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TOTP Demo - Two-Factor Authentication',
  description: 'A demonstration of TOTP-based two-factor authentication system',
  other: {
    'color-scheme': 'light',
    'supported-color-schemes': 'light',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  TOTP 演示系统
                </h1>
                <nav className="flex space-x-6">
                  <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors">首页</a>
                  <a href="/register" className="text-gray-600 hover:text-primary-600 transition-colors">注册</a>
                  <a href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">登录</a>
                  <a href="/totp" className="text-gray-600 hover:text-primary-600 transition-colors">TOTP口令</a>
                </nav>
              </div>
            </div>
          </header>
          <main className="min-h-[calc(100vh-120px)]">
            {children}
          </main>
          <footer className="bg-white border-t py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-gray-500">
                <p>TOTP双因子认证演示系统 - 基于Next.js和RFC 6238标准实现</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}