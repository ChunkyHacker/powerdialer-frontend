import {
  CalendarClock,
  MoreHorizontal,
  PhoneCall,
} from 'lucide-react'
import Avatar from '../../../components/ui/Avatar.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import Button from '../../../components/ui/Button.jsx'
import Card from '../../../components/ui/Card.jsx'
import CardContent from '../../../components/ui/CardContent.jsx'
import CardFooter from '../../../components/ui/CardFooter.jsx'
import CardHeader from '../../../components/ui/CardHeader.jsx'
import CardTitle from '../../../components/ui/CardTitle.jsx'
import StatusBadge from '../../../components/ui/StatusBadge.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/DropdownMenu.jsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/Tooltip.jsx'
import { formatCallbackSchedule } from '../utils/callbackGrouping.js'

const groupStatusMap = {
  overdue: { label: 'Overdue', variant: 'danger', dot: true },
  'due-today': { label: 'Due Today', variant: 'accent', dot: true },
  completed: { label: 'Completed', variant: 'success', dot: true },
}

function CallbackCard({
  callback,
  agent,
  group,
  pendingAction,
  onCallNow,
  onReschedule,
  onViewDetails,
  onComplete,
}) {
  const isCompleted = callback.status === 'completed'
  const isPending = Boolean(pendingAction)
  const schedule = formatCallbackSchedule(callback.scheduledAt)

  return (
    <Card
      as="article"
      compact
      shadow
      status={group === 'overdue' ? 'danger' : undefined}
      aria-busy={isPending || undefined}
      className="min-w-0"
    >
      <CardHeader className="gap-2">
        <div className="min-w-0 flex-1">
          <CardTitle as="h4" className="break-words">
            {callback.contactName}
          </CardTitle>
          <p className="mt-0.5 break-words text-role-helper text-text-secondary">
            {callback.company}
          </p>
        </div>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger
                variant="icon"
                size="sm"
                icon={MoreHorizontal}
                iconOnly
                disabled={isPending}
                aria-label={`More actions for ${callback.contactName}`}
              />
            </TooltipTrigger>
            <TooltipContent>Callback actions</TooltipContent>
          </Tooltip>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onViewDetails(callback)}>
              View Details
            </DropdownMenuItem>
            {!isCompleted && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isPending}
                  onSelect={() => onComplete(callback)}
                >
                  {pendingAction === 'complete'
                    ? 'Marking completed…'
                    : 'Mark Completed'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={group} map={groupStatusMap} size="small" />
          {callback.priority === 'high' && (
            <Badge variant="warning" size="small">
              High priority
            </Badge>
          )}
        </div>

        <dl className="space-y-2 text-role-helper">
          <div>
            <dt className="font-semibold text-text-primary">Scheduled</dt>
            <dd className="mt-0.5 break-words text-text-secondary">
              {schedule.date} at {schedule.time}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">Lead timezone</dt>
            <dd className="mt-0.5 break-words text-text-secondary">
              {callback.timeZoneLabel}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">Phone</dt>
            <dd className="mt-0.5 break-words text-text-secondary">
              {callback.phone}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">Reason</dt>
            <dd className="mt-0.5 break-words text-text-secondary">
              {callback.reason}
            </dd>
          </div>
          {isCompleted && (
            <div>
              <dt className="font-semibold text-text-primary">Outcome</dt>
              <dd className="mt-0.5 break-words text-text-secondary">
                {callback.outcome}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex min-w-0 items-center gap-2 border-t border-border-default pt-3">
          <Avatar
            name={agent?.name ?? 'Unassigned agent'}
            src={agent?.avatarUrl}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-role-helper text-text-secondary">Assigned agent</p>
            <p className="truncate text-role-navigation text-text-primary">
              {agent?.name ?? 'Unassigned'}
            </p>
          </div>
        </div>
      </CardContent>

      {!isCompleted && (
        <CardFooter className="border-t border-border-default">
          <Button
            variant="accent"
            size="sm"
            icon={PhoneCall}
            disabled={isPending}
            onClick={() => onCallNow(callback)}
          >
            Call Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CalendarClock}
            isLoading={pendingAction === 'reschedule'}
            disabled={isPending}
            onClick={() => onReschedule(callback)}
          >
            Reschedule
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default CallbackCard
