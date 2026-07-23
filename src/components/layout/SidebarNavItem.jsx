import { NavLink } from 'react-router'

function SidebarNavItem({ item }) {
  const Icon = item.icon

  return (
    <li>
      <NavLink
        to={item.path}
        end={item.end}
        className={({ isActive }) =>
          [
            'text-role-navigation flex items-center gap-3 rounded-md px-3 py-2.5',
            'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
            isActive
              ? 'bg-brand-secondary text-brand-accent'
              : 'text-surface-card hover:bg-brand-secondary hover:text-brand-accent',
          ].join(' ')
        }
      >
        <Icon aria-hidden="true" className="size-5 shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    </li>
  )
}

export default SidebarNavItem
