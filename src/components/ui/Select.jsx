/**
 * Compound listbox that composes custom presentation and keyboard behavior over
 * controlled or uncontrolled value and open-state ownership.
 *
 * Context connects the labelled trigger, registered options, selected value,
 * and portalled listbox without relying on native select rendering.
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
import { Check, ChevronDown } from 'lucide-react'
import { useFloatingPosition } from './floatingPosition.js'

const SelectContext = createContext(null)
const SelectGroupContext = createContext(null)

function useSelectContext(componentName) {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error(`${componentName} must be used within Select`)
  }

  return context
}

function getEnabledOptions(options) {
  return options.filter((option) => !option.disabled)
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) {
  const isValueControlled = value !== undefined
  const isOpenControlled = open !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [optionsVersion, setOptionsVersion] = useState(0)
  const optionsRef = useRef(new Map())
  const triggerRef = useRef(null)
  const contentRef = useRef(null)
  const initialFocusRef = useRef('selected')
  const contentId = `select-${useId().replace(/:/g, '')}`
  const selectedValue = isValueControlled ? value : uncontrolledValue
  const isOpen = isOpenControlled ? open : uncontrolledOpen

  const setOpen = useCallback(
    (nextOpen) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isOpenControlled, onOpenChange],
  )

  const close = useCallback(
    ({ restoreFocus = false } = {}) => {
      setOpen(false)
      if (restoreFocus) {
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    },
    [setOpen],
  )

  const selectValue = useCallback(
    (nextValue) => {
      if (!isValueControlled) {
        setUncontrolledValue(nextValue)
      }
      onValueChange?.(nextValue)
      close({ restoreFocus: true })
    },
    [close, isValueControlled, onValueChange],
  )

  // Option registration supplies the selected display value and a DOM-ordered
  // focus model without requiring the Select root to own option markup.
  const registerOption = useCallback((id, option) => {
    optionsRef.current.set(id, option)
    setOptionsVersion((current) => current + 1)

    return () => {
      optionsRef.current.delete(id)
      setOptionsVersion((current) => current + 1)
    }
  }, [])

  const getOptions = useCallback(
    () =>
      [...optionsRef.current.values()].sort((a, b) => {
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

  const selectedOption = useMemo(
    () =>
      [...optionsRef.current.values()].find(
        (option) => option.value === selectedValue,
      ),
    [optionsVersion, selectedValue],
  )

  // Outside-pointer dismissal is active only while the listbox is open and is
  // removed during cleanup so document listeners cannot accumulate.
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
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      close,
      contentId,
      contentRef,
      disabled,
      getOptions,
      initialFocusRef,
      isOpen,
      registerOption,
      selectValue,
      selectedOption,
      selectedValue,
      setOpen,
      triggerRef,
    }),
    [
      ariaLabel,
      ariaLabelledBy,
      close,
      contentId,
      disabled,
      getOptions,
      isOpen,
      registerOption,
      selectValue,
      selectedOption,
      selectedValue,
      setOpen,
    ],
  )

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  className = '',
  children,
  disabled: disabledProp,
  onKeyDown,
  onClick,
  ref,
  ...triggerProps
}) {
  const context = useSelectContext('SelectTrigger')
  const disabled = context.disabled || disabledProp

  function setTriggerRef(node) {
    context.triggerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  function openWithFocus(preference) {
    context.initialFocusRef.current = preference
    context.setOpen(true)
  }

  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) {
      return
    }

    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      openWithFocus(event.key === 'ArrowUp' ? 'last' : event.key === 'ArrowDown' ? 'first' : 'selected')
    }
  }

  return (
    <button
      {...context['aria-label'] && {
        'aria-label': context['aria-label'],
      }}
      {...context['aria-labelledby'] && {
        'aria-labelledby': context['aria-labelledby'],
      }}
      {...triggerProps}
      ref={setTriggerRef}
      type="button"
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={context.isOpen}
      aria-controls={context.contentId}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          context.initialFocusRef.current = 'selected'
          context.setOpen(!context.isOpen)
        }
      }}
      className={[
        'flex h-control-md min-w-0 items-center gap-2 rounded-lg border border-border-default bg-surface-card px-3 text-left text-role-body-copy text-text-primary',
        'transition-[border-color,box-shadow,background-color] hover:border-text-secondary',
        'focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20',
        'disabled:cursor-not-allowed disabled:bg-surface-page disabled:text-text-secondary disabled:opacity-70',
        className || 'w-full',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronDown
        aria-hidden="true"
        className={[
          'size-4 shrink-0 text-text-secondary transition-transform',
          context.isOpen && 'rotate-180',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </button>
  )
}

export function SelectValue({ placeholder, children }) {
  const { selectedOption, selectedValue } = useSelectContext('SelectValue')

  if (children !== undefined) {
    return children
  }

  if (selectedOption) {
    return selectedOption.display
  }

  return (
    <span className={selectedValue == null ? 'text-text-secondary' : ''}>
      {selectedValue == null ? placeholder : String(selectedValue)}
    </span>
  )
}

export function SelectContent({
  align = 'start',
  className = '',
  children,
}) {
  const context = useSelectContext('SelectContent')
  const { style, updatePosition } = useFloatingPosition({
    open: context.isOpen,
    triggerRef: context.triggerRef,
    contentRef: context.contentRef,
    align,
  })

  // Opening focuses the selected option when available, otherwise the requested
  // first/last fallback; subsequent key handling moves only among enabled options.
  useEffect(() => {
    if (!context.isOpen) {
      return
    }

    const options = getEnabledOptions(context.getOptions())
    const selected = options.find(
      (option) => option.value === context.selectedValue,
    )
    const preference = context.initialFocusRef.current
    const target =
      selected ??
      (preference === 'last' ? options.at(-1) : options[0])

    requestAnimationFrame(() => {
      updatePosition()
      target?.ref.current?.focus()
    })
  }, [
    context.getOptions,
    context.initialFocusRef,
    context.isOpen,
    context.selectedValue,
    updatePosition,
  ])

  if (!context.isOpen) {
    return null
  }

  function moveFocus(direction) {
    const options = getEnabledOptions(context.getOptions())
    if (!options.length) {
      return
    }
    const currentIndex = options.findIndex(
      (option) => option.ref.current === document.activeElement,
    )
    const nextIndex =
      currentIndex < 0
        ? direction > 0
          ? 0
          : options.length - 1
        : (currentIndex + direction + options.length) % options.length
    options[nextIndex].ref.current?.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const options = getEnabledOptions(context.getOptions())
      const target = event.key === 'Home' ? options[0] : options.at(-1)
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
      role="listbox"
      style={style}
      onKeyDown={handleKeyDown}
      className={[
        'z-50 min-w-44 overflow-y-auto rounded-lg border border-border-default bg-surface-card p-1 shadow-lg',
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

export function SelectGroup({ children, className = '' }) {
  const labelId = `select-group-${useId().replace(/:/g, '')}`
  return (
    <SelectGroupContext.Provider value={labelId}>
      <div
        role="group"
        aria-labelledby={labelId}
        className={className}
      >
        {children}
      </div>
    </SelectGroupContext.Provider>
  )
}

export function SelectLabel({ children, className = '' }) {
  const labelId = useContext(SelectGroupContext)
  return (
    <div
      id={labelId}
      className={[
        'px-3 py-2 text-role-table-heading uppercase text-text-secondary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function SelectOption({
  value,
  textValue,
  disabled = false,
  children,
  className = '',
}) {
  const context = useSelectContext('SelectOption')
  const id = `select-option-${useId().replace(/:/g, '')}`
  const optionRef = useRef(null)
  const selected = context.selectedValue === value
  const label =
    textValue ??
    (typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : String(value))

  useEffect(
    () =>
      context.registerOption(id, {
        id,
        value,
        textValue: label,
        display: children,
        disabled,
        ref: optionRef,
      }),
    [children, context.registerOption, disabled, id, label, value],
  )

  return (
    <div
      ref={optionRef}
      id={id}
      role="option"
      aria-label={label}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : -1}
      onClick={() => {
        if (!disabled) {
          context.selectValue(value)
        }
      }}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          context.selectValue(value)
        }
      }}
      className={[
        'flex min-w-0 items-center gap-2 rounded-md px-3 py-2 text-role-navigation text-text-primary outline-none',
        !disabled &&
          'cursor-pointer hover:bg-surface-page focus-visible:bg-surface-page focus-visible:outline-2 focus-visible:outline-brand-accent',
        selected && 'bg-brand-accent/10 text-brand-secondary',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {selected && (
        <Check
          aria-hidden="true"
          className="size-4 shrink-0 text-brand-accent-hover"
        />
      )}
    </div>
  )
}
