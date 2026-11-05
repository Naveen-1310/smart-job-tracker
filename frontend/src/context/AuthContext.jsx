import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * AuthContext — provides authentication state to the entire app.
 *
 * Contains:
 * - user: { userId, name, email } | null
 * - token: JWT string | null
 * - login(data): stores user + token after successful login
 * - logout(): clears state and redirects to login
 * - isAuthenticated: boolean
 */
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // checking localStorage on startup

  // On app load, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser  = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [])

  /**
   * Called after successful login/register.
   * Saves token and user info to state + localStorage.
   */
  const login = useCallback((authData) => {
    const userData = {
      userId: authData.userId,
      name:   authData.name,
      email:  authData.email,
    }
    setToken(authData.token)
    setUser(userData)
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user',  JSON.stringify(userData))
  }, [])

  /**
   * Clears all auth state and removes from localStorage.
   */
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
