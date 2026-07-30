import { Megaphone, SearchX } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'

function CampaignEmptyState({
  filtered = false,
  onReset,
  onCreate,
}) {
  const Icon = filtered ? SearchX : Megaphone

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
        {filtered ? 'No campaigns match your filters' : 'No campaigns yet'}
      </p>
      <p className="mt-2 text-role-helper text-text-secondary">
        {filtered
          ? 'Adjust or clear the current filters to see more campaigns.'
          : 'Create the first campaign when your team is ready to start calling.'}
      </p>
      <div className="mt-5">
        {filtered ? (
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear filters
          </Button>
        ) : (
          <Button variant="accent" size="sm" onClick={onCreate}>
            Create Campaign
          </Button>
        )}
      </div>
    </div>
  )
}

export default CampaignEmptyState
