import { ListPlus, SearchX } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'

function LeadListsEmptyState({
  filtered = false,
  onReset,
  onImport,
}) {
  const Icon = filtered ? SearchX : ListPlus

  return (
    <div
      role="status"
      className="mx-auto flex max-w-md flex-col items-center text-center"
    >
      <span
        aria-hidden="true"
        className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-page text-text-secondary"
      >
        <Icon className="size-6" />
      </span>
      <p className="text-role-section-title text-text-primary">
        {filtered
          ? 'No lead lists match your filters'
          : 'No lead lists imported yet'}
      </p>
      <p className="mt-2 text-role-helper text-text-secondary">
        {filtered
          ? 'Adjust or clear the current filters to see more lead lists.'
          : 'Import a file to create the first lead list for your team.'}
      </p>
      <div className="mt-5">
        {filtered ? (
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear filters
          </Button>
        ) : (
          <Button variant="accent" size="sm" onClick={onImport}>
            Import Leads
          </Button>
        )}
      </div>
    </div>
  )
}

export default LeadListsEmptyState
