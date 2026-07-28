/**
 * Completes mock authentication and safely returns the user to the route that
 * originally required login.
 *
 * Destination validation is repeated here because navigation is the final
 * boundary before an untrusted route-state value is used.
 */
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../../contexts/AuthContext.jsx'

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

function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Login | PowerDialer'
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    // Update authentication first so the protected boundary permits the
    // destination when navigation runs immediately afterward.
    login()
    navigate(getSafeDestination(location.state?.from), { replace: true })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-role-page-title">Login</h1>
      <button type="submit">Sign in</button>
    </form>
  )
}

export default LoginPage
