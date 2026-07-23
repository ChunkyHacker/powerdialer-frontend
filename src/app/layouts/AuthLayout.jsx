import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext.jsx'

function getSafeDestination(from) {
  if (
    typeof from?.pathname !== 'string' ||
    !from.pathname.startsWith('/') ||
    from.pathname.startsWith('//') ||
    from.pathname === '/login'
  ) {
    return '/dashboard'
  }

  return {
    pathname: from.pathname,
    search: typeof from.search === 'string' ? from.search : '',
    hash: typeof from.hash === 'string' ? from.hash : '',
  }
}

function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main aria-busy="true" aria-live="polite">
        Checking session...
      </main>
    )
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={getSafeDestination(location.state?.from)}
        replace
      />
    )
  }

  return (
    <main>
      <Outlet />
    </main>
  )
}

export default AuthLayout
