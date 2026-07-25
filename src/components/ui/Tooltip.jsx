import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useTooltipPosition } from './useTooltipPosition.js'

const TooltipContext = createContext(null)
let activeTooltipClose = null

function useTooltipContext(componentName) {
  const context = useContext(TooltipContext)

  if (!context) {
    throw new Error(`${componentName} must be used within Tooltip`)
  }

  return context
}

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

function mergeDescriptionIds(...values) {
  return (
    [
      ...new Set(
        values
          .flatMap((value) =>
            typeof value === 'string' ? value.trim().split(/\s+/) : [],
          )
          .filter(Boolean),
      ),
    ].join(' ') || undefined
  )
}

function normalizeDuration(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, value)
    : fallback
}

export function Tooltip({
  open,
  defaultOpen = false,
  onOpenChange,
  delayDuration = 500,
  closeDelay = 100,
  disabled = false,
  children,
}) {
  const isControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [contentId, setContentId] = useState(null)
  const [triggerElement, setTriggerElement] = useState(null)
  const generatedId = useId()
  const defaultContentId = `tooltip-${generatedId.replaceAll(':', '')}`
  const resolvedContentId = contentId ?? defaultContentId
  const pointerActiveRef = useRef(false)
  const focusActiveRef = useRef(false)
  const pointerSuppressedRef = useRef(false)
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const previousDisabledRef = useRef(disabled)
  const requestedOpen = isControlled ? Boolean(open) : uncontrolledOpen
  const isOpen = !disabled && requestedOpen
  const normalizedDelay = normalizeDuration(delayDuration, 500)
  const normalizedCloseDelay = normalizeDuration(closeDelay, 100)

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const requestOpenChange = useCallback(
    (nextOpen, reason) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen, reason)
    },
    [isControlled, onOpenChange],
  )

  const closeImmediately = useCallback(
    (reason) => {
      clearOpenTimer()
      clearCloseTimer()
      requestOpenChange(false, reason)
    },
    [clearCloseTimer, clearOpenTimer, requestOpenChange],
  )

  const requestCoordinatedOpen = useCallback(
    (reason) => {
      if (disabled) {
        return
      }

      if (activeTooltipClose && activeTooltipClose !== closeImmediately) {
        activeTooltipClose('coordination')
      }
      clearCloseTimer()
      requestOpenChange(true, reason)
    },
    [
      clearCloseTimer,
      closeImmediately,
      disabled,
      requestOpenChange,
    ],
  )

  const scheduleClose = useCallback(
    (reason) => {
      clearOpenTimer()
      clearCloseTimer()

      if (focusActiveRef.current || pointerActiveRef.current) {
        return
      }

      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null
        if (!focusActiveRef.current && !pointerActiveRef.current) {
          requestOpenChange(false, reason)
        }
      }, normalizedCloseDelay)
    },
    [
      clearCloseTimer,
      clearOpenTimer,
      normalizedCloseDelay,
      requestOpenChange,
    ],
  )

  const handlePointerEnter = useCallback(
    (event) => {
      if (
        disabled ||
        event.pointerType === 'touch' ||
        pointerSuppressedRef.current
      ) {
        return
      }

      pointerActiveRef.current = true
      clearCloseTimer()
      clearOpenTimer()

      if (isOpen || focusActiveRef.current) {
        return
      }

      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null
        if (
          pointerActiveRef.current &&
          !pointerSuppressedRef.current
        ) {
          requestCoordinatedOpen('pointer-enter')
        }
      }, normalizedDelay)
    },
    [
      clearCloseTimer,
      clearOpenTimer,
      disabled,
      isOpen,
      normalizedDelay,
      requestCoordinatedOpen,
    ],
  )

  const handlePointerLeave = useCallback(() => {
    pointerActiveRef.current = false
    pointerSuppressedRef.current = false
    scheduleClose('pointer-leave')
  }, [scheduleClose])

  const handlePointerDown = useCallback(() => {
    pointerActiveRef.current = false
    pointerSuppressedRef.current = true
    closeImmediately('pointer-down')
  }, [closeImmediately])

  const handleFocus = useCallback(() => {
    if (disabled) {
      return
    }

    focusActiveRef.current = true
    clearOpenTimer()
    clearCloseTimer()
    requestCoordinatedOpen('focus')
  }, [
    clearCloseTimer,
    clearOpenTimer,
    disabled,
    requestCoordinatedOpen,
  ])

  const handleBlur = useCallback(() => {
    focusActiveRef.current = false
    scheduleClose('blur')
  }, [scheduleClose])

  const handleEscape = useCallback(() => {
    pointerActiveRef.current = false
    focusActiveRef.current = false
    pointerSuppressedRef.current = true
    closeImmediately('escape')
  }, [closeImmediately])

  useEffect(() => {
    if (isOpen) {
      activeTooltipClose = closeImmediately
      return () => {
        if (activeTooltipClose === closeImmediately) {
          activeTooltipClose = null
        }
      }
    }
    return undefined
  }, [closeImmediately, isOpen])

  useEffect(() => {
    if (disabled && !previousDisabledRef.current) {
      pointerActiveRef.current = false
      focusActiveRef.current = false
      pointerSuppressedRef.current = false
      closeImmediately('disabled')
    }
    previousDisabledRef.current = disabled
  }, [closeImmediately, disabled])

  useEffect(
    () => () => {
      clearOpenTimer()
      clearCloseTimer()
    },
    [clearCloseTimer, clearOpenTimer],
  )

  const contextValue = useMemo(
    () => ({
      contentId: resolvedContentId,
      defaultContentId,
      handleBlur,
      handleEscape,
      handleFocus,
      handlePointerDown,
      handlePointerEnter,
      handlePointerLeave,
      isOpen,
      setContentId,
      setTriggerElement,
      triggerElement,
    }),
    [
      defaultContentId,
      handleBlur,
      handleEscape,
      handleFocus,
      handlePointerDown,
      handlePointerEnter,
      handlePointerLeave,
      isOpen,
      resolvedContentId,
      triggerElement,
    ],
  )

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({
  asChild = false,
  children,
  ref,
}) {
  const context = useTooltipContext('TooltipTrigger')

  function setTriggerRef(node, childRef) {
    context.setTriggerElement(node)
    setRef(childRef, node)
    setRef(ref, node)
  }

  function getDescriptionIds(existingIds) {
    return context.isOpen
      ? mergeDescriptionIds(existingIds, context.contentId)
      : mergeDescriptionIds(existingIds)
  }

  function composePassiveHandler(consumerHandler, tooltipHandler) {
    return (event) => {
      consumerHandler?.(event)
      tooltipHandler(event)
    }
  }

  function composeActionHandler(consumerHandler, tooltipHandler) {
    return (event) => {
      consumerHandler?.(event)
      if (!event.defaultPrevented) {
        tooltipHandler(event)
      }
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      context.handleEscape()
    }
  }

  if (asChild) {
    let child

    try {
      child = Children.only(children)
    } catch {
      throw new Error(
        'TooltipTrigger with asChild requires exactly one React element',
      )
    }

    if (!isValidElement(child)) {
      throw new Error(
        'TooltipTrigger with asChild requires exactly one React element',
      )
    }

    const childProps = child.props

    // The cloned React 19 element may carry either an object or callback ref.
    // eslint-disable-next-line react-hooks/refs
    return cloneElement(child, {
      ref: (node) => setTriggerRef(node, childProps.ref),
      'aria-describedby': getDescriptionIds(
        childProps['aria-describedby'],
      ),
      onPointerEnter: composePassiveHandler(
        childProps.onPointerEnter,
        context.handlePointerEnter,
      ),
      onPointerLeave: composePassiveHandler(
        childProps.onPointerLeave,
        context.handlePointerLeave,
      ),
      onPointerDown: composeActionHandler(
        childProps.onPointerDown,
        context.handlePointerDown,
      ),
      onFocus: composePassiveHandler(
        childProps.onFocus,
        context.handleFocus,
      ),
      onBlur: composePassiveHandler(
        childProps.onBlur,
        context.handleBlur,
      ),
      onKeyDown: composeActionHandler(
        childProps.onKeyDown,
        handleKeyDown,
      ),
    })
  }

  return (
    <span
      ref={(node) => setTriggerRef(node)}
      aria-describedby={getDescriptionIds()}
      onPointerEnter={context.handlePointerEnter}
      onPointerLeave={context.handlePointerLeave}
      onPointerDown={context.handlePointerDown}
      onFocus={context.handleFocus}
      onBlur={context.handleBlur}
      onKeyDown={handleKeyDown}
      className="inline-flex"
    >
      {children}
    </span>
  )
}

const validSides = new Set(['top', 'right', 'bottom', 'left'])
const validAlignments = new Set(['start', 'center', 'end'])

function normalizeNumber(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : fallback
}

export function TooltipContent({
  side = 'top',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  collisionPadding = 8,
  id,
  className = '',
  children,
  ...contentProps
}) {
  const context = useTooltipContext('TooltipContent')
  const [tooltipElement, setTooltipElement] = useState(null)
  const portalTarget =
    typeof document === 'undefined' ? null : document.body
  const setContentId = context.setContentId
  const selectedSide = validSides.has(side) ? side : 'top'
  const selectedAlign = validAlignments.has(align) ? align : 'center'
  const selectedSideOffset = normalizeNumber(sideOffset, 8)
  const selectedAlignOffset = normalizeNumber(alignOffset, 0)
  const selectedCollisionPadding = Math.max(
    0,
    normalizeNumber(collisionPadding, 8),
  )
  const resolvedId = id ?? context.defaultContentId
  const position = useTooltipPosition({
    triggerElement: context.triggerElement,
    tooltipElement,
    open: context.isOpen,
    side: selectedSide,
    align: selectedAlign,
    sideOffset: selectedSideOffset,
    alignOffset: selectedAlignOffset,
    collisionPadding: selectedCollisionPadding,
  })

  useLayoutEffect(() => {
    setContentId(id ?? null)
    return () => setContentId(null)
  }, [id, setContentId])

  if (
    !context.isOpen ||
    !portalTarget ||
    context.contentId !== resolvedId
  ) {
    return null
  }

  return createPortal(
    <div
      {...contentProps}
      ref={setTooltipElement}
      id={resolvedId}
      role="tooltip"
      data-side={position.side}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        maxWidth: `calc(100vw - ${selectedCollisionPadding * 2}px)`,
        visibility: position.ready ? 'visible' : 'hidden',
        ...contentProps.style,
      }}
      className={[
        'fixed z-[70] w-max max-w-xs break-words rounded-md border border-brand-secondary bg-brand-primary px-2.5 py-1.5 text-role-helper text-surface-card shadow-md pointer-events-none',
        'origin-center transition-[opacity,transform] duration-150 motion-reduce:transform-none motion-reduce:transition-none',
        position.ready ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>,
    portalTarget,
  )
}
