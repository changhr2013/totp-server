import { User } from './types'

const STORAGE_KEY = 'totp_demo_users'
const CURRENT_USER_KEY = 'totp_demo_current_user'

export class UserStorage {
  private static instance: UserStorage
  
  static getInstance(): UserStorage {
    if (!UserStorage.instance) {
      UserStorage.instance = new UserStorage()
    }
    return UserStorage.instance
  }

  private getUsers(): User[] {
    if (typeof window === 'undefined') return []
    
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers()
    
    // 检查用户名是否已存在
    if (users.some(u => u.username === userData.username)) {
      throw new Error('用户名已存在')
    }
    
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
    
    users.push(newUser)
    this.saveUsers(users)
    
    return newUser
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers()
    return users.find(u => u.username === username) || null
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find(u => u.id === id) || null
  }

  getAllUsers(): User[] {
    return this.getUsers()
  }

  updateLastLogin(userId: string): void {
    const users = this.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date()
      this.saveUsers(users)
    }
  }

  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const data = localStorage.getItem(CURRENT_USER_KEY)
    if (!data) return null
    
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  clearCurrentUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  deleteUser(userId: string): boolean {
    const users = this.getUsers()
    const filteredUsers = users.filter(u => u.id !== userId)
    
    if (filteredUsers.length === users.length) {
      return false
    }
    
    this.saveUsers(filteredUsers)
    
    // 如果删除的是当前用户，也清除当前用户
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      this.clearCurrentUser()
    }
    
    return true
  }
}