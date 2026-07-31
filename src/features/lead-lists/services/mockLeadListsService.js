import { mockLeadLists } from '../data/mockLeadListData.js'

const MOCK_DELAY_MS = 450

function createAbortError() {
  return new DOMException(
    'The Lead Lists request was cancelled.',
    'AbortError',
  )
}

export function getMockLeadLists({ signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve(mockLeadLists.map((leadList) => ({ ...leadList })))
    }, MOCK_DELAY_MS)

    function handleAbort() {
      window.clearTimeout(timerId)
      signal?.removeEventListener('abort', handleAbort)
      reject(createAbortError())
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}
