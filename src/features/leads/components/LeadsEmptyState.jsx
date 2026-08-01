import { RotateCcw, SearchX, UserRoundPlus } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'

function LeadsEmptyState({
  type = 'source',
  onReset,
  onNewLead,
  onRetry,
}) {
  const isFiltered = type === 'filtered'
  const isError = type === 'error'
  const Icon = isError ? RotateCcw : isFiltered ? SearchX : UserRoundPlus

  const title = isError
    ? 'Lead data could not be loaded'
    : isFiltered
      ? 'No leads match your filters'
      : 'No leads added yet'
  const description = isError
    ? 'Try loading the lead records again.'
    : isFiltered
      ? 'Adjust or clear the current filters to see more leads.'
      : 'Add the first lead when the creation workflow is available.'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className="mx-auto flex max-w-md flex-col items-center text-center"
    >
      <span
        aria-hidden="true"
        className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-page text-text-secondary"
      >
        <Icon className="size-6" />
      </span>
      <p className="text-role-section-title text-text-primary">{title}</p>
      <p className="mt-2 text-role-helper text-text-secondary">
        {description}
      </p>
      <div className="mt-5">
        {isError ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : isFiltered ? (
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear filters
          </Button>
        ) : (
          <Button variant="accent" size="sm" onClick={onNewLead}>
            New Lead
          </Button>
        )}
      </div>
    </div>
  )
}

export default LeadsEmptyState
