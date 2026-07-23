import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext.jsx'

function ProtectedRoute() {
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
    return <Outlet />
  }

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
