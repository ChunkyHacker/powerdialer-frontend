import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ToastContext } from '../../contexts/ToastContext.js'
import { ToastViewport } from './Toast.jsx'

const MAX_VISIBLE_TOASTS = 5
const EXIT_DURATION = 200

const TOAST_DURATIONS = {
  success: 4000,
  info: 5000,
  warning: 6000,
  error: 7000,
}

const validVariants = new Set(Object.keys(TOAST_DURATIONS))

function hasContent(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined && value !== false
}

function normalizeId(id) {
  return id === null || id === undefined ? null : String(id)
}

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : 'info'
}

function normalizeDuration(duration, variant) {
  if (duration === 0) {
    return 0
  }
  return typeof duration === 'number' &&
    Number.isFinite(duration) &&
    duration > 0
    ? duration
    : TOAST_DURATIONS[variant]
}

function normalizeNotification(options, id, timerRevision = 0) {
  const variant = normalizeVariant(options?.variant)
  const title = hasContent(options?.title) ? options.title : null
  const message = hasContent(options?.message) ? options.message : null

  if (!title && !message) {
    return null
  }

  const duration = normalizeDuration(options?.duration, variant)

  return {
    id,
    variant,
    title,
    message,
    duration,
    persistent: Boolean(options?.persistent) || duration === 0,
    dismissible: options?.dismissible !== false,
    onDismiss:
      typeof options?.onDismiss === 'function'
        ? options.onDismiss
        : null,
    timerRevision,
    phase: 'entering',
  }
}

function replaceById(items, id, replacement) {
  return items.map((item) => (item.id === id ? replacement : item))
}

export function ToastProvider({ children }) {
  const generatedPrefix = `toast-${useId().replaceAll(':', '')}`
  const counterRef = useRef(0)
  const storeRef = useRef({ active: [], queue: [] })
  const dismissedIdsRef = useRef(new Set())
  const exitTimersRef = useRef(new Map())
  const entryFramesRef = useRef(new Map())
  const mountedRef = useRef(true)
  const [store, setStore] = useState({ active: [], queue: [] })
  const [documentHidden, setDocumentHidden] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.visibilityState !== 'visible',
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    storeRef.current = store
  }, [store])

  const clearEntryFrame = useCallback((id) => {
    const frames = entryFramesRef.current.get(id)
    if (!frames) {
      return
    }
    frames.forEach((frame) => cancelAnimationFrame(frame))
    entryFramesRef.current.delete(id)
  }, [])

  const clearExitTimer = useCallback((id) => {
    const timer = exitTimersRef.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      exitTimersRef.current.delete(id)
    }
  }, [])

  const notifyDismiss = useCallback((notification) => {
    if (
      !notification ||
      dismissedIdsRef.current.has(notification.id)
    ) {
      return
    }

    dismissedIdsRef.current.add(notification.id)
    try {
      notification.onDismiss?.()
    } catch {
      // Consumer callback failures must not break Toast cleanup.
    }
  }, [])

  const removeAfterExit = useCallback(
    (id) => {
      clearExitTimer(id)
      const delay = prefersReducedMotion ? 0 : EXIT_DURATION
      const timer = window.setTimeout(() => {
        exitTimersRef.current.delete(id)

        if (!mountedRef.current) {
          return
        }

        setStore((current) => {
          const active = current.active.filter(
            (notification) => notification.id !== id,
          )
          const queue = [...current.queue]

          if (queue.length > 0 && active.length < MAX_VISIBLE_TOASTS) {
            active.push({ ...queue.shift(), phase: 'entering' })
          }

          return { active, queue }
        })
      }, delay)
      exitTimersRef.current.set(id, timer)
    },
    [clearExitTimer, prefersReducedMotion],
  )

  const dismiss = useCallback(
    (requestedId) => {
      const id = normalizeId(requestedId)
      if (id === null) {
        return
      }

      const snapshot = storeRef.current
      const activeNotification = snapshot.active.find(
        (notification) => notification.id === id,
      )
      const queuedNotification = snapshot.queue.find(
        (notification) => notification.id === id,
      )

      if (activeNotification?.phase === 'exiting') {
        return
      }

      notifyDismiss(activeNotification ?? queuedNotification)
      clearEntryFrame(id)

      if (queuedNotification) {
        setStore((current) => ({
          ...current,
          queue: current.queue.filter(
            (notification) => notification.id !== id,
          ),
        }))
        return
      }

      if (!activeNotification) {
        return
      }

      setStore((current) => ({
        ...current,
        active: current.active.map((notification) =>
          notification.id === id
            ? { ...notification, phase: 'exiting' }
            : notification,
        ),
      }))
      removeAfterExit(id)
    },
    [
      clearEntryFrame,
      notifyDismiss,
      removeAfterExit,
    ],
  )

  const dismissAll = useCallback(() => {
    const snapshot = storeRef.current
    ;[...snapshot.active, ...snapshot.queue].forEach(notifyDismiss)
    entryFramesRef.current.forEach((frames) =>
      frames.forEach((frame) => cancelAnimationFrame(frame)),
    )
    exitTimersRef.current.forEach((timer) =>
      window.clearTimeout(timer),
    )
    entryFramesRef.current.clear()
    exitTimersRef.current.clear()
    setStore({ active: [], queue: [] })
  }, [notifyDismiss])

  const toast = useCallback(
    (options = {}) => {
      const callerId = normalizeId(options.id)
      const id =
        callerId ??
        `${generatedPrefix}-${++counterRef.current}`
      const snapshot = storeRef.current
      const existing =
        snapshot.active.find((item) => item.id === id) ??
        snapshot.queue.find((item) => item.id === id)

      if (existing?.phase === 'exiting') {
        return id
      }

      const notification = normalizeNotification(
        options,
        id,
        (existing?.timerRevision ?? -1) + 1,
      )

      if (!notification) {
        return null
      }

      dismissedIdsRef.current.delete(id)

      setStore((current) => {
        const activeMatch = current.active.find(
          (item) => item.id === id,
        )
        if (activeMatch) {
          if (activeMatch.phase === 'exiting') {
            return current
          }
          return {
            ...current,
            active: replaceById(current.active, id, {
              ...notification,
              timerRevision: activeMatch.timerRevision + 1,
              phase: activeMatch.phase,
            }),
          }
        }

        const queueMatch = current.queue.some(
          (item) => item.id === id,
        )
        if (queueMatch) {
          const queuedMatch = current.queue.find(
            (item) => item.id === id,
          )
          return {
            ...current,
            queue: replaceById(current.queue, id, {
              ...notification,
              timerRevision: queuedMatch.timerRevision + 1,
            }),
          }
        }

        if (current.active.length < MAX_VISIBLE_TOASTS) {
          return {
            ...current,
            active: [notification, ...current.active],
          }
        }

        return {
          ...current,
          queue: [...current.queue, notification],
        }
      })

      return id
    },
    [generatedPrefix],
  )

  const update = useCallback((requestedId, updates = {}) => {
    const id = normalizeId(requestedId)
    if (id === null || !updates || typeof updates !== 'object') {
      return
    }

    setStore((current) => {
      const existing =
        current.active.find((item) => item.id === id) ??
        current.queue.find((item) => item.id === id)

      if (!existing || existing.phase === 'exiting') {
        return current
      }

      const merged = { ...existing, ...updates, id }
      const variant = normalizeVariant(merged.variant)
      const durationChanged = Object.prototype.hasOwnProperty.call(
        updates,
        'duration',
      )
      const persistenceChanged = Object.prototype.hasOwnProperty.call(
        updates,
        'persistent',
      )
      const shouldRestartTimer =
        durationChanged || persistenceChanged
      const duration = shouldRestartTimer
        ? normalizeDuration(
            durationChanged ? updates.duration : undefined,
            variant,
          )
        : existing.duration
      const persistent = persistenceChanged
        ? Boolean(updates.persistent) || duration === 0
        : durationChanged
          ? duration === 0
          : existing.persistent
      const title = hasContent(merged.title) ? merged.title : null
      const message = hasContent(merged.message)
        ? merged.message
        : null

      if (!title && !message) {
        return current
      }

      const replacement = {
        ...existing,
        ...updates,
        id,
        variant,
        title,
        message,
        duration,
        persistent,
        dismissible: merged.dismissible !== false,
        onDismiss:
          typeof merged.onDismiss === 'function'
            ? merged.onDismiss
            : null,
        timerRevision: shouldRestartTimer
          ? existing.timerRevision + 1
          : existing.timerRevision,
        phase: existing.phase,
      }

      return {
        active: replaceById(current.active, id, replacement),
        queue: replaceById(current.queue, id, replacement),
      }
    })
  }, [])

  const success = useCallback(
    (message, options = {}) =>
      toast({ ...options, message, variant: 'success' }),
    [toast],
  )
  const error = useCallback(
    (message, options = {}) =>
      toast({ ...options, message, variant: 'error' }),
    [toast],
  )
  const warning = useCallback(
    (message, options = {}) =>
      toast({ ...options, message, variant: 'warning' }),
    [toast],
  )
  const info = useCallback(
    (message, options = {}) =>
      toast({ ...options, message, variant: 'info' }),
    [toast],
  )

  useEffect(() => {
    const enteringIds = store.active
      .filter((notification) => notification.phase === 'entering')
      .map((notification) => notification.id)

    enteringIds.forEach((id) => {
      if (entryFramesRef.current.has(id)) {
        return
      }

      const frames = []
      frames.push(
        requestAnimationFrame(() => {
          frames.push(
            requestAnimationFrame(() => {
              entryFramesRef.current.delete(id)
              if (!mountedRef.current) {
                return
              }
              setStore((current) => ({
                ...current,
                active: current.active.map((notification) =>
                  notification.id === id &&
                  notification.phase === 'entering'
                    ? { ...notification, phase: 'visible' }
                    : notification,
                ),
              }))
            }),
          )
        }),
      )
      entryFramesRef.current.set(id, frames)
    })
  }, [store.active])

  useEffect(() => {
    function handleVisibilityChange() {
      setDocumentHidden(document.visibilityState !== 'visible')
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    )
    return () =>
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const handleChange = (event) =>
      setPrefersReducedMotion(event.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () =>
      mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(
    () => {
      const entryFrames = entryFramesRef.current
      const exitTimers = exitTimersRef.current
      mountedRef.current = true
      return () => {
        mountedRef.current = false
        entryFrames.forEach((frames) =>
          frames.forEach((frame) => cancelAnimationFrame(frame)),
        )
        exitTimers.forEach((timer) =>
          window.clearTimeout(timer),
        )
        entryFrames.clear()
        exitTimers.clear()
      }
    },
    [],
  )

  const contextValue = useMemo(
    () => ({
      toast,
      success,
      error,
      warning,
      info,
      dismiss,
      dismissAll,
      update,
    }),
    [
      dismiss,
      dismissAll,
      error,
      info,
      success,
      toast,
      update,
      warning,
    ],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport
        notifications={store.active}
        documentHidden={documentHidden}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  )
}
