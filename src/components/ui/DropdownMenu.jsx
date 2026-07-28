/**
 * Compound controlled or uncontrolled menu rendered through a positioned portal.
 *
 * Registered items provide accessible keyboard focus order while the trigger,
 * content, and dismissal behavior share state through context.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import Button from './Button.jsx'
import { useFloatingPosition } from './floatingPosition.js'

const DropdownMenuContext = createContext(null)

function useMenuContext(componentName) {
  const context = useContext(DropdownMenuContext)
  if (!context) {
    throw new Error(`${componentName} must be used within DropdownMenu`)
  }
  return context
}

function getEnabledItems(items) {
  return items.filter((item) => !item.disabled)
}

export function DropdownMenu({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}) {
  const isControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const itemsRef = useRef(new Map())
  const triggerRef = useRef(null)
  const contentRef = useRef(null)
  const initialFocusRef = useRef('first')
  const contentId = `dropdown-menu-${useId().replace(/:/g, '')}`
  const isOpen = isControlled ? open : uncontrolledOpen

  const setOpen = useCallback(
    (nextOpen) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  // Dismissal can optionally restore trigger focus on the next frame, after the
  // controlled or uncontrolled close update has removed the menu content.
  const close = useCallback(
    ({ restoreFocus = false } = {}) => {
      setOpen(false)
      if (restoreFocus) {
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    },
    [setOpen],
  )

  const registerItem = useCallback((id, item) => {
    itemsRef.current.set(id, item)
    return () => itemsRef.current.delete(id)
  }, [])

  const getItems = useCallback(
    () =>
      [...itemsRef.current.values()].sort((a, b) => {
        if (!a.ref.current || !b.ref.current) {
          return 0
        }
        return a.ref.current.compareDocumentPosition(b.ref.current) &
          Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1
      }),
    [],
  )

  // The outside-pointer listener exists only while open and is removed by the
  // effect cleanup, avoiding persistent document handlers across menu lifetimes.
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (
        !triggerRef.current?.contains(event.target) &&
        !contentRef.current?.contains(event.target)
      ) {
        close()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [close, isOpen])

  const contextValue = useMemo(
    () => ({
      close,
      contentId,
      contentRef,
      getItems,
      initialFocusRef,
      isOpen,
      registerItem,
      setOpen,
      triggerRef,
    }),
    [close, contentId, getItems, isOpen, registerItem, setOpen],
  )

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  onClick,
  onKeyDown,
  ref,
  ...buttonProps
}) {
  const context = useMenuContext('DropdownMenuTrigger')

  function setTriggerRef(node) {
    context.triggerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || buttonProps.disabled) {
      return
    }

    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      context.initialFocusRef.current =
        event.key === 'ArrowUp' ? 'last' : 'first'
      context.setOpen(true)
    }
  }

  return (
    <Button
      {...buttonProps}
      ref={setTriggerRef}
      aria-haspopup="menu"
      aria-expanded={context.isOpen}
      aria-controls={context.contentId}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          context.initialFocusRef.current = 'first'
          context.setOpen(!context.isOpen)
        }
      }}
    />
  )
}

export function DropdownMenuContent({
  align = 'start',
  className = '',
  children,
}) {
  const context = useMenuContext('DropdownMenuContent')
  const { style, updatePosition } = useFloatingPosition({
    open: context.isOpen,
    triggerRef: context.triggerRef,
    contentRef: context.contentRef,
    align,
  })

  useEffect(() => {
    if (!context.isOpen) {
      return
    }

    requestAnimationFrame(() => {
      updatePosition()
      const items = getEnabledItems(context.getItems())
      const target =
        context.initialFocusRef.current === 'last' ? items.at(-1) : items[0]
      target?.ref.current?.focus()
    })
  }, [
    context.getItems,
    context.initialFocusRef,
    context.isOpen,
    updatePosition,
  ])

  if (!context.isOpen) {
    return null
  }

  function moveFocus(direction) {
    const items = getEnabledItems(context.getItems())
    if (!items.length) {
      return
    }
    const currentIndex = items.findIndex(
      (item) => item.ref.current === document.activeElement,
    )
    const nextIndex =
      currentIndex < 0
        ? direction > 0
          ? 0
          : items.length - 1
        : (currentIndex + direction + items.length) % items.length
    items[nextIndex].ref.current?.focus()
  }

  // Arrow and boundary keys move among enabled items; Escape closes and restores
  // the trigger, while Tab closes without overriding normal focus progression.
  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const items = getEnabledItems(context.getItems())
      const target = event.key === 'Home' ? items[0] : items.at(-1)
      target?.ref.current?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      context.close({ restoreFocus: true })
    } else if (event.key === 'Tab') {
      context.close()
    }
  }

  return createPortal(
    <div
      ref={context.contentRef}
      id={context.contentId}
      role="menu"
      style={style}
      onKeyDown={handleKeyDown}
      className={[
        'z-50 min-w-48 overflow-y-auto rounded-lg border border-border-default bg-surface-card p-1 shadow-lg',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>,
    document.body,
  )
}

export function DropdownMenuItem({
  variant = 'default',
  disabled = false,
  onSelect,
  onClick,
  className = '',
  children,
  ref,
  ...buttonProps
}) {
  const context = useMenuContext('DropdownMenuItem')
  const id = `dropdown-item-${useId().replace(/:/g, '')}`
  const itemRef = useRef(null)

  function setItemRef(node) {
    itemRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  useEffect(
    () => context.registerItem(id, { id, disabled, ref: itemRef }),
    [context.registerItem, disabled, id],
  )

  function activate(event) {
    if (disabled) {
      return
    }
    onClick?.(event)
    if (event.defaultPrevented) {
      return
    }
    onSelect?.(event)
    if (!event.defaultPrevented) {
      context.close({ restoreFocus: true })
    }
  }

  return (
    <button
      {...buttonProps}
      ref={setItemRef}
      type="button"
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      onClick={activate}
      className={[
        'flex w-full items-center rounded-md px-3 py-2 text-left text-role-navigation outline-none transition-colors',
        variant === 'danger'
          ? 'text-danger hover:bg-danger/10 focus-visible:bg-danger/10 focus-visible:outline-2 focus-visible:outline-danger'
          : 'text-text-primary hover:bg-surface-page focus-visible:bg-surface-page focus-visible:outline-2 focus-visible:outline-brand-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className = '' }) {
  return (
    <div
      role="separator"
      className={['my-1 h-px bg-border-default', className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
