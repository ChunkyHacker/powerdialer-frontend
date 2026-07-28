/**
 * Keeps organization selection locally while the header controls whether this
 * menu is open.
 */
import { useEffect, useRef, useState } from 'react'

const organizations = ['Acme Corp', 'Support Team']

function OrganizationSwitcher({ isOpen, onOpenChange }) {
  const [selectedOrganization, setSelectedOrganization] = useState(
    organizations[0],
  )
  const containerRef = useRef(null)
  const triggerRef = useRef(null)

  // Global listeners exist only while open: outside interaction dismisses the
  // menu, Escape also restores trigger focus, and cleanup avoids duplicates.
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

  // Selection closes the controlled menu before returning focus to its trigger
  // so keyboard navigation resumes from a predictable location.
  function selectOrganization(organization) {
    setSelectedOrganization(organization)
    onOpenChange(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="organization-options"
        onClick={() => onOpenChange(!isOpen)}
        className={[
          'flex h-control-md flex-col items-end justify-center rounded-md px-2',
          'text-text-primary transition-colors hover:bg-surface-page',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
        ].join(' ')}
      >
        <span className="text-role-navigation">Admin User</span>
        <span className="text-role-helper text-text-secondary">
          {selectedOrganization}
        </span>
      </button>

      {isOpen && (
        <div
          id="organization-options"
          className="absolute top-full right-0 mt-2 w-48 rounded-md border border-border-default bg-surface-card p-1 shadow-md"
        >
          <p className="text-role-table-heading px-3 py-2 uppercase text-text-secondary">
            Organization
          </p>
          <ul>
            {organizations.map((organization) => (
              <li key={organization}>
                <button
                  type="button"
                  onClick={() => selectOrganization(organization)}
                  className={[
                    'text-role-navigation w-full rounded-sm px-3 py-2 text-left',
                    'transition-colors hover:bg-surface-page',
                    'focus-visible:outline-2 focus-visible:outline-brand-accent',
                    organization === selectedOrganization
                      ? 'text-brand-accent-hover'
                      : 'text-text-primary',
                  ].join(' ')}
                >
                  {organization}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default OrganizationSwitcher
