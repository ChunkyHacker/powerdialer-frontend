import { mockLeadImportProfiles } from '../data/mockLeadImportData.js'

const INSPECTION_DELAY_MS = 500
const VALIDATION_DELAY_MS = 550
const IMPORT_DELAY_MS = 800

function createAbortError() {
  return new DOMException(
    'The Lead Import request was cancelled.',
    'AbortError',
  )
}

function runMockOperation({
  delay,
  signal,
  operation,
}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)

      try {
        resolve(operation())
      } catch (error) {
        reject(error)
      }
    }, delay)

    function handleAbort() {
      window.clearTimeout(timerId)
      signal?.removeEventListener('abort', handleAbort)
      reject(createAbortError())
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

function cloneColumns(columns) {
  return columns.map((column) => ({
    ...column,
    previewValues: [...column.previewValues],
  }))
}

function cloneIssues(issues) {
  return issues.map((issue) => ({ ...issue }))
}

function getProfile(fileName) {
  const normalizedName = String(fileName).toLocaleLowerCase('en-US')
  const profileKey = /(error|invalid|bad)/.test(normalizedName)
    ? 'issues'
    : 'normal'

  return mockLeadImportProfiles[profileKey]
}

export function inspectLeadImportFile(file, { signal } = {}) {
  return runMockOperation({
    delay: INSPECTION_DELAY_MS,
    signal,
    operation: () => {
      if (file.name.toLocaleLowerCase('en-US').includes('fail-upload')) {
        throw new Error(
          'The simulated file inspection failed. Choose another file or rename this sample to retry.',
        )
      }

      const profile = getProfile(file.name)
      return {
        profileId: profile.id,
        columns: cloneColumns(profile.columns),
      }
    },
  })
}

export function validateLeadImportRows(
  { profileId },
  { signal } = {},
) {
  return runMockOperation({
    delay: VALIDATION_DELAY_MS,
    signal,
    operation: () => {
      const profile =
        mockLeadImportProfiles[profileId] ?? mockLeadImportProfiles.normal

      return {
        summary: { ...profile.summary },
        issues: cloneIssues(profile.issues),
      }
    },
  })
}

export function startLeadImport(
  { fileName, validRows },
  { signal } = {},
) {
  return runMockOperation({
    delay: IMPORT_DELAY_MS,
    signal,
    operation: () => {
      if (
        fileName.toLocaleLowerCase('en-US').includes('fail-import')
      ) {
        throw new Error(
          'The simulated import could not be completed. Your file and mappings have been preserved.',
        )
      }

      return {
        importedRows: validRows,
        simulated: true,
      }
    },
  })
}
