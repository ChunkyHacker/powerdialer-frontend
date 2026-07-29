import {
  CalendarCheck,
  Clock3,
  Megaphone,
  PhoneCall,
  PhoneIncoming,
  Plus,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import Badge from '../../../components/ui/Badge.jsx'
import Button from '../../../components/ui/Button.jsx'
import {
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select.jsx'
import StatCard from '../../../components/ui/StatCard.jsx'
import CampaignPerformanceChart from '../components/CampaignPerformanceChart.jsx'
import CallsOverTimeChart from '../components/CallsOverTimeChart.jsx'
import RecentActivityTimeline from '../components/RecentActivityTimeline.jsx'
import RecentCallsTable from '../components/RecentCallsTable.jsx'
import SystemAlertsCard from '../components/SystemAlertsCard.jsx'
import { dashboardMetricPlaceholders } from '../data/mockDashboardData.js'
import { useDashboardData } from '../hooks/useDashboardData.js'

const metricIcons = {
  agents: UsersRound,
  calendar: CalendarCheck,
  campaign: Megaphone,
  clock: Clock3,
  conversion: TrendingUp,
  phone: PhoneCall,
  'phone-connected': PhoneIncoming,
  target: Target,
}

function formatMetricValue(metric) {
  if (metric.displayFormat === 'percent') {
    return `${metric.value.toLocaleString('en-US', {
      maximumFractionDigits: 1,
    })}%`
  }

  if (metric.displayFormat === 'duration') {
    const minutes = Math.floor(metric.value / 60)
    const seconds = metric.value % 60
    return `${minutes}m ${seconds}s`
  }

  return metric.value.toLocaleString('en-US')
}

function DashboardPage() {
  const navigate = useNavigate()
  const {
    data,
    dateRanges,
    error,
    isLoading,
    selectedDateRangeId,
    setSelectedDateRangeId,
  } = useDashboardData()
  const selectedDateRange =
    dateRanges.find((range) => range.id === selectedDateRangeId) ??
    dateRanges[0]
  const metrics = data?.metrics ?? dashboardMetricPlaceholders

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-role-page-title">Dashboard Overview</h1>
          <p className="mt-1 text-role-body-copy text-text-secondary">
            Monitor call performance, campaigns, and team activity.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-44">
            <span
              id="dashboard-date-range-label"
              className="mb-1.5 block text-role-helper font-semibold text-text-primary"
            >
              Date range
            </span>
            <Select
              value={selectedDateRangeId}
              onValueChange={setSelectedDateRangeId}
              aria-labelledby="dashboard-date-range-label"
            >
              <SelectTrigger>
                <SelectValue>{selectedDateRange.label}</SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                {dateRanges.map((range) => (
                  <SelectOption key={range.id} value={range.id}>
                    {range.label}
                  </SelectOption>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="accent"
            size="md"
            icon={Plus}
            onClick={() => navigate('/campaigns')}
          >
            New Campaign
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
        >
          Dashboard data could not be loaded. Please try another date
          range.
        </div>
      )}

      <section aria-labelledby="dashboard-kpis-title">
        <h2 id="dashboard-kpis-title" className="sr-only">
          Key performance indicators
        </h2>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metricIcons[metric.iconKey] ?? TrendingUp
            const status =
              !isLoading && metric.status ? (
                <Badge variant={metric.status.tone} size="small">
                  {metric.status.label}
                </Badge>
              ) : isLoading && metric.hasStatus ? (
                <span />
              ) : null
            const trend =
              !isLoading && metric.trend
                ? metric.trend
                : isLoading && metric.hasTrend
                  ? {}
                  : null

            return (
              <StatCard
                key={metric.id}
                label={metric.label}
                value={
                  !isLoading && 'value' in metric
                    ? formatMetricValue(metric)
                    : undefined
                }
                icon={<Icon />}
                tone={metric.tone}
                trend={trend}
                status={status}
                loading={isLoading}
              />
            )
          })}
        </div>
      </section>

      <section
        aria-label="Dashboard charts"
        className="grid min-w-0 gap-6 lg:grid-cols-2"
      >
        <div className="min-w-0">
          <CallsOverTimeChart
            chart={data?.callsOverTime}
            dateRangeLabel={selectedDateRange.label}
            timezone={data?.metadata.timezone ?? 'UTC'}
            loading={isLoading}
          />
        </div>
        <div className="min-w-0">
          <CampaignPerformanceChart
            chart={data?.campaignPerformance}
            dateRangeLabel={selectedDateRange.label}
            loading={isLoading}
          />
        </div>
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="min-w-0">
          <RecentCallsTable
            calls={data?.recentCalls ?? []}
            timezone={data?.metadata.timezone ?? 'UTC'}
            loading={isLoading}
          />
        </div>

        <div className="grid min-w-0 gap-6">
          <SystemAlertsCard
            alerts={data?.alerts ?? []}
            referenceTimestamp={data?.metadata.generatedAt}
            loading={isLoading}
          />
          <RecentActivityTimeline
            activity={data?.activity ?? []}
            referenceTimestamp={data?.metadata.generatedAt}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
