import { useEffect, useState } from 'react'
import { getMockCampaignsData } from '../../../services/campaigns/mockCampaignService.js'

const initialData = {
  campaigns: [],
  owners: [],
  agents: [],
}

export function useCampaignsData() {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    getMockCampaignsData({ signal: controller.signal })
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
  }, [])

  return {
    campaigns: data.campaigns,
    owners: data.owners,
    agents: data.agents,
    isLoading,
    error,
  }
}
