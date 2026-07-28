/**
 * Controlled compound dialog rendered in a document-body portal.
 *
 * Context coordinates visibility, dismissal policy, panel refs, and registered
 * title/description IDs so DialogContent can enforce modal focus and labeling.
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

const DialogContext = createContext(null)

const dialogSizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function useDialogContext(componentName) {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error(`${componentName} must be used within Dialog`)
  }

  return context
}

function normalizeId(prefix, id) {
  return `${prefix}-${id.replaceAll(':', '')}`
}

// Focus candidates must still be connected, visible, enabled, and outside hidden
// or inert ancestry before initial focus, trapping, or restoration can use them.
function isUsableFocusTarget(element) {
  if (!(element instanceof HTMLElement) || !element.isConnected) {
    return false
  }

  if (
    element.hidden ||
    element.closest('[hidden], [inert], [aria-hidden="true"]') ||
    element.getAttribute('aria-disabled') === 'true' ||
    element.getClientRects().length === 0
  ) {
    return false
  }

  return !('disabled' in element && element.disabled)
}

function getFocusableElements(panel) {
  if (!panel) {
    return []
  }

  return [...panel.querySelectorAll(focusableSelector)].filter(
    isUsableFocusTarget,
  )
}

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

export function Dialog({
  open,
  onOpenChange,
  initialFocusRef,
  restoreFocusRef,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  children,
}) {
  const generatedId = useId()
  const titleId = normalizeId('dialog-title', generatedId)
  const descriptionId = normalizeId('dialog-description', generatedId)
  const panelRef = useRef(null)
  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)
  const getPanel = useCallback(() => panelRef.current, [])
  const setPanelNode = useCallback((node) => {
    panelRef.current = node
  }, [])

  const requestClose = useCallback(
    (reason) => {
      onOpenChange?.(false, reason)
    },
    [onOpenChange],
  )

  const contextValue = useMemo(
    () => ({
      closeOnEscape,
      closeOnOutsideClick,
      descriptionId,
      hasDescription,
      hasTitle,
      initialFocusRef,
      open: Boolean(open),
      getPanel,
      registerDescription: setHasDescription,
      registerTitle: setHasTitle,
      requestClose,
      restoreFocusRef,
      setPanelNode,
      titleId,
    }),
    [
      closeOnEscape,
      closeOnOutsideClick,
      descriptionId,
      getPanel,
      hasDescription,
      hasTitle,
      initialFocusRef,
      open,
      requestClose,
      restoreFocusRef,
      setPanelNode,
      titleId,
    ],
  )

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogContent({
  size = 'md',
  role = 'dialog',
  className = '',
  children,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...contentProps
}) {
  const {
    closeOnEscape: contextCloseOnEscape,
    closeOnOutsideClick: contextCloseOnOutsideClick,
    descriptionId,
    getPanel,
    hasDescription,
    hasTitle,
    initialFocusRef,
    open,
    requestClose,
    restoreFocusRef,
    setPanelNode,
    titleId,
  } = useDialogContext('DialogContent')
  const escapeDismissEnabled = contextCloseOnEscape
  const outsideDismissEnabled = contextCloseOnOutsideClick
  const previousFocusRef = useRef(null)
  const initialFocusFrameRef = useRef(null)
  const restoreFocusFrameRef = useRef(null)
  const closeOnEscapeRef = useRef(escapeDismissEnabled)
  const requestCloseRef = useRef(requestClose)
  const selectedSize =
    dialogSizeClasses[size] ?? dialogSizeClasses.md
  const selectedRole = role === 'alertdialog' ? 'alertdialog' : 'dialog'

  const setPanelRef = useCallback(
    (node) => {
      setPanelNode(node)
      setRef(ref, node)
    },
    [ref, setPanelNode],
  )

  useEffect(() => {
    closeOnEscapeRef.current = escapeDismissEnabled
    requestCloseRef.current = requestClose
  }, [escapeDismissEnabled, requestClose])

  // While open, this effect locks body scrolling, installs Escape dismissal,
  // schedules initial focus, and restores the requested or previous focus target.
  // Cleanup reverses global state and cancels pending initial-focus work.
  useEffect(() => {
    if (!open) {
      return undefined
    }

    if (restoreFocusFrameRef.current !== null) {
      cancelAnimationFrame(restoreFocusFrameRef.current)
      restoreFocusFrameRef.current = null
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const requestedRestoreTarget = restoreFocusRef?.current

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEscape(event) {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        !closeOnEscapeRef.current
      ) {
        return
      }

      event.preventDefault()
      requestCloseRef.current('escape')
    }

    document.addEventListener('keydown', handleEscape)

    initialFocusFrameRef.current = requestAnimationFrame(() => {
      initialFocusFrameRef.current = null
      const panel = getPanel()
      const requestedTarget = initialFocusRef?.current
      const target = isUsableFocusTarget(requestedTarget)
        ? requestedTarget
        : getFocusableElements(panel)[0]

      if (target) {
        target.focus()
      } else {
        panel?.focus()
      }
    })

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousBodyOverflow

      if (initialFocusFrameRef.current !== null) {
        cancelAnimationFrame(initialFocusFrameRef.current)
        initialFocusFrameRef.current = null
      }

      const fallbackRestoreTarget = previousFocusRef.current

      restoreFocusFrameRef.current = requestAnimationFrame(() => {
        restoreFocusFrameRef.current = null
        const target = isUsableFocusTarget(requestedRestoreTarget)
          ? requestedRestoreTarget
          : isUsableFocusTarget(fallbackRestoreTarget)
            ? fallbackRestoreTarget
            : null

        target?.focus()
      })
    }
  }, [
    getPanel,
    initialFocusRef,
    open,
    restoreFocusRef,
  ])

  useEffect(
    () => () => {
      if (initialFocusFrameRef.current !== null) {
        cancelAnimationFrame(initialFocusFrameRef.current)
      }
    },
    [],
  )

  if (!open) {
    return null
  }

  // Tab is contained within usable panel controls; an empty panel or externally
  // displaced focus falls back to the panel or the appropriate boundary item.
  function handlePanelKeyDown(event) {
    contentProps.onKeyDown?.(event)

    if (event.defaultPrevented || event.key !== 'Tab') {
      return
    }

    const panel = getPanel()
    const focusableElements = getFocusableElements(panel)

    if (focusableElements.length === 0) {
      event.preventDefault()
      panel?.focus()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements.at(-1)
    const activeElement = document.activeElement

    if (!panel?.contains(activeElement)) {
      event.preventDefault()
      ;(event.shiftKey ? lastElement : firstElement).focus()
    } else if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  // The overlay owns outside-click detection, while the panel consumes explicit
  // labels first and registered title/description IDs as accessible fallbacks.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex min-h-full items-center justify-center bg-brand-primary/60 p-4 sm:p-6"
      onPointerDown={(event) => {
        if (
          event.target === event.currentTarget &&
          outsideDismissEnabled
        ) {
          requestClose('outside')
        }
      }}
    >
      <div
        {...contentProps}
        ref={setPanelRef}
        role={selectedRole}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledBy ?? (hasTitle ? titleId : undefined)
        }
        aria-describedby={
          ariaDescribedBy ??
          (hasDescription ? descriptionId : undefined)
        }
        tabIndex={-1}
        onKeyDown={handlePanelKeyDown}
        className={[
          'flex max-h-[calc(100dvh-2rem)] w-full min-h-0 flex-col overflow-hidden rounded-xl border border-border-default bg-surface-card text-text-primary shadow-lg sm:max-h-[calc(100dvh-3rem)]',
          'focus:outline-none',
          selectedSize,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function DialogHeader({
  className = '',
  children,
  ...headerProps
}) {
  return (
    <div
      {...headerProps}
      className={[
        'flex shrink-0 items-start justify-between gap-4 border-b border-border-default px-5 py-4 sm:px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function DialogTitle({
  className = '',
  children,
  ...titleProps
}) {
  const context = useDialogContext('DialogTitle')
  const { registerTitle, titleId } = context

  useEffect(() => {
    registerTitle(true)
    return () => registerTitle(false)
  }, [registerTitle])

  return (
    <h2
      {...titleProps}
      id={titleId}
      className={[
        'text-role-section-title min-w-0 text-text-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h2>
  )
}

export function DialogDescription({
  className = '',
  children,
  ...descriptionProps
}) {
  const context = useDialogContext('DialogDescription')
  const { descriptionId, registerDescription } = context

  useEffect(() => {
    registerDescription(true)
    return () => registerDescription(false)
  }, [registerDescription])

  return (
    <p
      {...descriptionProps}
      id={descriptionId}
      className={[
        'mt-1 text-role-helper text-text-secondary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  )
}

export function DialogBody({
  className = '',
  children,
  ...bodyProps
}) {
  return (
    <div
      {...bodyProps}
      className={[
        'min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function DialogFooter({
  className = '',
  children,
  ...footerProps
}) {
  return (
    <div
      {...footerProps}
      className={[
        'flex shrink-0 flex-col-reverse gap-3 border-t border-border-default px-5 py-4 sm:flex-row sm:justify-end sm:px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function DialogClose({
  reason = 'close-button',
  onClick,
  type = 'button',
  children,
  ...buttonProps
}) {
  const context = useDialogContext('DialogClose')

  return (
    <Button
      {...buttonProps}
      type={type}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          context.requestClose(reason)
        }
      }}
    >
      {children}
    </Button>
  )
}
