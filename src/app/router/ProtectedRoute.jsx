/**
 * Enforces authentication before protected descendants render.
 *
 * This boundary decides access only; the nested AppLayout renders the shell.
 */
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext.jsx'

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Waiting for session resolution avoids redirecting before authentication is
  // known, which would otherwise produce incorrect or visible route changes.
  if (isLoading) {
    return (
      <main aria-busy="true" aria-live="polite">
        Checking session...
      </main>
    )
  }

  if (isAuthenticated) {
    return <Outlet />
  }

  // Preserve the complete internal destination so login can restore the exact
  // path, query, and in-page location originally requested.
  const requestedLocation = {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{ from: requestedLocation }}
    />
  )
}

export default ProtectedRoute
