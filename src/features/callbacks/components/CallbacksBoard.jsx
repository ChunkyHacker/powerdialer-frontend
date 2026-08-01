import Button from '../../../components/ui/Button.jsx'
import Skeleton from '../../../components/ui/Skeleton.jsx'
import SkeletonCard from '../../../components/ui/SkeletonCard.jsx'
import SkeletonText from '../../../components/ui/SkeletonText.jsx'
import CallbackCard from './CallbackCard.jsx'
import CallbackEmptyState from './CallbackEmptyState.jsx'

const columns = [
  { key: 'overdue', title: 'Overdue' },
  { key: 'dueToday', title: 'Due Today' },
  { key: 'completed', title: 'Completed' },
]

function CallbackCardSkeleton() {
  return (
    <SkeletonCard compact className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <SkeletonText lines={2} lineWidths={['65%', '45%']} />
        <Skeleton width="2rem" height="2rem" radius="md" />
      </div>
      <SkeletonText lines={4} />
      <div className="flex gap-2 border-t border-border-default pt-4">
        <Skeleton width="6rem" height="2rem" radius="md" />
        <Skeleton width="7rem" height="2rem" radius="md" />
      </div>
    </SkeletonCard>
  )
}

function BoardColumn({
  column,
  records,
  agentMap,
  pendingActions,
  cardActions,
  loading,
}) {
  const headingId = `callback-column-${column.key}`

  return (
    <section
      aria-labelledby={headingId}
      aria-busy={loading || undefined}
      className="min-w-0 rounded-xl border border-border-default bg-surface-page p-3"
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h3 id={headingId} className="text-role-section-title text-text-primary">
          {column.title}
        </h3>
        {loading ? (
          <Skeleton width="2rem" height="1.25rem" radius="full" />
        ) : (
          <span
            aria-label={`${records.length} ${column.title.toLowerCase()} callbacks`}
            className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-surface-card px-1.5 text-xs font-semibold tabular-nums text-text-secondary"
          >
            {records.length}
          </span>
        )}
      </div>

      <div className="min-w-0 space-y-3">
        {loading ? (
          <>
            <CallbackCardSkeleton />
            <CallbackCardSkeleton />
          </>
        ) : records.length > 0 ? (
          records.map((callback) => (
            <CallbackCard
              key={callback.id}
              callback={callback}
              agent={agentMap.get(callback.assignedAgentId)}
              group={column.key === 'dueToday' ? 'due-today' : column.key}
              pendingAction={pendingActions[callback.id]}
              {...cardActions}
            />
          ))
        ) : (
          <CallbackEmptyState />
        )}
      </div>
    </section>
  )
}

function CallbacksBoard({
  callbacks,
  groups,
  agents,
  isLoading,
  loadError,
  pendingActions,
  announcement,
  boardHeadingRef,
  onRetry,
  onNewCallback,
  onCallNow,
  onReschedule,
  onViewDetails,
  onComplete,
}) {
  const agentMap = new Map(agents.map((agent) => [agent.id, agent]))
  const cardActions = {
    onCallNow,
    onReschedule,
    onViewDetails,
    onComplete,
  }

  return (
    <section aria-labelledby="callbacks-board-title" className="min-w-0">
      <h2
        ref={boardHeadingRef}
        id="callbacks-board-title"
        tabIndex={-1}
        className="mb-4 text-role-section-title text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        Callback Board
      </h2>

      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>

      {loadError && !isLoading ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-5 py-6 text-center"
        >
          <p className="text-role-section-title text-danger">
            Callback data could not be loaded
          </p>
          <p className="mt-2 text-role-helper text-text-secondary">
            Try loading the callback records again.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : !isLoading && callbacks.length === 0 ? (
        <div className="rounded-xl border border-border-default bg-surface-card">
          <CallbackEmptyState type="board" onNewCallback={onNewCallback} />
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.key}
              column={column}
              records={groups[column.key]}
              agentMap={agentMap}
              pendingActions={pendingActions}
              cardActions={cardActions}
              loading={isLoading}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default CallbacksBoard
