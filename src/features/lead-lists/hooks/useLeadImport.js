import { useEffect, useMemo, useRef, useState } from 'react'
import {
  inspectLeadImportFile,
  startLeadImport,
  validateLeadImportRows,
} from '../services/mockLeadImportService.js'
import {
  canStartLeadImport,
  deriveLeadImportMappingValidation,
  getLeadImportFileExtension,
  suggestLeadImportMapping,
  validateLeadImportFile,
} from '../utils/leadImportValidation.js'

function createFileMetadata(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type || '',
    extension: getLeadImportFileExtension(file.name),
    lastModified: file.lastModified,
  }
}

export function useLeadImport() {
  const activeControllerRef = useRef(null)
  const requestSequenceRef = useRef(0)
  const mountedRef = useRef(true)
  const [rawFile, setRawFile] = useState(null)
  const [fileMetadata, setFileMetadata] = useState(null)
  const [phase, setPhase] = useState('empty')
  const [isDragActive, setIsDragActive] = useState(false)
  const [profileId, setProfileId] = useState(null)
  const [columns, setColumns] = useState([])
  const [validationSummary, setValidationSummary] = useState(null)
  const [validationIssues, setValidationIssues] = useState([])
  const [asyncError, setAsyncError] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const [announcement, setAnnouncement] = useState(
    'Choose a CSV or Excel file to begin.',
  )
  const [focusRequest, setFocusRequest] = useState({
    columnId: null,
    revision: 0,
  })

  const mappingValidation = useMemo(
    () => deriveLeadImportMappingValidation(columns),
    [columns],
  )
  const canStartImport = canStartLeadImport({
    phase,
    hasFile: Boolean(rawFile),
    mappingsValid: mappingValidation.isValid,
    hasValidationSummary: Boolean(validationSummary),
  })
  const canRetryImport =
    phase === 'failure' &&
    asyncError?.stage === 'import' &&
    Boolean(rawFile) &&
    mappingValidation.isValid &&
    Boolean(validationSummary)

  function abortActiveRequest() {
    activeControllerRef.current?.abort()
    activeControllerRef.current = null
    requestSequenceRef.current += 1
  }

  function beginRequest() {
    abortActiveRequest()
    const controller = new AbortController()
    activeControllerRef.current = controller

    return {
      controller,
      token: requestSequenceRef.current,
    }
  }

  function isCurrentRequest(token, controller) {
    return (
      mountedRef.current &&
      requestSequenceRef.current === token &&
      activeControllerRef.current === controller &&
      !controller.signal.aborted
    )
  }

  function clearWorkflowState() {
    setRawFile(null)
    setFileMetadata(null)
    setPhase('empty')
    setIsDragActive(false)
    setProfileId(null)
    setColumns([])
    setValidationSummary(null)
    setValidationIssues([])
    setAsyncError(null)
    setImportResult(null)
    setAnnouncement('Choose a CSV or Excel file to begin.')
    setFocusRequest({ columnId: null, revision: 0 })
  }

  function reset() {
    abortActiveRequest()
    clearWorkflowState()
  }

  function initializeColumns(sourceColumns) {
    return sourceColumns.map((column) => ({
      ...column,
      selectedFieldId: suggestLeadImportMapping(column.name),
      mappingSource: 'auto',
    }))
  }

  async function runRowValidation(
    nextColumns,
    nextProfileId,
    selectedFile,
  ) {
    const nextMappingValidation =
      deriveLeadImportMappingValidation(nextColumns)

    setValidationSummary(null)
    setValidationIssues([])
    setImportResult(null)

    if (!nextMappingValidation.isValid) {
      abortActiveRequest()
      setPhase('mapping')
      setAnnouncement(
        'Column mappings need attention before row validation can begin.',
      )
      return
    }

    const { controller, token } = beginRequest()
    setPhase('validation-validating')
    setAsyncError(null)
    setAnnouncement('Validating simulated lead rows.')

    try {
      const result = await validateLeadImportRows(
        {
          fileName: selectedFile.name,
          profileId: nextProfileId,
          mappings: nextColumns.map((column) => ({
            sourceColumnId: column.id,
            destinationFieldId: column.selectedFieldId,
          })),
        },
        { signal: controller.signal },
      )

      if (!isCurrentRequest(token, controller)) {
        return
      }

      activeControllerRef.current = null
      setValidationSummary(result.summary)
      setValidationIssues(result.issues)
      setPhase('ready')
      setAnnouncement(
        `Validation complete. ${result.summary.validRows.toLocaleString('en-US')} valid rows and ${result.summary.errorRows.toLocaleString('en-US')} error rows.`,
      )
    } catch (error) {
      if (
        !isCurrentRequest(token, controller) ||
        error?.name === 'AbortError'
      ) {
        return
      }

      activeControllerRef.current = null
      setPhase('failure')
      setAsyncError({
        stage: 'row-validation',
        message:
          error instanceof Error
            ? error.message
            : 'The simulated row validation could not be completed.',
      })
      setAnnouncement('Simulated row validation failed.')
    }
  }

  async function selectFiles(fileCollection) {
    reset()
    const files = Array.from(fileCollection ?? [])

    if (files.length > 1) {
      setPhase('file-rejected')
      setAsyncError({
        stage: 'file',
        message: 'Select one file at a time.',
      })
      setAnnouncement('File rejected. Select one file at a time.')
      return
    }

    const file = files[0]
    const validationError = validateLeadImportFile(file)

    if (validationError) {
      setFileMetadata(file ? createFileMetadata(file) : null)
      setPhase('file-rejected')
      setAsyncError({ stage: 'file', message: validationError })
      setAnnouncement(`File rejected. ${validationError}`)
      return
    }

    const metadata = createFileMetadata(file)
    const { controller, token } = beginRequest()
    setRawFile(file)
    setFileMetadata(metadata)
    setPhase('file-validating')
    setAsyncError(null)
    setAnnouncement(`Inspecting ${file.name}.`)

    try {
      const inspection = await inspectLeadImportFile(file, {
        signal: controller.signal,
      })

      if (!isCurrentRequest(token, controller)) {
        return
      }

      activeControllerRef.current = null
      const initializedColumns = initializeColumns(inspection.columns)
      setProfileId(inspection.profileId)
      setColumns(initializedColumns)
      setPhase('mapping')
      setAnnouncement(
        'Simulated columns are ready. Review the automatic mappings.',
      )
      await runRowValidation(
        initializedColumns,
        inspection.profileId,
        file,
      )
    } catch (error) {
      if (
        !isCurrentRequest(token, controller) ||
        error?.name === 'AbortError'
      ) {
        return
      }

      activeControllerRef.current = null
      setPhase('failure')
      setAsyncError({
        stage: 'file-inspection',
        message:
          error instanceof Error
            ? error.message
            : 'The simulated file inspection could not be completed.',
      })
      setAnnouncement('Simulated file inspection failed.')
    }
  }

  function updateMapping(columnId, selectedFieldId) {
    if (phase === 'importing') {
      return
    }

    const nextColumns = columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            selectedFieldId,
            mappingSource: 'user',
          }
        : column,
    )

    setColumns(nextColumns)
    setAsyncError(null)
    runRowValidation(nextColumns, profileId, rawFile)
  }

  function requestInvalidMappingFocus() {
    const columnId = mappingValidation.firstInvalidColumnId
    setAnnouncement(
      mappingValidation.sectionError ??
        'Resolve the duplicate destination mappings before starting the import.',
    )
    setFocusRequest((currentRequest) => ({
      columnId,
      revision: currentRequest.revision + 1,
    }))
  }

  async function runImport({ retry = false } = {}) {
    const allowedPhase =
      phase === 'ready' ||
      (retry && phase === 'failure' && asyncError?.stage === 'import')

    if (!mappingValidation.isValid) {
      requestInvalidMappingFocus()
      return
    }

    if (
      !allowedPhase ||
      !rawFile ||
      !validationSummary
    ) {
      setAnnouncement(
        'Complete the latest file and row validation before starting the import.',
      )
      return
    }

    const { controller, token } = beginRequest()
    setPhase('importing')
    setAsyncError(null)
    setImportResult(null)
    setAnnouncement('Starting the simulated import.')

    try {
      const result = await startLeadImport(
        {
          fileName: rawFile.name,
          validRows: validationSummary.validRows,
          mappings: columns.map((column) => ({
            sourceColumnId: column.id,
            destinationFieldId: column.selectedFieldId,
          })),
        },
        { signal: controller.signal },
      )

      if (!isCurrentRequest(token, controller)) {
        return
      }

      activeControllerRef.current = null
      setImportResult(result)
      setPhase('success')
      setAnnouncement(
        `Simulated import complete. ${result.importedRows.toLocaleString('en-US')} valid rows were processed locally.`,
      )
    } catch (error) {
      if (
        !isCurrentRequest(token, controller) ||
        error?.name === 'AbortError'
      ) {
        return
      }

      activeControllerRef.current = null
      setPhase('failure')
      setAsyncError({
        stage: 'import',
        message:
          error instanceof Error
            ? error.message
            : 'The simulated import could not be completed.',
      })
      setAnnouncement('The simulated import failed. You can retry.')
    }
  }

  function retryRowValidation() {
    if (rawFile && profileId && mappingValidation.isValid) {
      runRowValidation(columns, profileId, rawFile)
    }
  }

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      activeControllerRef.current?.abort()
      activeControllerRef.current = null
      requestSequenceRef.current += 1
    }
  }, [])

  return {
    announcement,
    asyncError,
    canRetryImport,
    canStartImport,
    columns,
    fileMetadata,
    focusRequest,
    importResult,
    isDragActive,
    mappingValidation,
    phase,
    validationIssues,
    validationSummary,
    removeFile: reset,
    reset,
    retryImport: () => runImport({ retry: true }),
    retryRowValidation,
    selectFiles,
    setIsDragActive,
    startImport: runImport,
    updateMapping,
  }
}
