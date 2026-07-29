import { useId } from 'react'
import { ChartNoAxesCombined } from 'lucide-react'
import ChartCard from '../../../components/ui/ChartCard.jsx'

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 290
const PLOT = {
  top: 10,
  right: 12,
  bottom: 42,
  left: 38,
}

const seriesStyles = {
  accent: {
    line: 'stroke-brand-accent',
    marker: 'fill-brand-accent stroke-surface-card',
  },
  primary: {
    line: 'stroke-brand-primary',
    marker: 'fill-brand-primary stroke-surface-card',
  },
}

function createLinePath(points) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ')
}

function createAreaPath(points, baseline) {
  if (points.length === 0) {
    return ''
  }

  return [
    `M ${points[0].x} ${baseline}`,
    ...points.map((point) => `L ${point.x} ${point.y}`),
    `L ${points.at(-1).x} ${baseline}`,
    'Z',
  ].join(' ')
}

function formatDateLabel(timestamp, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  }).format(new Date(timestamp))
}

function CallsChartGraphic({ chart, timezone }) {
  const generatedId = useId().replaceAll(':', '')
  const captionId = `${generatedId}-caption`
  const summaryId = `${generatedId}-summary`
  const plotWidth = VIEWBOX_WIDTH - PLOT.left - PLOT.right
  const plotHeight = VIEWBOX_HEIGHT - PLOT.top - PLOT.bottom
  const allValues = chart.points.flatMap((point) =>
    chart.series.map((series) => point.values[series.id] ?? 0),
  )
  const rawMaximum = Math.max(0, ...allValues)
  const yMaximum = Math.max(50, Math.ceil(rawMaximum / 50) * 50)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(yMaximum * ratio),
    y: PLOT.top + plotHeight - plotHeight * ratio,
  }))
  const xStep =
    chart.points.length > 1 ? plotWidth / (chart.points.length - 1) : 0

  const plottedSeries = chart.series.map((series) => ({
    ...series,
    points: chart.points.map((point, pointIndex) => ({
      id: point.id,
      value: point.values[series.id] ?? 0,
      x: PLOT.left + pointIndex * xStep,
      y:
        PLOT.top +
        plotHeight -
        ((point.values[series.id] ?? 0) / yMaximum) * plotHeight,
    })),
  }))
  const totalSeries =
    plottedSeries.find((series) => series.id === 'total') ??
    plottedSeries[0]
  const peakPoint = totalSeries?.points.reduce(
    (peak, point) => (point.value > peak.value ? point : peak),
    totalSeries.points[0],
  )
  const peakSource = chart.points.find(
    (point) => point.id === peakPoint?.id,
  )
  const summary = peakPoint
    ? `${totalSeries.label} peaked at ${peakPoint.value} on ${formatDateLabel(peakSource.timestamp, timezone)}.`
    : 'No call totals are available.'

  return (
    <figure
      aria-labelledby={captionId}
      aria-describedby={summaryId}
      className="relative flex h-full min-w-0 flex-col"
    >
      <figcaption id={captionId} className="sr-only">
        Calls over time
      </figcaption>
      <p id={summaryId} className="sr-only">
        {summary} Solid circular markers show total calls. Dashed square
        markers show connected calls.
      </p>

      <div
        aria-hidden="true"
        className="mb-1 flex flex-wrap justify-end gap-x-5 gap-y-1 text-role-helper text-text-secondary"
      >
        {chart.series.map((series) => (
          <span key={series.id} className="inline-flex items-center gap-2">
            <span
              className={[
                'h-0.5 w-5',
                series.tone === 'accent'
                  ? 'bg-brand-accent'
                  : 'border-t-2 border-dashed border-brand-primary',
              ].join(' ')}
            />
            {series.label}
          </span>
        ))}
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="min-h-0 flex-1 overflow-visible"
      >
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PLOT.left}
              x2={VIEWBOX_WIDTH - PLOT.right}
              y1={tick.y}
              y2={tick.y}
              className="stroke-border-default"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={PLOT.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-text-secondary text-[11px]"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {chart.points.map((point, index) => (
          <text
            key={point.id}
            x={PLOT.left + index * xStep}
            y={VIEWBOX_HEIGHT - 12}
            textAnchor="middle"
            className="fill-text-secondary text-[11px]"
          >
            {formatDateLabel(point.timestamp, timezone)}
          </text>
        ))}

        {totalSeries && (
          <path
            d={createAreaPath(
              totalSeries.points,
              PLOT.top + plotHeight,
            )}
            className="fill-brand-accent/10"
          />
        )}

        {plottedSeries.map((series) => {
          const style =
            seriesStyles[series.tone] ?? seriesStyles.primary
          const isConnected = series.id === 'connected'

          return (
            <g key={series.id}>
              <path
                d={createLinePath(series.points)}
                fill="none"
                className={style.line}
                strokeWidth="3"
                strokeDasharray={isConnected ? '7 5' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {series.points.map((point) =>
                isConnected ? (
                  <rect
                    key={point.id}
                    x={point.x - 3.5}
                    y={point.y - 3.5}
                    width="7"
                    height="7"
                    rx="1"
                    className={style.marker}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : (
                  <circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    className={style.marker}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                ),
              )}
            </g>
          )
        })}
      </svg>

      <table className="sr-only">
        <caption>Calls by date and series</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            {chart.series.map((series) => (
              <th key={series.id} scope="col">
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.points.map((point) => (
            <tr key={point.id}>
              <th scope="row">
                {formatDateLabel(point.timestamp, timezone)}
              </th>
              {chart.series.map((series) => (
                <td key={series.id}>{point.values[series.id]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

function CallsOverTimeChart({
  chart,
  dateRangeLabel,
  timezone,
  loading = false,
}) {
  const hasData =
    Array.isArray(chart?.points) && chart.points.length > 0

  return (
    <ChartCard
      title="Calls Over Time"
      description={`Call volume for ${dateRangeLabel.toLowerCase()}`}
      loading={loading}
      empty={!loading && !hasData}
      emptyIcon={<ChartNoAxesCombined />}
      emptyTitle="No call data"
      emptyDescription={`No calls were recorded for ${dateRangeLabel.toLowerCase()}.`}
    >
      {hasData && (
        <CallsChartGraphic chart={chart} timezone={timezone} />
      )}
    </ChartCard>
  )
}

export default CallsOverTimeChart
