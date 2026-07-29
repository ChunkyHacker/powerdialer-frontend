import Avatar from '../../../components/ui/Avatar.jsx'
import StatusBadge from '../../../components/ui/StatusBadge.jsx'
import Table from '../../../components/ui/Table.jsx'

const callStatusMap = {
  connected: {
    label: 'Connected',
    variant: 'success',
  },
  appointment: {
    label: 'Appointment',
    variant: 'accent',
  },
  voicemail: {
    label: 'Voicemail',
    variant: 'neutral',
  },
  'no-answer': {
    label: 'No answer',
    variant: 'warning',
  },
  failed: {
    label: 'Failed',
    variant: 'danger',
  },
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatTimestamp(timestamp, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(timestamp))
}

function getColumns(timezone) {
  return [
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row) => row.contact.name,
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-text-primary">
            {row.contact.name}
          </p>
          <p className="mt-0.5 text-role-helper text-text-secondary">
            {row.contact.phone}
          </p>
        </div>
      ),
    },
    {
      id: 'campaign',
      header: 'Campaign',
      accessor: (row) => row.campaign.name,
      nowrap: true,
    },
    {
      id: 'agent',
      header: 'Agent',
      accessor: (row) => row.agent.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={row.agent.avatarUrl}
            name={row.agent.name}
            size="sm"
          />
          <span className="whitespace-nowrap">{row.agent.name}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <StatusBadge
          value={value}
          map={callStatusMap}
          size="small"
        />
      ),
      nowrap: true,
    },
    {
      id: 'duration',
      header: 'Duration',
      accessorKey: 'durationSeconds',
      cell: ({ value }) => (
        <span className="tabular-nums">{formatDuration(value)}</span>
      ),
      align: 'end',
      nowrap: true,
    },
    {
      id: 'startedAt',
      header: 'Time',
      accessorKey: 'startedAt',
      cell: ({ value }) => (
        <time dateTime={value} className="tabular-nums">
          {formatTimestamp(value, timezone)}
        </time>
      ),
      align: 'end',
      nowrap: true,
    },
  ]
}

function RecentCallsTable({
  calls = [],
  timezone = 'UTC',
  loading = false,
}) {
  return (
    <section aria-labelledby="recent-calls-title" className="min-w-0">
      <div className="mb-4">
        <h2
          id="recent-calls-title"
          className="text-role-section-title text-text-primary"
        >
          Recent Calls
        </h2>
        <p className="mt-1 text-role-helper text-text-secondary">
          The latest conversations across active campaigns.
        </p>
      </div>

      <Table
        columns={getColumns(timezone)}
        rows={calls}
        getRowId={(row) => row.id}
        loading={loading}
        loadingRowCount={5}
        loadingLabel="Loading recent calls"
        emptyState="No calls were recorded for this date range."
        caption="Recent calls for the selected date range"
      />
    </section>
  )
}

export default RecentCallsTable
