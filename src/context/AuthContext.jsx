import { createContext, useContext, useState, useEffect } from 'react'
import { apiGetMe } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('smartgrid_token'))

  useEffect(() => {
    const token = localStorage.getItem('smartgrid_token')
    if (!token) return

    apiGetMe()
      .then(userData => {
        setUser(userData)
      })
      .catch((err) => {
        console.error('Auth verification failed:', err)
        localStorage.removeItem('smartgrid_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('smartgrid_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('smartgrid_token')
    setUser(null)
  }

  const isAdmin = user?.user_type === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
