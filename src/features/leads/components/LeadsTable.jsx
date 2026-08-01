import { MoreHorizontal } from 'lucide-react'
import Avatar from '../../../components/ui/Avatar.jsx'
import StatusBadge from '../../../components/ui/StatusBadge.jsx'
import Table from '../../../components/ui/Table.jsx'
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

const leadStatusMap = {
  new: { label: 'New', variant: 'info', dot: true },
  contacted: { label: 'Contacted', variant: 'neutral', dot: true },
  qualified: { label: 'Qualified', variant: 'success', dot: true },
  'follow-up': { label: 'Follow-up', variant: 'accent', dot: true },
  unresponsive: { label: 'Unresponsive', variant: 'warning', dot: true },
  'do-not-call': { label: 'Do not call', variant: 'danger', dot: true },
}

const leadPriorityMap = {
  low: { label: 'Low', variant: 'neutral', dot: true },
  medium: { label: 'Medium', variant: 'info', dot: true },
  high: { label: 'High', variant: 'warning', dot: true },
  urgent: { label: 'Urgent', variant: 'danger', dot: true },
}

function getColumns(agentMap) {
  return [
    {
      id: 'lead',
      header: 'Lead',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="break-words font-semibold leading-5 text-text-primary">
            {row.name}
          </p>
          <p
            title={row.jobTitle}
            className="mt-0.5 truncate text-role-helper text-text-secondary"
          >
            {row.jobTitle}
          </p>
        </div>
      ),
      className: 'w-[19%]',
    },
    {
      id: 'company',
      header: 'Company',
      accessorKey: 'company',
      cell: ({ value }) => <span className="break-words">{value}</span>,
      className: 'w-[14%]',
    },
    {
      id: 'phone',
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ row }) => (
        <div className="min-w-0">
          <a
            href={`tel:${row.phone.replace(/\s/g, '')}`}
            className="whitespace-nowrap font-semibold text-text-primary hover:text-brand-secondary hover:underline"
          >
            {row.phone}
          </a>
          <p
            title={`${row.timezone} · ${row.timezoneId}`}
            className="mt-0.5 truncate text-role-helper text-text-secondary"
          >
            {row.timezone}
          </p>
        </div>
      ),
      className: 'w-[18%]',
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <StatusBadge value={value} map={leadStatusMap} size="small" />
      ),
      nowrap: true,
      className: 'w-[12%]',
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      cell: ({ value }) => (
        <StatusBadge value={value} map={leadPriorityMap} size="small" />
      ),
      nowrap: true,
      className: 'w-[10%]',
    },
    {
      id: 'agent',
      header: 'Assigned agent',
      accessor: (row) => agentMap.get(row.assignedAgentId)?.name,
      cell: ({ row }) => {
        const agent = agentMap.get(row.assignedAgentId)

        return agent ? (
          <div className="flex min-w-0 items-center gap-2">
            <Avatar name={agent.name} size="sm" />
            <span className="min-w-0 truncate">{agent.name}</span>
          </div>
        ) : (
          <span className="text-role-helper text-text-secondary">
            Unassigned
          </span>
        )
      },
      className: 'w-[15%]',
    },
  ]
}

function LeadActions({
  lead,
  onViewDetails,
  onRequestDnc,
  onActionTrigger,
}) {
  const isOnDnc = lead.status === 'do-not-call'

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            variant="icon"
            size="sm"
            icon={MoreHorizontal}
            iconOnly
            aria-label={`Actions for ${lead.name}`}
            onClick={(event) => onActionTrigger(event.currentTarget)}
          />
        </TooltipTrigger>
        <TooltipContent>Lead actions</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onViewDetails(lead)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="danger"
          disabled={isOnDnc}
          onSelect={() => onRequestDnc(lead)}
        >
          {isOnDnc ? 'Already on DNC' : 'Add to DNC'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LeadsTable({
  leads,
  agents,
  selectedLeadIds,
  onSelectedLeadIdsChange,
  loading,
  emptyState,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onViewDetails,
  onRequestDnc,
  onActionTrigger,
}) {
  const agentMap = new Map(agents.map((agent) => [agent.id, agent]))

  return (
    <Table
      columns={getColumns(agentMap)}
      rows={leads}
      getRowId={(lead) => lead.id}
      selectedRowIds={selectedLeadIds}
      onSelectedRowIdsChange={onSelectedLeadIdsChange}
      getRowSelectionLabel={(lead) => `Select ${lead.name}`}
      selectAllLabel="Select all visible leads"
      className="table-fixed !min-w-[54rem] [&_:is(th,td)]:px-3"
      caption="PowerDialer leads"
      loading={loading}
      loadingRowCount={pageSize}
      loadingLabel="Loading leads"
      emptyState={emptyState}
      renderRowActions={({ row }) => (
        <LeadActions
          lead={row}
          onViewDetails={onViewDetails}
          onRequestDnc={onRequestDnc}
          onActionTrigger={onActionTrigger}
        />
      )}
      rowActionsLabel="Lead actions"
      pagination={{
        page,
        pageSize,
        totalItems,
        onPageChange,
        'aria-label': 'Lead table pagination',
      }}
    />
  )
}

export default LeadsTable
