/**
 * Presents one notification while ToastProvider owns collection and queue state.
 *
 * This component owns the pausable auto-dismiss countdown and reports manual or
 * automatic dismissal through the provider callback.
 */
import { useEffect, useRef, useState } from 'react'
import {
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react'
import { createPortal } from 'react-dom'

const variantStyles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50',
    icon: 'text-emerald-700',
    Icon: CircleCheck,
    dismissLabel: 'Dismiss success notification',
  },
  error: {
    container: 'border-red-200 bg-red-50',
    icon: 'text-red-700',
    Icon: CircleX,
    dismissLabel: 'Dismiss error notification',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50',
    icon: 'text-amber-700',
    Icon: TriangleAlert,
    dismissLabel: 'Dismiss warning notification',
  },
  info: {
    container: 'border-sky-200 bg-sky-50',
    icon: 'text-sky-700',
    Icon: Info,
    dismissLabel: 'Dismiss informational notification',
  },
}

export function Toast({
  notification,
  documentHidden,
  onDismiss,
}) {
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const timerRef = useRef(null)
  const deadlineRef = useRef(null)
  const remainingRef = useRef(notification.duration)
  const revisionRef = useRef(notification.timerRevision)
  const selectedVariant =
    variantStyles[notification.variant] ?? variantStyles.info
  const Icon = selectedVariant.Icon
  const paused = hovered || focusWithin || documentHidden
  const autoDismiss =
    !notification.persistent && notification.phase !== 'exiting'
  const assertive = notification.variant === 'error'

  // Timer revisions restart updated notifications. Hover, contained focus, and
  // hidden documents pause the countdown while preserving its remaining time.
  useEffect(() => {
    if (revisionRef.current !== notification.timerRevision) {
      revisionRef.current = notification.timerRevision
      remainingRef.current = notification.duration
    }

    if (!autoDismiss || paused) {
      return undefined
    }

    const remaining = Math.max(0, remainingRef.current)

    if (remaining === 0) {
      const immediateTimer = window.setTimeout(
        () => onDismiss(notification.id),
        0,
      )
      return () => window.clearTimeout(immediateTimer)
    }

    deadlineRef.current = performance.now() + remaining
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      deadlineRef.current = null
      remainingRef.current = 0
      onDismiss(notification.id)
    }, remaining)

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }

      if (deadlineRef.current !== null) {
        remainingRef.current = Math.max(
          0,
          deadlineRef.current - performance.now(),
        )
        deadlineRef.current = null
      }
    }
  }, [
    autoDismiss,
    notification.duration,
    notification.id,
    notification.timerRevision,
    onDismiss,
    paused,
  ])

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusWithin(false)
    }
  }

  function handleKeyDown(event) {
    if (
      event.key === 'Escape' &&
      notification.dismissible &&
      !event.defaultPrevented
    ) {
      event.preventDefault()
      onDismiss(notification.id)
    }
  }

  // Errors announce assertively while other variants remain polite. Visible
  // text carries meaning, icons stay decorative, and reduced-motion classes
  // change animation only—not roles, labels, or dismissal behavior.
  return (
    <article
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
      className={[
        'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 text-text-primary shadow-lg',
        'transition-[opacity,transform] duration-200 motion-reduce:transform-none motion-reduce:transition-none',
        notification.phase === 'visible'
          ? 'translate-x-0 opacity-100'
          : 'translate-x-3 opacity-0',
        selectedVariant.container,
      ].join(' ')}
    >
      <Icon
        aria-hidden="true"
        className={[
          'mt-0.5 size-5 shrink-0',
          selectedVariant.icon,
        ].join(' ')}
      />

      <div className="min-w-0 flex-1 break-words">
        {notification.title !== null && (
          <p className="text-role-navigation font-semibold">
            {notification.title}
          </p>
        )}
        {notification.message !== null && (
          <p
            className={[
              'break-words text-role-helper text-text-secondary',
              notification.title !== null && 'mt-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {notification.message}
          </p>
        )}
      </div>

      {notification.dismissible && (
        <button
          type="button"
          aria-label={selectedVariant.dismissLabel}
          onClick={() => onDismiss(notification.id)}
          className={[
            '-m-1 flex size-8 shrink-0 items-center justify-center rounded-md text-text-secondary',
            'transition-colors hover:bg-surface-card/70 hover:text-text-primary',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
          ].join(' ')}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </article>
  )
}

export function ToastViewport({
  notifications,
  documentHidden,
  onDismiss,
}) {
  const portalTarget =
    typeof document === 'undefined' ? null : document.body

  if (!portalTarget || notifications.length === 0) {
    return null
  }

  return createPortal(
    <div
      aria-label="Notifications"
      className={[
        'pointer-events-none fixed inset-x-0 top-0 z-[80] flex flex-col items-stretch gap-3 p-3',
        'sm:right-4 sm:left-auto sm:w-full sm:max-w-sm sm:p-0 sm:pt-4',
        'pt-[max(0.75rem,env(safe-area-inset-top))]',
      ].join(' ')}
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          documentHidden={documentHidden}
          onDismiss={onDismiss}
        />
      ))}
    </div>,
    portalTarget,
  )
}
