import Badge from '../../../components/ui/Badge.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardDescription from '../../../components/ui/CardDescription.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import Skeleton from '../../../components/ui/Skeleton.jsx'
import SkeletonText from '../../../components/ui/SkeletonText.jsx'
import StatusIndicator from '../../../components/ui/StatusIndicator.jsx'

const severityConfig = {
  danger: {
    label: 'Critical',
    variant: 'danger',
  },
  warning: {
    label: 'Warning',
    variant: 'warning',
  },
  info: {
    label: 'Info',
    variant: 'info',
  },
}

function formatRelativeTime(timestamp, referenceTimestamp) {
  const elapsedMinutes = Math.max(
    0,
    Math.round(
      (new Date(referenceTimestamp).getTime() -
        new Date(timestamp).getTime()) /
        60000,
    ),
  )

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`
  }

  const hours = Math.floor(elapsedMinutes / 60)
  return `${hours}h ago`
}

function AlertsSkeleton() {
  return (
    <CardContent className="space-y-4" aria-hidden="true">
      {[1, 2, 3].map((placeholderId) => (
        <div
          key={placeholderId}
          className="flex items-start gap-3 border-b border-border-default pb-4 last:border-b-0 last:pb-0"
        >
          <Skeleton
            width="4.5rem"
            height="1.25rem"
            radius="full"
          />
          <SkeletonText
            lines={2}
            lineWidths={['85%', '100%']}
            className="min-w-0 flex-1"
          />
        </div>
      ))}
    </CardContent>
  )
}

function SystemAlertsCard({
  alerts = [],
  referenceTimestamp,
  loading = false,
}) {
  return (
    <Card aria-labelledby="system-alerts-title" className="h-full">
      <CardHeader>
        <div>
          <CardTitle id="system-alerts-title">System Alerts</CardTitle>
          <CardDescription>
            Operational items that may need attention.
          </CardDescription>
        </div>
        {!loading && alerts.length > 0 && (
          <Badge variant="warning" size="small">
            {alerts.length} active
          </Badge>
        )}
      </CardHeader>

      {loading ? (
        <AlertsSkeleton />
      ) : alerts.length === 0 ? (
        <CardContent>
          <div
            role="status"
            className="rounded-lg bg-surface-page px-4 py-5"
          >
            <StatusIndicator
              label="No system alerts"
              tone="success"
            />
            <p className="mt-2 text-role-helper text-text-secondary">
              All systems are operating normally.
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <ul className="divide-y divide-border-default">
            {alerts.map((alert) => {
              const severity =
                severityConfig[alert.severity] ?? severityConfig.info

              return (
                <li key={alert.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant={severity.variant} size="small">
                      {severity.label}
                    </Badge>
                    <time
                      dateTime={alert.createdAt}
                      className="text-role-helper tabular-nums text-text-secondary"
                    >
                      {formatRelativeTime(
                        alert.createdAt,
                        referenceTimestamp,
                      )}
                    </time>
                  </div>
                  <p className="mt-2 font-semibold text-text-primary">
                    {alert.title}
                  </p>
                  <p className="mt-1 text-role-helper text-text-secondary">
                    {alert.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </CardContent>
      )}
    </Card>
  )
}

export default SystemAlertsCard
