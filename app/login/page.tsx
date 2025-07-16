'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserStorage } from '@/lib/storage'
import { TOTPGenerator } from '@/lib/totp'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    totpCode: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const storage = UserStorage.getInstance()
      const user = storage.getUserByUsername(formData.username)

      if (!user) {
        setError('用户不存在')
        return
      }

      // 验证TOTP代码
      const isValid = TOTPGenerator.verify(user.secret, formData.totpCode)

      if (!isValid) {
        setError('TOTP验证码无效')
        return
      }

      // 更新最后登录时间
      storage.updateLastLogin(user.id)
      
      // 设置当前用户
      storage.setCurrentUser(user)

      // 重定向到首页
      router.push('/')
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">用户登录</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="label">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input-field"
              required
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label htmlFor="totpCode" className="label">TOTP验证码</label>
            <input
              type="text"
              id="totpCode"
              name="totpCode"
              value={formData.totpCode}
              onChange={handleInputChange}
              className="input-field"
              required
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="请输入6位验证码"
            />
            <p className="text-sm text-gray-600 mt-1">
              请在您的身份验证器应用中查看当前验证码
            </p>
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '验证中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            还没有账户？ <a href="/register" className="text-primary-600 hover:text-primary-700">立即注册</a>
          </p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">测试说明：</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>首次使用请先注册新账户</li>
            <li>注册后会获得TOTP密钥和二维码</li>
            <li>使用Google Authenticator等应用扫描二维码</li>
            <li>输入当前显示的6位验证码完成登录</li>
            <li>也可使用 <a href="/totp" className="text-primary-600">TOTP口令页面</a> 查看当前验证码</li>
          </ul>
        </div>
      </div>
    </div>
  )
}