import { Navigate, Outlet } from 'react-router'

function ProtectedRoute() {
  // TODO: Replace this temporary value with backend or auth-context state.
  const isAuthenticated = false

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
