import { Pencil } from 'lucide-react'
import Avatar from '../../../components/ui/Avatar.jsx'
import AvatarGroup from '../../../components/ui/AvatarGroup.jsx'
import Button from '../../../components/ui/Button.jsx'
import StatusBadge from '../../../components/ui/StatusBadge.jsx'
import Table from '../../../components/ui/Table.jsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/Tooltip.jsx'

const campaignStatusMap = {
  active: {
    label: 'Active',
    variant: 'success',
    dot: true,
  },
  paused: {
    label: 'Paused',
    variant: 'warning',
    dot: true,
  },
  draft: {
    label: 'Draft',
    variant: 'neutral',
    dot: true,
  },
  completed: {
    label: 'Completed',
    variant: 'info',
    dot: true,
  },
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

function getAssignedAgentLabel(assignedAgents) {
  if (assignedAgents.length === 0) {
    return 'No assigned agents'
  }

  const visibleNames = assignedAgents
    .slice(0, 3)
    .map((agent) => agent.name)
  const remainingCount = assignedAgents.length - visibleNames.length

  return `Assigned agents: ${visibleNames.join(', ')}${
    remainingCount > 0 ? `, and ${remainingCount} more` : ''
  }`
}

function getColumns({ ownerMap, agentMap }) {
  return [
    {
      id: 'campaign',
      header: 'Campaign',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="break-words font-semibold leading-5 text-text-primary">
            {row.name}
          </p>
          <p
            title={row.id}
            className="mt-0.5 truncate text-role-helper text-text-secondary"
          >
            {row.id}
          </p>
        </div>
      ),
      className: 'w-44',
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <StatusBadge
          value={value}
          map={campaignStatusMap}
          size="small"
        />
      ),
      nowrap: true,
      className: 'w-24',
    },
    {
      id: 'owner',
      header: 'Owner',
      accessor: (row) => ownerMap.get(row.ownerId)?.name ?? 'Unassigned',
      className: 'w-28',
    },
    {
      id: 'agents',
      header: 'Assigned agents',
      accessor: (row) => row.assignedAgentIds.length,
      cell: ({ row }) => {
        const assignedAgents = row.assignedAgentIds
          .map((agentId) => agentMap.get(agentId))
          .filter(Boolean)

        return assignedAgents.length > 0 ? (
          <AvatarGroup
            size="sm"
            max={4}
            aria-label={getAssignedAgentLabel(assignedAgents)}
          >
            {assignedAgents.map((agent) => (
              <Avatar
                key={agent.id}
                src={agent.avatarUrl}
                name={agent.name}
              />
            ))}
          </AvatarGroup>
        ) : (
          <span className="text-role-helper text-text-secondary">
            Unassigned
          </span>
        )
      },
      nowrap: true,
      className: 'w-32',
    },
    {
      id: 'progress',
      header: 'Lead progress',
      accessor: (row) => row.contactedCount,
      cell: ({ row }) => {
        const progress =
          row.leadCount > 0
            ? Math.round((row.contactedCount / row.leadCount) * 100)
            : 0

        return (
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 text-role-helper">
              <span className="whitespace-nowrap tabular-nums text-text-primary">
                {row.contactedCount.toLocaleString('en-US')} /{' '}
                {row.leadCount.toLocaleString('en-US')}
              </span>
              <span className="whitespace-nowrap tabular-nums text-text-secondary">
                {progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${row.name} lead progress`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progress}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-border-default"
            >
              <span
                className="block h-full rounded-full bg-brand-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )
      },
      className: 'w-36',
    },
    {
      id: 'schedule',
      header: 'Schedule',
      accessorKey: 'startDate',
      cell: ({ row }) => (
        <div className="text-role-helper">
          <time dateTime={row.startDate} className="block whitespace-nowrap">
            {formatDate(row.startDate)}
          </time>
          <time
            dateTime={row.endDate}
            className="mt-0.5 block whitespace-nowrap text-text-secondary"
          >
            to {formatDate(row.endDate)}
          </time>
        </div>
      ),
      className: 'w-36',
    },
  ]
}

function CampaignsTable({
  campaigns,
  owners,
  agents,
  loading,
  emptyState,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onEdit,
}) {
  const ownerMap = new Map(owners.map((owner) => [owner.id, owner]))
  const agentMap = new Map(agents.map((agent) => [agent.id, agent]))

  return (
    <Table
      columns={getColumns({ ownerMap, agentMap })}
      rows={campaigns}
      getRowId={(campaign) => campaign.id}
      className="table-fixed [&_:is(th,td)]:px-3"
      caption="Outbound campaigns"
      loading={loading}
      loadingRowCount={pageSize}
      loadingLabel="Loading campaigns"
      emptyState={emptyState}
      renderRowActions={({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="icon"
              size="sm"
              icon={Pencil}
              iconOnly
              aria-label={`Edit ${row.name}`}
              onClick={() => onEdit(row)}
            />
          </TooltipTrigger>
          <TooltipContent>Edit campaign</TooltipContent>
        </Tooltip>
      )}
      rowActionsLabel="Campaign actions"
      pagination={{
        page,
        pageSize,
        totalItems,
        onPageChange,
        'aria-label': 'Campaign table pagination',
      }}
    />
  )
}

export default CampaignsTable
