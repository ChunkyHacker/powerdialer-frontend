import { MoreHorizontal } from 'lucide-react'
import StatusBadge from '../../../components/ui/StatusBadge.jsx'
import Table from '../../../components/ui/Table.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/DropdownMenu.jsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/Tooltip.jsx'

const leadListStatusMap = {
  processing: {
    label: 'Processing',
    variant: 'info',
    dot: true,
  },
  validating: {
    label: 'Validating',
    variant: 'accent',
    dot: true,
  },
  completed: {
    label: 'Completed',
    variant: 'success',
    dot: true,
  },
  'completed-with-errors': {
    label: 'Completed with errors',
    variant: 'warning',
    dot: true,
  },
  failed: {
    label: 'Failed',
    variant: 'danger',
    dot: true,
  },
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatNumber(value) {
  return value.toLocaleString('en-US')
}

function ValidationCounts({ leadList }) {
  const countsAvailable =
    leadList.validRows !== null &&
    leadList.validRows !== undefined &&
    leadList.invalidRows !== null &&
    leadList.invalidRows !== undefined

  if (!countsAvailable) {
    return (
      <p className="mt-0.5 text-role-helper text-text-secondary">
        {leadList.status === 'failed'
          ? 'Validation unavailable'
          : 'Validation pending'}
      </p>
    )
  }

  return (
    <p className="mt-0.5 text-role-helper text-text-secondary">
      <span className="whitespace-nowrap">
        {formatNumber(leadList.validRows)} valid
      </span>
      <span aria-hidden="true"> · </span>
      <span className="whitespace-nowrap">
        {formatNumber(leadList.invalidRows)} invalid
      </span>
      {leadList.duplicateRows > 0 && (
        <>
          <span aria-hidden="true"> · </span>
          <span className="whitespace-nowrap">
            {formatNumber(leadList.duplicateRows)} duplicates
          </span>
        </>
      )}
    </p>
  )
}

const columns = [
  {
    id: 'leadList',
    header: 'Lead List',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="break-words font-semibold leading-5 text-text-primary">
          {row.name}
        </p>
        <p
          title={row.fileName}
          className="mt-0.5 max-w-64 truncate text-role-helper text-text-secondary"
        >
          {row.fileName}
        </p>
      </div>
    ),
    className: 'w-[25%]',
  },
  {
    id: 'source',
    header: 'Source',
    accessorKey: 'source',
    cell: ({ value }) => (
      <span className="break-words">{value}</span>
    ),
    className: 'w-[12%]',
  },
  {
    id: 'rows',
    header: 'Rows',
    accessorKey: 'totalRows',
    cell: ({ row }) => (
      <div className="min-w-0 tabular-nums">
        <p className="font-semibold text-text-primary">
          {formatNumber(row.totalRows)} total
        </p>
        <ValidationCounts leadList={row} />
      </div>
    ),
    className: 'w-[23%]',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row, value }) => (
      <div>
        <StatusBadge
          value={value}
          map={leadListStatusMap}
          size="small"
        />
        {typeof row.progress === 'number' && (
          <p className="mt-1 text-role-helper tabular-nums text-text-secondary">
            {row.progress}% complete
          </p>
        )}
      </div>
    ),
    nowrap: true,
    className: 'w-[18%]',
  },
  {
    id: 'created',
    header: 'Created',
    accessorKey: 'createdAt',
    cell: ({ value }) => (
      <time dateTime={value} className="whitespace-nowrap tabular-nums">
        {dateFormatter.format(new Date(value))}
      </time>
    ),
    nowrap: true,
    className: 'w-[12%]',
  },
]

function LeadListActions({
  leadList,
  onViewDetails,
  onRetry,
  onViewValidationIssues,
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            variant="icon"
            size="sm"
            icon={MoreHorizontal}
            iconOnly
            aria-label={`Actions for ${leadList.name}`}
          />
        </TooltipTrigger>
        <TooltipContent>Lead list actions</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onViewDetails(leadList)}>
          View details
        </DropdownMenuItem>
        {leadList.status === 'failed' && (
          <DropdownMenuItem onSelect={() => onRetry(leadList)}>
            Retry import
          </DropdownMenuItem>
        )}
        {leadList.status === 'completed-with-errors' && (
          <DropdownMenuItem
            onSelect={() => onViewValidationIssues(leadList)}
          >
            View validation issues
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LeadListsTable({
  leadLists,
  loading,
  emptyState,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onViewDetails,
  onRetry,
  onViewValidationIssues,
}) {
  return (
    <Table
      columns={columns}
      rows={leadLists}
      getRowId={(leadList) => leadList.id}
      className="table-fixed [&_:is(th,td)]:px-3"
      caption="Imported lead lists"
      loading={loading}
      loadingRowCount={pageSize}
      loadingLabel="Loading lead lists"
      emptyState={emptyState}
      renderRowActions={({ row }) => (
        <LeadListActions
          leadList={row}
          onViewDetails={onViewDetails}
          onRetry={onRetry}
          onViewValidationIssues={onViewValidationIssues}
        />
      )}
      rowActionsLabel="Lead list actions"
      pagination={{
        page,
        pageSize,
        totalItems,
        onPageChange,
        'aria-label': 'Lead list table pagination',
      }}
    />
  )
}

export default LeadListsTable
