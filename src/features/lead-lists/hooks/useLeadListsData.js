import { useEffect, useState } from 'react'
import { getMockLeadLists } from '../services/mockLeadListsService.js'

export function useLeadListsData() {
  const [leadLists, setLeadLists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getMockLeadLists({ signal: controller.signal })
      .then((records) => {
        if (active) {
          setLeadLists(records)
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
  }, [])

  return { leadLists, isLoading, error }
}
