'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { UserStorage } from '@/lib/storage'
import { TOTPGenerator } from '@/lib/totp'
import { Copy, Check } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<any>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copiedSecret, setCopiedSecret] = useState(false)
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
      const secret = TOTPGenerator.generateSecret()
      
      const newUser = storage.createUser({
        username: formData.username,
        email: formData.email,
        secret
      })

      // Generate QR code
      const otpAuthUrl = TOTPGenerator.getOTPAuthURL(
        newUser.username,
        newUser.secret,
        'TOTP Demo'
      )
      
      const qrUrl = await QRCode.toDataURL(otpAuthUrl)
      setQrCodeUrl(qrUrl)
      setRegisteredUser({
        ...newUser,
        otpAuthUrl
      })
    } catch (err: any) {
      setError(err.message || '注册失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (registeredUser) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-green-600">注册成功！</h2>
          <p className="text-gray-600 mb-6">
            请使用以下信息配置您的身份验证器应用：
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">用户名：</h3>
              <p className="text-gray-700">{registeredUser.username}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">密钥：</h3>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-3 py-1 rounded font-mono">
                  {registeredUser.secret}
                </code>
                <button
                  onClick={() => copyToClipboard(registeredUser.secret)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="复制密钥"
                >
                  {copiedSecret ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4">扫描二维码：</h3>
              {qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img src={qrCodeUrl} alt="TOTP QR Code" className="border border-gray-200" />
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">使用说明：</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>使用Google Authenticator、Authy或其他TOTP应用</li>
                <li>扫描上方二维码或手动输入密钥</li>
                <li>应用将每30秒生成一个新的6位验证码</li>
                <li>登录时请使用当前显示的验证码</li>
              </ul>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => router.push('/login')}
                className="btn-primary flex-1"
              >
                前往登录
              </button>
              <button
                onClick={() => {
                  setRegisteredUser(null)
                  setQrCodeUrl('')
                  setFormData({ username: '', email: '', password: '' })
                }}
                className="btn-secondary flex-1"
              >
                继续注册
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">用户注册</h2>
        
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
              minLength={3}
              maxLength={20}
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              required
              placeholder="请输入邮箱地址"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              required
              minLength={6}
              placeholder="请输入密码（至少6位）"
            />
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '注册中...' : '注册并配置TOTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            已有账户？ <a href="/login" className="text-primary-600 hover:text-primary-700">立即登录</a>
          </p>
        </div>
      </div>
    </div>
  )
}