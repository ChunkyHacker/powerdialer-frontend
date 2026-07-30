import {
  mockCampaignAgents,
  mockCampaignOwners,
  mockCampaigns,
} from '../../features/campaigns/data/mockCampaignData.js'

const MOCK_DELAY_MS = 450

function createAbortError() {
  return new DOMException('The Campaigns request was cancelled.', 'AbortError')
}

function copyCampaign(campaign) {
  return {
    ...campaign,
    assignedAgentIds: [...campaign.assignedAgentIds],
  }
}

export function getMockCampaignsData({ signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve({
        campaigns: mockCampaigns.map(copyCampaign),
        owners: mockCampaignOwners.map((owner) => ({ ...owner })),
        agents: mockCampaignAgents.map((agent) => ({ ...agent })),
      })
    }, MOCK_DELAY_MS)

    function handleAbort() {
      window.clearTimeout(timerId)
      signal?.removeEventListener('abort', handleAbort)
      reject(createAbortError())
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}
