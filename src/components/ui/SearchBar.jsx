import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import SearchInput from './SearchInput.jsx'

const widthClasses = {
  auto: 'w-auto max-w-full',
  compact: 'w-full max-w-full sm:w-64',
  standard: 'w-full max-w-full md:w-[340px]',
  wide: 'w-full max-w-full lg:w-96',
  full: 'w-full max-w-full',
}

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

function SearchBar({
  value,
  defaultValue = '',
  onChange,
  onValueChange,
  onClear,
  placeholder = 'Search',
  debounceMs = 0,
  size = 'md',
  width = 'standard',
  className = '',
  wrapperClassName = '',
  disabled = false,
  readOnly = false,
  ref,
  ...inputProps
}) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue ?? '',
  )
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const pendingValueRef = useRef(null)
  const onValueChangeRef = useRef(onValueChange)
  const displayedValue = isControlled ? (value ?? '') : uncontrolledValue
  const selectedWidth =
    widthClasses[width] ?? widthClasses.standard
  const normalizedDebounceMs =
    typeof debounceMs === 'number' &&
    Number.isFinite(debounceMs) &&
    debounceMs > 0
      ? Math.round(debounceMs)
      : 0

  const clearPendingCallback = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    pendingValueRef.current = null
  }, [])

  const inputRefCallback = useCallback(
    (node) => {
      inputRef.current = node
      setRef(ref, node)
    },
    [ref],
  )

  function notifyValueChange(nextValue) {
    clearPendingCallback()

    if (!onValueChangeRef.current) {
      return
    }

    if (normalizedDebounceMs === 0) {
      onValueChangeRef.current(nextValue)
      return
    }

    pendingValueRef.current = nextValue
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      pendingValueRef.current = null
      onValueChangeRef.current?.(nextValue)
    }, normalizedDebounceMs)
  }

  function handleChange(event) {
    const nextValue = event.target.value

    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    onChange?.(event)
    notifyValueChange(nextValue)
  }

  function handleClear() {
    clearPendingCallback()

    if (!isControlled) {
      setUncontrolledValue('')
    }

    onValueChangeRef.current?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  useEffect(() => {
    onValueChangeRef.current = onValueChange
  }, [onValueChange])

  useEffect(() => {
    if (
      isControlled &&
      timerRef.current !== null &&
      pendingValueRef.current !== displayedValue
    ) {
      clearPendingCallback()
    }
  }, [clearPendingCallback, displayedValue, isControlled])

  useEffect(() => {
    clearPendingCallback()
  }, [clearPendingCallback, normalizedDebounceMs])

  useEffect(() => {
    if (disabled) {
      clearPendingCallback()
    }
  }, [clearPendingCallback, disabled])

  useEffect(
    () => () => {
      clearPendingCallback()
    },
    [clearPendingCallback],
  )

  const showClearControl =
    displayedValue !== '' && !disabled && !readOnly

  return (
    <SearchInput
      {...inputProps}
      ref={inputRefCallback}
      value={displayedValue}
      onChange={handleChange}
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      className={[
        '[&::-webkit-search-cancel-button]:hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      wrapperClassName={[
        selectedWidth,
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      fullWidth={width !== 'auto'}
      trailingControl={
        showClearControl ? (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            className={[
              'flex size-9 shrink-0 items-center justify-center rounded-md text-text-secondary',
              'transition-colors hover:bg-surface-card hover:text-text-primary',
              'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-accent',
              size === 'sm' && 'size-8',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : undefined
      }
    />
  )
}

export default SearchBar
