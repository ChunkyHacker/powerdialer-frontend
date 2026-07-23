import { useEffect } from 'react'

function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found | PowerDialer'
  }, [])

  return <h1 className="text-role-page-title">Page not found</h1>
}

export default NotFoundPage
