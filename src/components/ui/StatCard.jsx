import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import Card from './Card.jsx'
import CardContent from './CardContent.jsx'
import Skeleton from './Skeleton.jsx'
import {
  statCardToneClasses,
  statCardTrendSentimentClasses,
} from './statCardStyles.js'

const trendDirections = {
  up: {
    label: 'Increased',
    icon: TrendingUp,
  },
  down: {
    label: 'Decreased',
    icon: TrendingDown,
  },
  neutral: {
    label: 'No change',
    icon: Minus,
  },
}

function normalizeTrend(trend) {
  if (!trend || typeof trend !== 'object' || Array.isArray(trend)) {
    return null
  }

  const direction = Object.prototype.hasOwnProperty.call(
    trendDirections,
    trend.direction,
  )
    ? trend.direction
    : 'neutral'
  const sentiment = Object.prototype.hasOwnProperty.call(
    statCardTrendSentimentClasses,
    trend.sentiment,
  )
    ? trend.sentiment
    : 'neutral'

  return {
    ...trend,
    direction,
    sentiment,
  }
}

function Trend({ trend }) {
  const normalizedTrend = normalizeTrend(trend)

  if (!normalizedTrend) {
    return null
  }

  const directionConfig = trendDirections[normalizedTrend.direction]
  const DefaultIcon = directionConfig.icon

  return (
    <p
      aria-label={normalizedTrend.ariaLabel}
      className={[
        'text-role-helper col-span-full mt-3 flex min-w-0 items-start gap-1.5',
        statCardTrendSentimentClasses[normalizedTrend.sentiment],
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center [&>svg]:size-4 [&>svg]:shrink-0"
      >
        {normalizedTrend.icon ?? <DefaultIcon />}
      </span>
      <span className="min-w-0 break-words">
        <span className="font-semibold">
          {directionConfig.label}
          {normalizedTrend.value !== undefined &&
            normalizedTrend.value !== null &&
            ` ${normalizedTrend.value}`}
        </span>
        {normalizedTrend.context && ` ${normalizedTrend.context}`}
      </span>
    </p>
  )
}

function StatCardSkeleton({ hasIcon, hasStatus, hasSupportingRow }) {
  const hasTopRow = hasIcon || hasStatus

  return (
    <CardContent className="h-full">
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4">
        {hasIcon && (
          <Skeleton
            width="2.5rem"
            height="2.5rem"
            radius="lg"
            className="col-start-1 row-start-1"
          />
        )}
        <div
          className={[
            'col-span-full min-w-0',
            hasTopRow ? 'row-start-2 mt-4' : 'row-start-1',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Skeleton width="7rem" height="0.875rem" />
          <Skeleton
            width="9rem"
            height="2.5rem"
            className="mt-3 max-w-full"
          />
        </div>
        {hasSupportingRow && (
          <Skeleton
            width="10rem"
            height="1.25rem"
            className="col-span-full mt-3 max-w-full"
          />
        )}
        {hasStatus && (
          <Skeleton
            width="4.5rem"
            height="1.5rem"
            radius="full"
            className="col-start-3 row-start-1"
          />
        )}
      </div>
    </CardContent>
  )
}

function StatCard({
  label,
  value,
  icon,
  tone = 'neutral',
  trend,
  status,
  loading = false,
  className = '',
  ...props
}) {
  const selectedTone =
    statCardToneClasses[tone] ?? statCardToneClasses.neutral
  const displayValue = value ?? '—'
  const hasTopRow = Boolean(icon || status)

  return (
    <Card
      {...props}
      as="div"
      className={['h-full min-w-0', className].filter(Boolean).join(' ')}
    >
      {loading ? (
        <StatCardSkeleton
          hasIcon={Boolean(icon)}
          hasStatus={Boolean(status)}
          hasSupportingRow={Boolean(trend)}
        />
      ) : (
        <CardContent className="h-full">
          <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4">
            {icon && (
              <span
                aria-hidden="true"
                className={[
                  'col-start-1 row-start-1 flex size-10 shrink-0 items-center justify-center rounded-lg',
                  '[&>svg]:size-5 [&>svg]:shrink-0',
                  selectedTone,
                ].join(' ')}
              >
                {icon}
              </span>
            )}

            <dl
              className={[
                'col-span-full min-w-0',
                hasTopRow ? 'row-start-2 mt-4' : 'row-start-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <dt className="text-role-helper break-words text-text-secondary">
                {label}
              </dt>
              <dd className="text-role-stat-value mt-2 min-w-0 break-words tabular-nums [overflow-wrap:anywhere]">
                {displayValue}
              </dd>
            </dl>

            <Trend trend={trend} />

            {status && (
              <div className="col-start-3 row-start-1 min-w-0 justify-self-end">
                {status}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default StatCard
