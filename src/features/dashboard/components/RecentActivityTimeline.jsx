import Avatar from '../../../components/ui/Avatar.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardDescription from '../../../components/ui/CardDescription.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import SkeletonAvatar from '../../../components/ui/SkeletonAvatar.jsx'
import SkeletonText from '../../../components/ui/SkeletonText.jsx'

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

function ActivitySkeleton() {
  return (
    <CardContent className="space-y-5" aria-hidden="true">
      {[1, 2, 3, 4].map((placeholderId) => (
        <div key={placeholderId} className="flex items-start gap-3">
          <SkeletonAvatar size="sm" />
          <SkeletonText
            lines={2}
            lineWidths={['92%', '35%']}
            className="min-w-0 flex-1 pt-1"
          />
        </div>
      ))}
    </CardContent>
  )
}

function RecentActivityTimeline({
  activity = [],
  referenceTimestamp,
  loading = false,
}) {
  return (
    <Card aria-labelledby="recent-activity-title" className="h-full">
      <CardHeader>
        <div>
          <CardTitle id="recent-activity-title">
            Recent Activity
          </CardTitle>
          <CardDescription>
            Updates from your team and campaigns.
          </CardDescription>
        </div>
      </CardHeader>

      {loading ? (
        <ActivitySkeleton />
      ) : activity.length === 0 ? (
        <CardContent>
          <p
            role="status"
            className="rounded-lg bg-surface-page px-4 py-5 text-role-helper text-text-secondary"
          >
            No recent activity for this date range.
          </p>
        </CardContent>
      ) : (
        <CardContent>
          <ol className="space-y-0">
            {activity.map((event, index) => (
              <li
                key={event.id}
                className="relative flex items-start gap-3 pb-5 last:pb-0"
              >
                {index < activity.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-8 bottom-0 left-4 w-px bg-border-default"
                  />
                )}
                <Avatar
                  src={event.actor.avatarUrl}
                  name={event.actor.name}
                  size="sm"
                  className="relative z-[1]"
                />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-role-helper text-text-primary">
                    <span className="font-semibold">
                      {event.actor.name}
                    </span>{' '}
                    {event.description}
                  </p>
                  <time
                    dateTime={event.occurredAt}
                    className="mt-1 block text-role-helper tabular-nums text-text-secondary"
                  >
                    {formatRelativeTime(
                      event.occurredAt,
                      referenceTimestamp,
                    )}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      )}
    </Card>
  )
}

export default RecentActivityTimeline
