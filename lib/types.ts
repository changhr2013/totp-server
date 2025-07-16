export interface User {
  id: string
  username: string
  email: string
  secret: string // Base32 encoded TOTP secret
  createdAt: Date
  lastLogin?: Date
}

export interface AuthResponse {
  success: boolean
  user?: User
  message?: string
}

export interface TOTPConfig {
  period: number // seconds
  digits: number
  algorithm: string
}