import { ArrowLeft, CircleCheck, Play, RotateCcw } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import Button from '../../../components/ui/Button.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import LeadColumnMapping from '../components/LeadColumnMapping.jsx'
import LeadFileUpload from '../components/LeadFileUpload.jsx'
import LeadImportSummary from '../components/LeadImportSummary.jsx'
import { useLeadImport } from '../hooks/useLeadImport.js'

function LeadImportPage() {
  const navigate = useNavigate()
  const {
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
    removeFile,
    reset,
    retryImport,
    retryRowValidation,
    selectFiles,
    setIsDragActive,
    startImport,
    updateMapping,
  } = useLeadImport()
  const isImporting = phase === 'importing'
  const uploadError =
    ['file', 'file-inspection'].includes(asyncError?.stage)
      ? asyncError.message
      : null
  const processError =
    ['row-validation', 'import'].includes(asyncError?.stage)
      ? asyncError
      : null

  function handleCancel() {
    reset()
    navigate('/lead-lists')
  }

  return (
    <div className="min-w-0 space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-role-helper text-text-secondary">
          <li>
            <Link
              to="/lead-lists"
              className="rounded-sm hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Lead Lists
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-text-primary">
            Import Leads
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-role-page-title">Import Leads</h1>
          <p className="mt-1 max-w-2xl text-role-body-copy text-text-secondary">
            Upload a lead file, review simulated column mappings and
            validation results, then start a frontend-only mock import.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={ArrowLeft}
          onClick={handleCancel}
          className="self-start sm:self-auto"
        >
          Cancel
        </Button>
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {phase === 'success' && importResult && (
        <Card
          status="accent"
          aria-labelledby="lead-import-success-title"
        >
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
            >
              <CircleCheck className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="lead-import-success-title"
                className="text-role-section-title text-text-primary"
              >
                Simulated import complete
              </h2>
              <p className="mt-1 text-role-helper text-text-secondary">
                {importResult.importedRows.toLocaleString('en-US')} valid
                rows were processed locally. No Lead Lists history record
                was created.
              </p>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={handleCancel}
              className="self-start sm:self-auto"
            >
              Return to Lead Lists
            </Button>
          </CardContent>
        </Card>
      )}

      {processError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="min-w-0 break-words">{processError.message}</p>
          {processError.stage === 'row-validation' && (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={retryRowValidation}
              className="shrink-0 self-start"
            >
              Retry validation
            </Button>
          )}
        </div>
      )}

      <Card>
        <CardContent>
          <LeadFileUpload
            fileMetadata={fileMetadata}
            phase={phase}
            error={uploadError}
            disabled={isImporting}
            isDragActive={isDragActive}
            onDragActiveChange={setIsDragActive}
            onFilesSelected={selectFiles}
            onRemove={removeFile}
          />
        </CardContent>
      </Card>

      {columns.length > 0 ? (
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:items-start">
          <div className="min-w-0">
            <LeadColumnMapping
              columns={columns}
              mappingValidation={mappingValidation}
              focusRequest={focusRequest}
              disabled={isImporting || phase === 'success'}
              onMappingChange={updateMapping}
            />
          </div>

          <div
            className={[
              'min-w-0',
              phase !== 'success' && 'xl:sticky xl:top-6',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <LeadImportSummary
              phase={phase}
              summary={validationSummary}
              issues={validationIssues}
            />
          </div>
        </div>
      ) : (
        <div className="min-w-0">
          <LeadImportSummary
            phase={phase}
            summary={validationSummary}
            issues={validationIssues}
          />
        </div>
      )}

      {phase !== 'success' && (
        <div className="flex flex-col-reverse gap-3 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="accent"
            size="md"
            icon={canRetryImport ? RotateCcw : Play}
            isLoading={isImporting}
            disabled={
              isImporting
                ? false
                : canRetryImport
                  ? false
                  : !canStartImport
            }
            onClick={canRetryImport ? retryImport : startImport}
            className="w-full sm:min-w-40 sm:w-auto"
          >
            {isImporting
              ? 'Starting import'
              : canRetryImport
                ? 'Retry Import'
                : 'Start Import'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default LeadImportPage
