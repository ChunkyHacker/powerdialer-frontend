import { ChartNoAxesColumnIncreasing } from 'lucide-react'
import ChartCard from '../../../components/ui/ChartCard.jsx'

const VIEWBOX_WIDTH = 600
const VIEWBOX_HEIGHT = 290
const PLOT = {
  top: 10,
  right: 12,
  bottom: 50,
  left: 38,
}

const seriesStyles = {
  accent: 'fill-brand-accent',
  primary: 'fill-brand-primary',
}

function CampaignChartGraphic({ chart }) {
  const plotWidth = VIEWBOX_WIDTH - PLOT.left - PLOT.right
  const plotHeight = VIEWBOX_HEIGHT - PLOT.top - PLOT.bottom
  const allValues = chart.campaigns.flatMap((campaign) =>
    chart.series.map((series) => campaign[series.id] ?? 0),
  )
  const rawMaximum = Math.max(0, ...allValues)
  const yMaximum = Math.max(100, Math.ceil(rawMaximum / 100) * 100)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(yMaximum * ratio),
    y: PLOT.top + plotHeight - plotHeight * ratio,
  }))
  const groupWidth = plotWidth / chart.campaigns.length
  const barWidth = Math.min(30, groupWidth / 3)
  const strongestCampaign = chart.campaigns.reduce(
    (strongest, campaign) =>
      campaign.connections > strongest.connections
        ? campaign
        : strongest,
    chart.campaigns[0],
  )

  return (
    <figure className="relative flex h-full min-w-0 flex-col">
      <figcaption className="sr-only">Campaign performance</figcaption>
      <p className="sr-only">
        {strongestCampaign.name} recorded the most connections with{' '}
        {strongestCampaign.connections}. Solid navy bars show call
        attempts and teal bars show connections.
      </p>

      <div
        aria-hidden="true"
        className="mb-1 flex flex-wrap justify-end gap-x-5 gap-y-1 text-role-helper text-text-secondary"
      >
        {chart.series.map((series) => (
          <span key={series.id} className="inline-flex items-center gap-2">
            <span
              className={[
                'size-2.5 rounded-sm',
                series.tone === 'accent'
                  ? 'bg-brand-accent'
                  : 'bg-brand-primary',
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

        {chart.campaigns.map((campaign, campaignIndex) => {
          const groupCenter =
            PLOT.left + groupWidth * campaignIndex + groupWidth / 2
          const totalBarsWidth =
            chart.series.length * barWidth +
            (chart.series.length - 1) * 5
          const startX = groupCenter - totalBarsWidth / 2

          return (
            <g key={campaign.id}>
              {chart.series.map((series, seriesIndex) => {
                const value = campaign[series.id] ?? 0
                const height = (value / yMaximum) * plotHeight

                return (
                  <rect
                    key={series.id}
                    x={startX + seriesIndex * (barWidth + 5)}
                    y={PLOT.top + plotHeight - height}
                    width={barWidth}
                    height={height}
                    rx="3"
                    className={
                      seriesStyles[series.tone] ?? seriesStyles.primary
                    }
                  />
                )
              })}
              <text
                x={groupCenter}
                y={VIEWBOX_HEIGHT - 24}
                textAnchor="middle"
                className="fill-text-secondary text-[10px]"
              >
                {campaign.name.length > 14
                  ? `${campaign.name.slice(0, 13)}…`
                  : campaign.name}
              </text>
            </g>
          )
        })}
      </svg>

      <table className="sr-only">
        <caption>Attempts and connections by campaign</caption>
        <thead>
          <tr>
            <th scope="col">Campaign</th>
            {chart.series.map((series) => (
              <th key={series.id} scope="col">
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <th scope="row">{campaign.name}</th>
              {chart.series.map((series) => (
                <td key={series.id}>{campaign[series.id]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

function CampaignPerformanceChart({
  chart,
  dateRangeLabel,
  loading = false,
}) {
  const hasData =
    Array.isArray(chart?.campaigns) && chart.campaigns.length > 0

  return (
    <ChartCard
      title="Campaign Performance"
      description={`Attempts and connections for ${dateRangeLabel.toLowerCase()}`}
      loading={loading}
      empty={!loading && !hasData}
      emptyIcon={<ChartNoAxesColumnIncreasing />}
      emptyTitle="No campaign data"
      emptyDescription={`No campaign performance is available for ${dateRangeLabel.toLowerCase()}.`}
    >
      {hasData && <CampaignChartGraphic chart={chart} />}
    </ChartCard>
  )
}

export default CampaignPerformanceChart
