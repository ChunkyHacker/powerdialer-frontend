import { mockDashboardData } from '../../features/dashboard/data/mockDashboardData.js'

const MOCK_DELAY_MS = 450

function createAbortError() {
  return new DOMException('The Dashboard request was cancelled.', 'AbortError')
}

export function getMockDashboardData({
  dateRangeId,
  signal,
} = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve({
        ...mockDashboardData,
        metadata: {
          ...mockDashboardData.metadata,
          selectedDateRangeId:
            dateRangeId ?? mockDashboardData.metadata.defaultDateRangeId,
        },
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
