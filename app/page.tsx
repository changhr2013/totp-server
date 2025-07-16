'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserStorage } from '@/lib/storage'
import { User } from '@/lib/types'
import { User as UserIcon, LogOut, Key, UserPlus, Users } from 'lucide-react'

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userCount, setUserCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const storage = UserStorage.getInstance()
    setCurrentUser(storage.getCurrentUser())
    setUserCount(storage.getAllUsers().length)
  }, [])

  const handleLogout = () => {
    const storage = UserStorage.getInstance()
    storage.clearCurrentUser()
    setCurrentUser(null)
    router.push('/')
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          TOTP 双因子认证演示系统
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          体验基于时间的一次性密码（TOTP）的双因子认证系统，安全、实时、易于集成
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">TOTP算法</h3>
            <p className="text-gray-600 text-sm">
              基于RFC 6238标准，使用HMAC-SHA-1算法，每30秒生成新的6位验证码
            </p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">本地存储</h3>
            <p className="text-gray-600 text-sm">
              使用浏览器localStorage存储用户数据，无需后端服务器，纯前端演示
            </p>
            <p className="text-sm text-gray-500 mt-2">当前用户数：{userCount}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">完整流程</h3>
            <p className="text-gray-600 text-sm">
              支持用户注册、TOTP密钥生成、二维码展示、登录验证等完整认证流程
            </p>
          </div>
        </div>
      </div>

      {currentUser ? (
        <div className="max-w-md mx-auto mb-8">
          <div className="card text-center">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-primary-600" />
            <h2 className="text-2xl font-bold mb-2">欢迎回来！</h2>
            <p className="text-gray-600 mb-4">
              当前用户：<span className="font-semibold">{currentUser.username}</span>
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>邮箱：{currentUser.email}</p>
              {currentUser.lastLogin && (
                <p>上次登录：{new Date(currentUser.lastLogin).toLocaleString()}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary mt-4 inline-flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto mb-8">
          <div className="card text-center">
            <Key className="w-16 h-16 mx-auto mb-4 text-primary-600" />
            <h2 className="text-2xl font-bold mb-2">开始使用</h2>
            <p className="text-gray-600 mb-4">
              体验安全的双因子认证系统
            </p>
            <div className="space-x-4">
              <a href="/register" className="btn-primary inline-flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>注册新账户</span>
              </a>
              <a href="/login" className="btn-secondary inline-flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>用户登录</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            <Key className="w-6 h-6 inline-block mr-2" />
            快速开始
          </h2>
          <div className="text-left space-y-4 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold">注册新用户</h3>
                <p className="text-sm text-gray-600">点击"注册新账户"，填写用户名和邮箱，系统会自动生成TOTP密钥和二维码</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold">配置身份验证器</h3>
                <p className="text-sm text-gray-600">使用Google Authenticator、Authy等应用扫描二维码，或手动输入密钥</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold">登录验证</h3>
                <p className="text-sm text-gray-600">在登录页面输入用户名和身份验证器显示的6位验证码完成登录</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-semibold">查看TOTP口令</h3>
                <p className="text-sm text-gray-600">使用TOTP口令页面查看所有用户的实时验证码，便于测试和验证</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <a href="/register" className="btn-primary">开始体验
            </a>
            <a href="/totp" className="btn-secondary">查看TOTP口令
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}