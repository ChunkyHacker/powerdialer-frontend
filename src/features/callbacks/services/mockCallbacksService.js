import {
  CALLBACK_REFERENCE_NOW,
  mockCallbackAgents,
  mockCallbacks,
} from '../data/mockCallbackData.js'

const LOAD_DELAY_MS = 450
const MUTATION_DELAY_MS = 550

function createAbortError() {
  return new DOMException('The Callbacks request was cancelled.', 'AbortError')
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

function requireCallback(callbackId) {
  const callback = mockCallbacks.find((record) => record.id === callbackId)
  if (!callback) {
    throw new Error('The selected callback could not be found.')
  }
  return callback
}

export function getMockCallbacksData({ signal } = {}) {
  return delayResult(
    {
      callbacks: mockCallbacks.map((callback) => ({ ...callback })),
      agents: mockCallbackAgents.map((agent) => ({ ...agent })),
    },
    LOAD_DELAY_MS,
    signal,
  )
}

export function rescheduleMockCallback(
  callbackId,
  scheduledAt,
  { signal } = {},
) {
  requireCallback(callbackId)

  if (!Number.isFinite(Date.parse(scheduledAt))) {
    throw new Error('The new callback schedule is invalid.')
  }

  return delayResult(
    { id: callbackId, scheduledAt },
    MUTATION_DELAY_MS,
    signal,
  )
}

export function completeMockCallback(callbackId, { signal } = {}) {
  requireCallback(callbackId)

  return delayResult(
    {
      id: callbackId,
      status: 'completed',
      completedAt: CALLBACK_REFERENCE_NOW,
      outcome: 'Callback completed; follow-up notes are ready for review.',
    },
    MUTATION_DELAY_MS,
    signal,
  )
}
