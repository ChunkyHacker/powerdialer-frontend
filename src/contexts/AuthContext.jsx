/**
 * Provides the application-wide authentication state and actions.
 * The consumer hook rejects usage outside this provider boundary.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  authenticateWithPassword,
  authenticateWithProvider,
  clearMockSession,
  restoreMockSession,
  storeMockSession,
} from '../services/auth/mockAuthService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Resolve stored mock sessions asynchronously so route guards can wait for
  // authentication state before deciding whether to redirect.
  useEffect(() => {
    const sessionTimer = window.setTimeout(() => {
      setUser(restoreMockSession())
      setIsLoading(false)
    }, 0)

    return () => window.clearTimeout(sessionTimer)
  }, [])

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const authenticatedUser = await authenticateWithPassword({
      email,
      password,
    })

    storeMockSession(authenticatedUser, rememberMe)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const loginWithProvider = useCallback(
    async (provider, { rememberMe } = {}) => {
      const authenticatedUser =
        await authenticateWithProvider(provider)

      storeMockSession(authenticatedUser, rememberMe)
      setUser(authenticatedUser)
      return authenticatedUser
    },
    [],
  )

  const logout = useCallback(() => {
    clearMockSession()
    setUser(null)
  }, [])

  const authValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      loginWithProvider,
      logout,
    }),
    [isLoading, login, loginWithProvider, logout, user],
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
