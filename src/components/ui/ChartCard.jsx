/**
 * Provides chart-library-independent framing, semantics, and state presentation
 * around arbitrary chart content. Header actions remain outside the fixed chart
 * viewport so they do not change the chart body's layout contract.
 */
import { useId } from 'react'
import Card from './Card.jsx'
import CardContent from './CardContent.jsx'
import CardDescription from './CardDescription.jsx'
import CardHeader from './CardHeader.jsx'
import CardTitle from './CardTitle.jsx'
import Skeleton from './Skeleton.jsx'

const viewportClasses = {
  standard: 'h-64',
  large: 'h-96',
}

function ChartSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full flex-col justify-end gap-4"
    >
      <div className="flex items-end gap-3">
        {['h-20', 'h-32', 'h-24', 'h-44', 'h-36', 'h-52', 'h-40'].map(
          (heightClass, index) => (
            <Skeleton
              key={heightClass + index}
              radius="sm"
              className={['min-w-0 flex-1', heightClass].join(' ')}
            />
          ),
        )}
      </div>
      <div className="flex justify-between gap-3">
        <Skeleton width="3rem" height="0.75rem" />
        <Skeleton width="3rem" height="0.75rem" />
        <Skeleton width="3rem" height="0.75rem" />
        <Skeleton width="3rem" height="0.75rem" />
      </div>
    </div>
  )
}

function ChartEmptyState({
  icon,
  title,
  description,
  action,
  titleId,
  descriptionId,
}) {
  const hasIcon = icon !== undefined && icon !== null
  const hasTitle = title !== undefined && title !== null
  const hasDescription = description !== undefined && description !== null
  const hasAction = action !== undefined && action !== null

  return (
    <div
      role="status"
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className="flex h-full w-full flex-col items-center justify-center text-center"
    >
      {hasIcon && (
        <div
          aria-hidden="true"
          className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-page text-text-secondary [&>svg]:size-6"
        >
          {icon}
        </div>
      )}
      {hasTitle && (
        <p id={titleId} className="text-role-section-title text-text-primary">
          {title}
        </p>
      )}
      {hasDescription && (
        <p
          id={descriptionId}
          className="mt-2 max-w-md text-role-helper text-text-secondary"
        >
          {description}
        </p>
      )}
      {hasAction && <div className="mt-5">{action}</div>}
    </div>
  )
}

function ChartCard({
  title,
  description,
  actions,
  loading = false,
  empty = false,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  size = 'standard',
  className = '',
  children,
}) {
  // Stable IDs connect the card heading and optional description to the chart
  // region without requiring consumers to coordinate accessibility attributes.
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const descriptionId = `${generatedId}-description`
  const emptyTitleId = `${generatedId}-empty-title`
  const emptyDescriptionId = `${generatedId}-empty-description`
  const hasDescription = description !== undefined && description !== null
  const hasActions = actions !== undefined && actions !== null
  const selectedViewport =
    viewportClasses[size] ?? viewportClasses.standard

  // Loading has priority over empty and populated states so only one body state
  // renders, while the shared viewport keeps every state at a predictable size.
  let content = children
  if (loading) {
    content = <ChartSkeleton />
  } else if (empty) {
    content = (
      <ChartEmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        titleId={emptyTitleId}
        descriptionId={emptyDescriptionId}
      />
    )
  }

  return (
    <Card
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={['flex h-full min-w-0 flex-col', className]
        .filter(Boolean)
        .join(' ')}
    >
      <CardHeader>
        <div className="min-w-0 flex-1">
          <CardTitle id={titleId}>{title}</CardTitle>
          {hasDescription && (
            <CardDescription id={descriptionId}>
              {description}
            </CardDescription>
          )}
        </div>
        {hasActions && <div className="shrink-0">{actions}</div>}
      </CardHeader>
      <CardContent
        className={[
          'w-full min-w-0 flex-none',
          selectedViewport,
          '[&>*]:h-full [&>*]:w-full [&>*]:min-w-0',
        ].join(' ')}
      >
        {content}
      </CardContent>
    </Card>
  )
}

export default ChartCard
