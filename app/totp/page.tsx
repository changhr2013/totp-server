'use client'

import { useState, useEffect } from 'react'
import { UserStorage } from '@/lib/storage'
import { TOTPGenerator } from '@/lib/totp'
import { User } from '@/lib/types'
import { Copy, Check } from 'lucide-react'

interface TOTPInfo {
  token: string
  remainingTime: number
  progress: number
  user: User
}

export default function TOTPPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [totpInfo, setTotpInfo] = useState<TOTPInfo | null>(null)
  const [copiedToken, setCopiedToken] = useState(false)

  useEffect(() => {
    const storage = UserStorage.getInstance()
    const allUsers = storage.getAllUsers()
    setUsers(allUsers)
    
    if (allUsers.length > 0 && !selectedUserId) {
      setSelectedUserId(allUsers[0].id)
    }
  }, [])

  useEffect(() => {
    if (!selectedUserId) return

    const storage = UserStorage.getInstance()
    const user = storage.getUserById(selectedUserId)
    
    if (!user) return

    const updateTOTP = () => {
      const info = TOTPGenerator.getCurrentTOTP(user.secret)
      setTotpInfo({
        ...info,
        user
      })
    }

    updateTOTP()
    const interval = setInterval(updateTOTP, 1000)

    return () => clearInterval(interval)
  }, [selectedUserId])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value)
    setTotpInfo(null)
  }

  if (users.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">TOTP动态口令</h2>
          <p className="text-gray-600 mb-4">
            暂无用户数据，请先注册新用户。
          </p>
          <a href="/register" className="btn-primary">
            前往注册
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">TOTP动态口令展示</h2>
        
        <div className="mb-6">
          <label htmlFor="user-select" className="label">
            选择用户
          </label>
          <select
            id="user-select"
            value={selectedUserId}
            onChange={handleUserChange}
            className="input-field max-w-xs"
          >
            <option value="">请选择用户</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {totpInfo && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">用户信息</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">用户名：</span>
                  <span>{totpInfo.user.username}</span>
                </div>
                <div>
                  <span className="font-medium">邮箱：</span>
                  <span>{totpInfo.user.email}</span>
                </div>
                <div>
                  <span className="font-medium">TOTP密钥：</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {totpInfo.user.secret}
                  </code>
                </div>
                <div>
                  <span className="font-medium">注册时间：</span>
                  <span>{new Date(totpInfo.user.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">当前TOTP口令</h3>
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-primary-600 mb-4">
                  {totpInfo.token}
                </div>
                
                <button
                  onClick={() => copyToClipboard(totpInfo.token)}
                  className="mb-4 p-2 hover:bg-gray-100 rounded inline-flex items-center space-x-2"
                  title="复制口令"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>复制口令</span>
                    </>
                  )}
                </button>

                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>剩余时间</span>
                    <span>{totpInfo.remainingTime}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${totpInfo.progress * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600 mt-4">
                  <p>口令每30秒更新一次</p>
                  <p>当前算法：SHA-1 | 长度：6位</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">使用说明</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium mb-2">开发者信息：</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>基于RFC 6238标准实现</li>
                <li>使用HMAC-SHA-1算法</li>
                <li>时间步长：30秒</li>
                <li>验证码长度：6位</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">测试提示：</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>可用于测试登录功能</li>
                <li>支持多个用户切换</li>
                <li>实时显示剩余时间</li>
                <li>一键复制当前验证码</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}