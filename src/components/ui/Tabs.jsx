/**
 * Accessible controlled or uncontrolled Tabs system.
 *
 * Registered triggers coordinate roving focus, keyboard activation, and stable
 * trigger/panel ARIA relationships while each panel owns its rendered content.
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

const TabsContext = createContext(null)

function useTabsContext(componentName) {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error(`${componentName} must be used within Tabs`)
  }

  return context
}

function normalizeIdSegment(value) {
  const normalizedValue = String(value ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')

  return normalizedValue || 'tab'
}

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

function valuesMatch(firstValue, secondValue) {
  return Object.is(firstValue, secondValue)
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  loop = true,
  className = '',
  children,
  ref,
  ...tabsProps
}) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue,
  )
  const [triggersVersion, setTriggersVersion] = useState(0)
  const triggersRef = useRef(new Map())
  const generatedId = useId()
  const rootId = `tabs-${generatedId.replaceAll(':', '')}`
  const selectedValue = isControlled ? value : uncontrolledValue
  const selectedOrientation =
    orientation === 'vertical' ? 'vertical' : 'horizontal'
  const selectedActivationMode =
    activationMode === 'manual' ? 'manual' : 'automatic'

  // Registration decouples compound children from render order; DOM sorting
  // produces the visual navigation sequence even when children mount dynamically.
  const registerTrigger = useCallback((registrationId, trigger) => {
    triggersRef.current.set(registrationId, trigger)
    setTriggersVersion((currentVersion) => currentVersion + 1)

    return () => {
      if (triggersRef.current.get(registrationId) === trigger) {
        triggersRef.current.delete(registrationId)
        setTriggersVersion((currentVersion) => currentVersion + 1)
      }
    }
  }, [])

  const getTriggers = useCallback(
    () =>
      [...triggersRef.current.values()]
        .filter((trigger) => trigger.ref.current?.isConnected)
        .sort((firstTrigger, secondTrigger) => {
          const firstNode = firstTrigger.ref.current
          const secondNode = secondTrigger.ref.current

          if (!firstNode || !secondNode || firstNode === secondNode) {
            return 0
          }

          return firstNode.compareDocumentPosition(secondNode) &
            Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1
        }),
    [],
  )

  const getEnabledTriggers = useCallback(
    () => getTriggers().filter((trigger) => !trigger.disabled),
    [getTriggers],
  )

  const isValueEnabled = useCallback(
    (tabValue) =>
      getEnabledTriggers().some((trigger) =>
        valuesMatch(trigger.value, tabValue),
      ),
    [getEnabledTriggers],
  )

  const changeValue = useCallback(
    (nextValue) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }

      if (!valuesMatch(selectedValue, nextValue)) {
        onValueChange?.(nextValue)
      }
    },
    [isControlled, onValueChange, selectedValue],
  )

  useEffect(() => {
    if (isControlled) {
      return undefined
    }

    const enabledTriggers = getEnabledTriggers()
    const activeTrigger = enabledTriggers.find((trigger) =>
      valuesMatch(trigger.value, uncontrolledValue),
    )
    const fallbackValue = activeTrigger
      ? uncontrolledValue
      : enabledTriggers[0]?.value

    if (valuesMatch(uncontrolledValue, fallbackValue)) {
      return undefined
    }

    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) {
        setUncontrolledValue(fallbackValue)
        onValueChange?.(fallbackValue)
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    getEnabledTriggers,
    isControlled,
    onValueChange,
    triggersVersion,
    uncontrolledValue,
  ])

  const contextValue = useMemo(
    () => ({
      activationMode: selectedActivationMode,
      changeValue,
      getEnabledTriggers,
      isValueEnabled,
      loop: Boolean(loop),
      orientation: selectedOrientation,
      registerTrigger,
      rootId,
      selectedValue,
      triggersVersion,
    }),
    [
      changeValue,
      getEnabledTriggers,
      isValueEnabled,
      loop,
      registerTrigger,
      rootId,
      selectedActivationMode,
      selectedOrientation,
      selectedValue,
      triggersVersion,
    ],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        {...tabsProps}
        ref={ref}
        className={['min-w-0', className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className = '',
  children,
  ref,
  ...listProps
}) {
  const context = useTabsContext('TabsList')

  return (
    <div
      {...listProps}
      ref={ref}
      role="tablist"
      aria-orientation={context.orientation}
      className={[
        'inline-flex max-w-full items-center gap-1 rounded-lg border border-border-default bg-surface-page p-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  disabled = false,
  className = '',
  children,
  ref,
  onClick,
  onKeyDown,
  type = 'button',
  ...triggerProps
}) {
  const context = useTabsContext('TabsTrigger')
  const registrationId = useId()
  const triggerRef = useRef(null)
  const valueId = normalizeIdSegment(value)
  const triggerId = `${context.rootId}-${valueId}-trigger`
  const panelId = `${context.rootId}-${valueId}-panel`
  const registerTrigger = context.registerTrigger
  const isSelected =
    !disabled && valuesMatch(context.selectedValue, value)
  const enabledTriggers = context.getEnabledTriggers()
  const hasEnabledSelection = enabledTriggers.some((trigger) =>
    valuesMatch(trigger.value, context.selectedValue),
  )
  const isFocusFallback =
    !disabled &&
    !hasEnabledSelection &&
    valuesMatch(enabledTriggers[0]?.value, value)

  const setTriggerRef = useCallback(
    (node) => {
      triggerRef.current = node
      setRef(ref, node)
    },
    [ref],
  )

  useEffect(
    () =>
      registerTrigger(registrationId, {
        disabled,
        ref: triggerRef,
        value,
      }),
    [disabled, registerTrigger, registrationId, value],
  )

  function activate() {
    if (!disabled) {
      context.changeValue(value)
    }
  }

  function moveFocus(targetTrigger) {
    if (!targetTrigger) {
      return
    }

    targetTrigger.ref.current?.focus()

    if (context.activationMode === 'automatic') {
      context.changeValue(targetTrigger.value)
    }
  }

  // Roving focus follows orientation-aware arrows plus Home/End. Automatic mode
  // selects on focus movement, while manual mode waits for Enter or Space.
  function handleKeyDown(event) {
    onKeyDown?.(event)

    if (event.defaultPrevented || disabled) {
      return
    }

    const enabledTriggersForNavigation = context.getEnabledTriggers()
    const currentIndex = enabledTriggersForNavigation.findIndex(
      (trigger) => trigger.ref.current === event.currentTarget,
    )
    const previousKey =
      context.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const nextKey =
      context.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    let targetIndex

    if (event.key === 'Home') {
      targetIndex = 0
    } else if (event.key === 'End') {
      targetIndex = enabledTriggersForNavigation.length - 1
    } else if (event.key === previousKey || event.key === nextKey) {
      const direction = event.key === nextKey ? 1 : -1
      const requestedIndex =
        (currentIndex < 0
          ? direction > 0
            ? -1
            : enabledTriggersForNavigation.length
          : currentIndex) + direction

      if (context.loop && enabledTriggersForNavigation.length > 0) {
        targetIndex =
          (requestedIndex + enabledTriggersForNavigation.length) %
          enabledTriggersForNavigation.length
      } else {
        targetIndex = Math.min(
          Math.max(requestedIndex, 0),
          enabledTriggersForNavigation.length - 1,
        )
      }
    } else if (
      context.activationMode === 'manual' &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      activate()
      return
    } else {
      return
    }

    if (enabledTriggersForNavigation.length === 0) {
      return
    }

    event.preventDefault()
    moveFocus(enabledTriggersForNavigation[targetIndex])
  }

  return (
    <button
      {...triggerProps}
      ref={setTriggerRef}
      id={triggerId}
      type={type}
      role="tab"
      disabled={disabled}
      aria-controls={panelId}
      aria-selected={isSelected}
      tabIndex={isSelected || isFocusFallback ? 0 : -1}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented && !disabled) {
          activate()
        }
      }}
      className={[
        'inline-flex h-control-sm items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-role-navigation',
        'text-text-secondary transition-colors hover:bg-surface-card hover:text-text-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&>svg]:size-4 [&>svg]:shrink-0',
        isSelected && 'bg-surface-card text-brand-secondary shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

export function TabsPanel({
  value,
  className = '',
  children,
  ref,
  ...panelProps
}) {
  const context = useTabsContext('TabsPanel')
  const valueId = normalizeIdSegment(value)
  const triggerId = `${context.rootId}-${valueId}-trigger`
  const panelId = `${context.rootId}-${valueId}-panel`
  const isActive =
    valuesMatch(context.selectedValue, value) &&
    context.isValueEnabled(value)

  return (
    <div
      {...panelProps}
      ref={ref}
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      hidden={!isActive}
      className={['mt-4 min-w-0', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}
