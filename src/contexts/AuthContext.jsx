import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sessionTimer = window.setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => window.clearTimeout(sessionTimer)
  }, [])

  const authValue = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false),
    }),
    [isAuthenticated, isLoading],
  )

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

// The approved single auth module exports both its provider and consumer hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
