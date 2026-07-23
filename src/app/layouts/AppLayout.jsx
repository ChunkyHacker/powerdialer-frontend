import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router'
import Breadcrumbs from '../../components/navigation/Breadcrumbs.jsx'
import GlobalHeader from '../../components/layout/GlobalHeader.jsx'
import Sidebar from '../../components/layout/Sidebar.jsx'

function AppLayout() {
  const { pathname } = useLocation()
  const matches = useMatches()
  const mainContentRef = useRef(null)
  const currentTitle = [...matches]
    .reverse()
    .find((match) => match.handle?.title)?.handle.title

  useEffect(() => {
    document.title = currentTitle
      ? `${currentTitle} | PowerDialer`
      : 'PowerDialer'
  }, [currentTitle])

  useEffect(() => {
    mainContentRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="grid h-dvh min-w-0 grid-cols-[16rem_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-surface-page text-text-primary">
      <Sidebar />

      <GlobalHeader />

      <main
        ref={mainContentRef}
        tabIndex="-1"
        className="min-w-0 overflow-y-auto p-8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-accent"
      >
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
