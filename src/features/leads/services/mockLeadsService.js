import {
  mockLeadAgents,
  mockLeads,
} from '../data/mockLeadData.js'

const LOAD_DELAY_MS = 450
const DNC_DELAY_MS = 550

function createAbortError() {
  return new DOMException('The Leads request was cancelled.', 'AbortError')
}

function delayResult(result, delay, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve(result)
    }, delay)

    function handleAbort() {
      window.clearTimeout(timerId)
      signal?.removeEventListener('abort', handleAbort)
      reject(createAbortError())
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

function copyLead(lead) {
  return { ...lead }
}

export function getMockLeadsData({ signal } = {}) {
  return delayResult(
    {
      leads: mockLeads.map(copyLead),
      agents: mockLeadAgents.map((agent) => ({ ...agent })),
    },
    LOAD_DELAY_MS,
    signal,
  )
}

export async function addMockLeadToDnc(leadId, { signal } = {}) {
  const lead = mockLeads.find((record) => record.id === leadId)

  if (!lead) {
    throw new Error('The selected lead could not be found.')
  }

  return delayResult(
    {
      ...copyLead(lead),
      status: 'do-not-call',
      lastContactedAt: new Date().toISOString(),
      lastContactOutcome: 'Added to DNC by user',
    },
    DNC_DELAY_MS,
    signal,
  )
}
