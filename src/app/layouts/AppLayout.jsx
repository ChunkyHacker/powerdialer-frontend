import { Outlet } from 'react-router'
import Sidebar from '../../components/layout/Sidebar.jsx'

function AppLayout() {
  return (
    <div className="grid h-dvh min-w-0 grid-cols-[16rem_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-surface-page text-text-primary">
      <Sidebar />

      <header className="border-b border-border-default bg-surface-card px-8 py-4">
        <span className="text-role-navigation">Header</span>
      </header>

      <main className="min-w-0 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
