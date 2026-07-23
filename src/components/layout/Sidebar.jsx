import { Phone } from 'lucide-react'
import {
  bottomNavigationItems,
  mainNavigationItems,
} from '../../constants/sidebarNavigation.js'
import SidebarNavItem from './SidebarNavItem.jsx'

function Sidebar() {
  return (
    <aside className="row-span-2 flex min-h-0 flex-col bg-brand-primary px-4 py-6 text-surface-card">
      <div className="flex items-center gap-3 px-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-accent text-brand-primary">
          <Phone aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <p className="text-role-section-title truncate">PowerDialer</p>
          <p className="text-role-table-heading truncate uppercase text-brand-accent">
            Sales Cockpit
          </p>
        </div>
      </div>

      <nav
        aria-label="Primary navigation"
        className="mt-6 flex min-h-0 flex-1 flex-col gap-4"
      >
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {mainNavigationItems.map((item) => (
            <SidebarNavItem key={item.path} item={item} />
          ))}
        </ul>

        <ul className="border-t border-brand-secondary pt-4">
          {bottomNavigationItems.map((item) => (
            <SidebarNavItem key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
