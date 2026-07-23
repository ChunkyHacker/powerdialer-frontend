import { useEffect } from 'react'

function LoginPage() {
  useEffect(() => {
    document.title = 'Login | PowerDialer'
  }, [])

  return <h1 className="text-role-page-title">Login</h1>
}

export default LoginPage
