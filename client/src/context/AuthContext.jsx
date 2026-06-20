/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ghurbo_token'))
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ghurbo_user')
    if (savedUser) {
      try {
        return JSON.parse(savedUser)
      } catch (err) {
        console.error('Error parsing saved user from localStorage:', err)
        localStorage.removeItem('ghurbo_user')
      }
    }
    return null
  })
  const [loading] = useState(false)

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('ghurbo_user', JSON.stringify(userData))
    localStorage.setItem('ghurbo_token', userToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ghurbo_user')
    localStorage.removeItem('ghurbo_token')
  }

  const isAuthenticated = Boolean(user && token)

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
