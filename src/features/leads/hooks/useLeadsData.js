import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addMockLeadToDnc,
  getMockLeadsData,
} from '../services/mockLeadsService.js'

const initialData = {
  leads: [],
  agents: [],
}

export function useLeadsData() {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const [dncPendingLeadId, setDncPendingLeadId] = useState(null)
  const [dncError, setDncError] = useState(null)
  const mountedRef = useRef(true)
  const dncControllerRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      dncControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getMockLeadsData({ signal: controller.signal })
      .then((nextData) => {
        if (active) {
          setData(nextData)
          setIsLoading(false)
        }
      })
      .catch((requestError) => {
        if (active && requestError?.name !== 'AbortError') {
          setError(requestError)
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
    setError(null)
    setRequestVersion((currentVersion) => currentVersion + 1)
  }, [])

  const clearDncError = useCallback(() => setDncError(null), [])

  const addLeadToDnc = useCallback(async (leadId) => {
    dncControllerRef.current?.abort()
    const controller = new AbortController()
    dncControllerRef.current = controller
    setDncPendingLeadId(leadId)
    setDncError(null)

    try {
      const updatedLead = await addMockLeadToDnc(leadId, {
        signal: controller.signal,
      })

      if (mountedRef.current) {
        setData((currentData) => ({
          ...currentData,
          leads: currentData.leads.map((lead) =>
            lead.id === updatedLead.id ? updatedLead : lead,
          ),
        }))
      }

      return updatedLead
    } catch (requestError) {
      if (
        mountedRef.current &&
        requestError?.name !== 'AbortError'
      ) {
        setDncError(requestError)
      }
      throw requestError
    } finally {
      if (mountedRef.current && dncControllerRef.current === controller) {
        setDncPendingLeadId(null)
        dncControllerRef.current = null
      }
    }
  }, [])

  return {
    leads: data.leads,
    agents: data.agents,
    isLoading,
    error,
    retry,
    addLeadToDnc,
    dncPendingLeadId,
    dncError,
    clearDncError,
  }
}
