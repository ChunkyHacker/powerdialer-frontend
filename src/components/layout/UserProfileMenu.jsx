import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

const profileActions = [
  { label: 'Profile', disabled: true },
  { label: 'Account Settings', path: '/settings' },
  { label: 'Sign Out' },
]

function UserProfileMenu({ isOpen, onOpenChange }) {
  const containerRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        onOpenChange(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onOpenChange(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onOpenChange])

  function closeMenu() {
    onOpenChange(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        aria-controls="user-profile-options"
        onClick={() => onOpenChange(!isOpen)}
        className={[
          'flex size-control-md items-center justify-center rounded-full',
          'transition-colors hover:bg-surface-page',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
        ].join(' ')}
      >
        <span className="text-role-navigation flex size-9 items-center justify-center rounded-full bg-brand-secondary text-surface-card">
          AU
        </span>
      </button>

      {isOpen && (
        <div
          id="user-profile-options"
          className="absolute top-full right-0 mt-2 w-48 rounded-md border border-border-default bg-surface-card p-1 shadow-md"
        >
          <div className="border-b border-border-default px-3 py-2">
            <p className="text-role-navigation text-text-primary">Admin User</p>
            <p className="text-role-helper text-text-secondary">Acme Corp</p>
          </div>
          <ul className="pt-1">
            {profileActions.map((action) => (
              <li key={action.label}>
                {action.path ? (
                  <Link
                    to={action.path}
                    onClick={closeMenu}
                    className={[
                      'text-role-navigation block w-full rounded-sm px-3 py-2 text-left text-text-primary',
                      'transition-colors hover:bg-surface-page',
                      'focus-visible:outline-2 focus-visible:outline-brand-accent',
                    ].join(' ')}
                  >
                    {action.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={action.disabled}
                    onClick={closeMenu}
                    className={[
                      'text-role-navigation w-full rounded-sm px-3 py-2 text-left text-text-primary',
                      'transition-colors hover:bg-surface-page',
                      'focus-visible:outline-2 focus-visible:outline-brand-accent',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                    ].join(' ')}
                  >
                    {action.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserProfileMenu
