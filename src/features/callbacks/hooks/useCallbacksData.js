import { useCallback, useEffect, useRef, useState } from 'react'
import {
  completeMockCallback,
  getMockCallbacksData,
  rescheduleMockCallback,
} from '../services/mockCallbacksService.js'

const initialData = { callbacks: [], agents: [] }

export function useCallbacksData() {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const [pendingActions, setPendingActions] = useState({})
  const mountedRef = useRef(true)
  const mutationControllersRef = useRef(new Map())

  useEffect(() => {
    const mutationControllers = mutationControllersRef.current
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      mutationControllers.forEach((controller) => controller.abort())
      mutationControllers.clear()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getMockCallbacksData({ signal: controller.signal })
      .then((nextData) => {
        if (active) {
          setData(nextData)
          setIsLoading(false)
        }
      })
      .catch((requestError) => {
        if (active && requestError?.name !== 'AbortError') {
          setLoadError(requestError)
          setIsLoading(false)
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [requestVersion])

  const retry = useCallback(() => {
    setIsLoading(true)
    setLoadError(null)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  const runMutation = useCallback(async (callbackId, action, request) => {
    mutationControllersRef.current.get(callbackId)?.abort()
    const controller = new AbortController()
    mutationControllersRef.current.set(callbackId, controller)
    setPendingActions((current) => ({ ...current, [callbackId]: action }))

    try {
      const patch = await request(controller.signal)
      if (mountedRef.current && !controller.signal.aborted) {
        setData((currentData) => ({
          ...currentData,
          callbacks: currentData.callbacks.map((callback) =>
            callback.id === callbackId ? { ...callback, ...patch } : callback,
          ),
        }))
      }
      return patch
    } finally {
      if (
        mountedRef.current &&
        mutationControllersRef.current.get(callbackId) === controller
      ) {
        mutationControllersRef.current.delete(callbackId)
        setPendingActions((current) => {
          const next = { ...current }
          delete next[callbackId]
          return next
        })
      }
    }
  }, [])

  const rescheduleCallback = useCallback(
    (callbackId, scheduledAt) =>
      runMutation(callbackId, 'reschedule', (signal) =>
        rescheduleMockCallback(callbackId, scheduledAt, { signal }),
      ),
    [runMutation],
  )

  const completeCallback = useCallback(
    (callbackId) =>
      runMutation(callbackId, 'complete', (signal) =>
        completeMockCallback(callbackId, { signal }),
      ),
    [runMutation],
  )

  return {
    callbacks: data.callbacks,
    agents: data.agents,
    isLoading,
    loadError,
    retry,
    pendingActions,
    rescheduleCallback,
    completeCallback,
  }
}
