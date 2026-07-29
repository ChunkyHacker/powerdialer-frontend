import { useCallback, useEffect, useState } from 'react'
import { getMockDashboardData } from '../../../services/dashboard/mockDashboardService.js'
import {
  dashboardDateRanges,
  mockDashboardData,
} from '../data/mockDashboardData.js'

export function useDashboardData() {
  const [selectedDateRangeId, setSelectedDateRangeId] = useState(
    mockDashboardData.metadata.defaultDateRangeId,
  )
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const selectDateRange = useCallback(
    (nextDateRangeId) => {
      if (nextDateRangeId === selectedDateRangeId) {
        return
      }

      setIsLoading(true)
      setError(null)
      setSelectedDateRangeId(nextDateRangeId)
    },
    [selectedDateRangeId],
  )

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getMockDashboardData({
      dateRangeId: selectedDateRangeId,
      signal: controller.signal,
    })
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
  }, [selectedDateRangeId])

  return {
    data,
    dateRanges: dashboardDateRanges,
    error,
    isLoading,
    selectedDateRangeId,
    setSelectedDateRangeId: selectDateRange,
  }
}
