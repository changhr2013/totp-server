import CryptoJS from 'crypto-js'
import { TOTPConfig } from './types'

export class TOTPGenerator {
  private static readonly DEFAULT_CONFIG: TOTPConfig = {
    period: 30, // 30 seconds
    digits: 6,
    algorithm: 'SHA-1'
  }

  /**
   * Generate a random base32 secret key
   */
  static generateSecret(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let secret = ''
    
    if (typeof window !== 'undefined' && window.crypto) {
      // Use crypto.getRandomValues for better randomness
      const array = new Uint8Array(length)
      window.crypto.getRandomValues(array)
      
      for (let i = 0; i < length; i++) {
        secret += chars[array[i] % chars.length]
      }
    } else {
      // Fallback to Math.random
      for (let i = 0; i < length; i++) {
        secret += chars[Math.floor(Math.random() * chars.length)]
      }
    }
    
    return secret
  }

  /**
   * Convert base32 string to hex
   */
  private static base32ToHex(base32: string): string {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let bits = ''
    let hex = ''

    for (let i = 0; i < base32.length; i++) {
      const val = base32Chars.indexOf(base32[i].toUpperCase())
      bits += val.toString(2).padStart(5, '0')
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
      const chunk = bits.substr(i, 8)
      hex = hex + parseInt(chunk, 2).toString(16).padStart(2, '0')
    }

    return hex
  }

  /**
   * Generate TOTP token
   */
  static generate(secret: string, timestamp: number = Date.now()): string {
    const config = this.DEFAULT_CONFIG
    const time = Math.floor(timestamp / 1000 / config.period)
    const timeHex = time.toString(16).padStart(16, '0')

    const secretHex = this.base32ToHex(secret)
    const secretBytes = CryptoJS.enc.Hex.parse(secretHex)
    const timeBytes = CryptoJS.enc.Hex.parse(timeHex)

    const hmac = CryptoJS.HmacSHA1(timeBytes, secretBytes)
    const hmacHex = hmac.toString(CryptoJS.enc.Hex)

    // Dynamic truncation
    const offset = parseInt(hmacHex.substr(-1), 16)
    const truncatedHash = hmacHex.substr(offset * 2, 8)
    const binary = parseInt(truncatedHash, 16) & 0x7fffffff

    const otp = binary % Math.pow(10, config.digits)
    return otp.toString().padStart(config.digits, '0')
  }

  /**
   * Get remaining time for current TOTP period
   */
  static getRemainingTime(): number {
    const now = Date.now()
    const period = this.DEFAULT_CONFIG.period * 1000
    return period - (now % period)
  }

  /**
   * Verify TOTP token
   */
  static verify(secret: string, token: string, window: number = 1): boolean {
    const currentTime = Date.now()
    const config = this.DEFAULT_CONFIG
    const periodMs = config.period * 1000

    // Check current time and +/- window periods
    for (let i = -window; i <= window; i++) {
      const testTime = currentTime + (i * periodMs)
      const expectedToken = this.generate(secret, testTime)
      
      if (token === expectedToken) {
        return true
      }
    }

    return false
  }

  /**
   * Generate OTPAuth URL for QR code
   */
  static getOTPAuthURL(
    username: string,
    secret: string,
    issuer: string = 'TOTP Demo'
  ): string {
    const encodedIssuer = encodeURIComponent(issuer)
    const encodedUsername = encodeURIComponent(username)
    
    return `otpauth://totp/${encodedIssuer}:${encodedUsername}?secret=${secret}&issuer=${encodedIssuer}`
  }

  /**
   * Get current TOTP info including token and remaining time
   */
  static getCurrentTOTP(secret: string): {
    token: string
    remainingTime: number
    progress: number
  } {
    const token = this.generate(secret)
    const remainingTime = this.getRemainingTime()
    const progress = remainingTime / (this.DEFAULT_CONFIG.period * 1000)

    return {
      token,
      remainingTime: Math.floor(remainingTime / 1000),
      progress
    }
  }
}