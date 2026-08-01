import { CalendarClock, Inbox } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'

function CallbackEmptyState({ type = 'column', onNewCallback }) {
  const isBoard = type === 'board'
  const Icon = isBoard ? CalendarClock : Inbox

  return (
    <div
      role="status"
      className={[
        'flex min-w-0 flex-col items-center text-center',
        isBoard ? 'mx-auto max-w-md py-10' : 'px-4 py-8',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className="mb-3 flex size-10 items-center justify-center rounded-full bg-surface-page text-text-secondary"
      >
        <Icon className="size-5" />
      </span>
      <p className="text-role-navigation font-semibold text-text-primary">
        {isBoard ? 'No callbacks scheduled' : 'Nothing in this column'}
      </p>
      <p className="mt-1 max-w-sm text-role-helper text-text-secondary">
        {isBoard
          ? 'New callback scheduling will be available in a later form workflow.'
          : 'Callbacks will appear here when their schedule or status matches.'}
      </p>
      {isBoard && (
        <Button
          variant="accent"
          size="sm"
          className="mt-4"
          onClick={onNewCallback}
        >
          New Callback
        </Button>
      )}
    </div>
  )
}

export default CallbackEmptyState
