/**
 * Hosts public authentication screens and redirects authenticated users back
 * into the protected application.
 */
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext.jsx'

// Only local application paths are accepted. Invalid, protocol-relative, or
// login-loop destinations fall back to the default authenticated screen.
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

  // Signed-in users should not remain on public auth routes; a validated return
  // destination preserves their original flow when one is available.
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
