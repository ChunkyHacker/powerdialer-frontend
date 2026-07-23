import { Outlet } from 'react-router'
import GlobalHeader from '../../components/layout/GlobalHeader.jsx'
import Sidebar from '../../components/layout/Sidebar.jsx'

function AppLayout() {
  return (
    <div className="grid h-dvh min-w-0 grid-cols-[16rem_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-surface-page text-text-primary">
      <Sidebar />

      <GlobalHeader />

      <main className="min-w-0 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
