import { useId, useRef } from 'react'
import {
  FileSpreadsheet,
  RefreshCw,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import { LEAD_IMPORT_ACCEPT } from '../data/mockLeadImportData.js'
import { formatLeadImportBytes } from '../utils/leadImportValidation.js'

function LeadFileUpload({
  fileMetadata,
  phase,
  error,
  disabled = false,
  isDragActive,
  onDragActiveChange,
  onFilesSelected,
  onRemove,
}) {
  const generatedId = useId().replaceAll(':', '')
  const inputId = `lead-import-file-${generatedId}`
  const requirementsId = `${inputId}-requirements`
  const errorId = `${inputId}-error`
  const inputRef = useRef(null)
  const dragDepthRef = useRef(0)
  const isInspecting = phase === 'file-validating'
  const describedBy = [requirementsId, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  function openFilePicker() {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  function handleInputChange(event) {
    onFilesSelected(event.target.files)
    // Clearing the value lets a removed or rejected file be chosen again.
    event.target.value = ''
  }

  function handleDragEnter(event) {
    event.preventDefault()
    event.stopPropagation()

    if (disabled) {
      return
    }

    dragDepthRef.current += 1
    onDragActiveChange(true)
  }

  function handleDragOver(event) {
    event.preventDefault()
    event.stopPropagation()

    if (!disabled) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  function handleDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()

    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) {
      onDragActiveChange(false)
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current = 0
    onDragActiveChange(false)

    if (!disabled) {
      onFilesSelected(event.dataTransfer.files)
    }
  }

  return (
    <section aria-labelledby="lead-file-upload-title">
      <div className="mb-4">
        <h2
          id="lead-file-upload-title"
          className="text-role-section-title text-text-primary"
        >
          Upload lead file
        </h2>
        <p
          id={requirementsId}
          className="mt-1 text-role-helper text-text-secondary"
        >
          CSV or Excel (.csv, .xls, .xlsx), up to 10 MB. This prototype
          uses the file metadata and simulated preview data.
        </p>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={LEAD_IMPORT_ACCEPT}
        disabled={disabled}
        tabIndex="-1"
        aria-label="Choose a CSV or Excel lead file"
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        onChange={handleInputChange}
        className="sr-only"
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'min-w-0 rounded-xl border border-dashed p-5 transition-colors motion-reduce:transition-none sm:p-6',
          isDragActive
            ? 'border-brand-accent bg-brand-accent/10'
            : error
              ? 'border-danger bg-danger/5'
              : 'border-border-default bg-surface-page',
        ].join(' ')}
      >
        {fileMetadata ? (
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-card text-brand-secondary shadow-sm"
            >
              <FileSpreadsheet className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p
                title={fileMetadata.name}
                className="break-words font-semibold text-text-primary"
              >
                {fileMetadata.name}
              </p>
              <p className="mt-1 text-role-helper text-text-secondary">
                {formatLeadImportBytes(fileMetadata.size)}
                {fileMetadata.extension && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>
                      {fileMetadata.extension.toLocaleUpperCase('en-US')}{' '}
                      file
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                disabled={disabled}
                onClick={openFilePicker}
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                disabled={disabled}
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            onClick={openFilePicker}
            className={[
              'flex w-full flex-col items-center rounded-lg px-4 py-5 text-center',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full bg-surface-card text-brand-secondary shadow-sm"
            >
              <UploadCloud className="size-6" />
            </span>
            <span className="mt-4 font-semibold text-text-primary">
              {isDragActive
                ? 'Drop the file to select it'
                : 'Drag and drop a lead file here'}
            </span>
            <span className="mt-1 text-role-helper text-text-secondary">
              or activate this area to browse files
            </span>
          </button>
        )}

        {isInspecting && (
          <LoadingState
            label="Inspecting file metadata and preparing simulated columns…"
            announce={false}
            className="mt-4 justify-center"
          />
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
        >
          {error}
        </p>
      )}
    </section>
  )
}

export default LeadFileUpload
