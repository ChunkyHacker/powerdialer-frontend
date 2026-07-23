import { useEffect, useState } from 'react'
import { Bell, Moon, Sun } from 'lucide-react'
import { useMatches } from 'react-router'
import { defaultHeaderSearchPlaceholder } from '../../constants/headerSearchPlaceholders.js'
import HeaderIconButton from './HeaderIconButton.jsx'
import HeaderSearch from './HeaderSearch.jsx'
import OrganizationSwitcher from './OrganizationSwitcher.jsx'
import UserProfileMenu from './UserProfileMenu.jsx'

function GlobalHeader() {
  const matches = useMatches()
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => document.documentElement.dataset.theme === 'dark',
  )
  const [openMenu, setOpenMenu] = useState(null)
  const searchPlaceholder =
    [...matches]
      .reverse()
      .find((match) => match.handle?.searchPlaceholder)?.handle
      .searchPlaceholder ?? defaultHeaderSearchPlaceholder

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkTheme ? 'dark' : 'light'
  }, [isDarkTheme])

  function setMenu(menuName, isOpen) {
    setOpenMenu(isOpen ? menuName : null)
  }

  return (
    <header className="relative z-10 flex h-16 min-w-0 flex-nowrap items-center gap-6 border-b border-border-default bg-surface-card px-8">
      <div className="flex min-w-0 flex-1 items-center">
        <HeaderSearch placeholder={searchPlaceholder} />
      </div>

      <div className="flex shrink-0 flex-nowrap items-center gap-3 whitespace-nowrap">
        <HeaderIconButton label="Notifications">
          <Bell aria-hidden="true" className="size-4" />
        </HeaderIconButton>

        <HeaderIconButton
          label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
          aria-pressed={isDarkTheme}
          onClick={() => setIsDarkTheme((currentTheme) => !currentTheme)}
        >
          {isDarkTheme ? (
            <Sun aria-hidden="true" className="size-4" />
          ) : (
            <Moon aria-hidden="true" className="size-4" />
          )}
        </HeaderIconButton>

        <span
          aria-hidden="true"
          className="mx-2 h-6 w-px bg-border-default"
        />

        <OrganizationSwitcher
          isOpen={openMenu === 'organization'}
          onOpenChange={(isOpen) => setMenu('organization', isOpen)}
        />

        <UserProfileMenu
          isOpen={openMenu === 'profile'}
          onOpenChange={(isOpen) => setMenu('profile', isOpen)}
        />
      </div>
    </header>
  )
}

export default GlobalHeader
