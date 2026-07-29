export const dashboardDateRanges = [
  { id: 'today', label: 'Today' },
  { id: 'last-7-days', label: 'Last 7 days' },
  { id: 'last-30-days', label: 'Last 30 days' },
  { id: 'this-month', label: 'This month' },
]

export const mockDashboardData = {
  metadata: {
    generatedAt: '2026-07-30T09:30:00+08:00',
    timezone: 'Asia/Singapore',
    defaultDateRangeId: 'last-7-days',
  },
  metrics: [
    {
      id: 'metric-total-calls',
      label: 'Total Calls',
      value: 1248,
      displayFormat: 'integer',
      iconKey: 'phone',
      tone: 'accent',
      trend: {
        direction: 'up',
        sentiment: 'positive',
        value: '12.4%',
        context: 'from the previous period',
      },
    },
    {
      id: 'metric-connected-calls',
      label: 'Connected Calls',
      value: 842,
      displayFormat: 'integer',
      iconKey: 'phone-connected',
      tone: 'success',
      trend: {
        direction: 'up',
        sentiment: 'positive',
        value: '8.2%',
        context: 'from the previous period',
      },
    },
    {
      id: 'metric-contact-rate',
      label: 'Contact Rate',
      value: 67.5,
      displayFormat: 'percent',
      iconKey: 'target',
      tone: 'info',
      trend: {
        direction: 'up',
        sentiment: 'positive',
        value: '3.1%',
        context: 'from the previous period',
      },
    },
    {
      id: 'metric-appointments',
      label: 'Appointments',
      value: 126,
      displayFormat: 'integer',
      iconKey: 'calendar',
      tone: 'warning',
      trend: {
        direction: 'up',
        sentiment: 'positive',
        value: '16.7%',
        context: 'from the previous period',
      },
    },
    {
      id: 'metric-average-duration',
      label: 'Avg. Call Duration',
      value: 272,
      displayFormat: 'duration',
      iconKey: 'clock',
      tone: 'neutral',
      trend: {
        direction: 'up',
        sentiment: 'positive',
        value: '18 sec',
        context: 'from the previous period',
      },
    },
    {
      id: 'metric-active-campaigns',
      label: 'Active Campaigns',
      value: 8,
      displayFormat: 'integer',
      iconKey: 'campaign',
      tone: 'accent',
      status: {
        label: 'On track',
        tone: 'success',
      },
    },
    {
      id: 'metric-active-agents',
      label: 'Active Agents',
      value: 24,
      displayFormat: 'integer',
      iconKey: 'agents',
      tone: 'live',
      status: {
        label: '18 online',
        tone: 'live',
      },
    },
    {
      id: 'metric-conversion-rate',
      label: 'Conversion Rate',
      value: 15,
      displayFormat: 'percent',
      iconKey: 'conversion',
      tone: 'success',
      trend: {
        direction: 'down',
        sentiment: 'negative',
        value: '1.2%',
        context: 'from the previous period',
      },
    },
  ],
  callsOverTime: {
    series: [
      { id: 'total', label: 'Total calls', tone: 'accent' },
      { id: 'connected', label: 'Connected calls', tone: 'primary' },
    ],
    points: [
      {
        id: 'calls-2026-07-24',
        timestamp: '2026-07-24T12:00:00+08:00',
        values: { total: 142, connected: 91 },
      },
      {
        id: 'calls-2026-07-25',
        timestamp: '2026-07-25T12:00:00+08:00',
        values: { total: 168, connected: 109 },
      },
      {
        id: 'calls-2026-07-26',
        timestamp: '2026-07-26T12:00:00+08:00',
        values: { total: 151, connected: 102 },
      },
      {
        id: 'calls-2026-07-27',
        timestamp: '2026-07-27T12:00:00+08:00',
        values: { total: 196, connected: 128 },
      },
      {
        id: 'calls-2026-07-28',
        timestamp: '2026-07-28T12:00:00+08:00',
        values: { total: 179, connected: 121 },
      },
      {
        id: 'calls-2026-07-29',
        timestamp: '2026-07-29T12:00:00+08:00',
        values: { total: 221, connected: 154 },
      },
      {
        id: 'calls-2026-07-30',
        timestamp: '2026-07-30T12:00:00+08:00',
        values: { total: 191, connected: 137 },
      },
    ],
  },
  campaignPerformance: {
    series: [
      { id: 'attempts', label: 'Call attempts', tone: 'primary' },
      { id: 'connections', label: 'Connections', tone: 'accent' },
    ],
    campaigns: [
      {
        id: 'campaign-enterprise-q3',
        name: 'Enterprise Q3',
        attempts: 318,
        connections: 228,
        status: 'active',
      },
      {
        id: 'campaign-smb-growth',
        name: 'SMB Growth',
        attempts: 274,
        connections: 196,
        status: 'active',
      },
      {
        id: 'campaign-win-back',
        name: 'Customer Win-back',
        attempts: 231,
        connections: 143,
        status: 'active',
      },
      {
        id: 'campaign-renewals',
        name: 'Renewals',
        attempts: 186,
        connections: 126,
        status: 'paused',
      },
    ],
  },
  recentCalls: [
    {
      id: 'call-10482',
      contact: {
        id: 'contact-elena-rodriguez',
        name: 'Elena Rodriguez',
        phone: '+1 (415) 555-0142',
      },
      campaign: {
        id: 'campaign-enterprise-q3',
        name: 'Enterprise Q3',
      },
      agent: {
        id: 'agent-maya-chen',
        name: 'Maya Chen',
        avatarUrl: null,
      },
      status: 'connected',
      durationSeconds: 384,
      startedAt: '2026-07-30T09:18:00+08:00',
    },
    {
      id: 'call-10481',
      contact: {
        id: 'contact-james-wilson',
        name: 'James Wilson',
        phone: '+1 (212) 555-0188',
      },
      campaign: {
        id: 'campaign-smb-growth',
        name: 'SMB Growth',
      },
      agent: {
        id: 'agent-liam-patel',
        name: 'Liam Patel',
        avatarUrl: null,
      },
      status: 'voicemail',
      durationSeconds: 52,
      startedAt: '2026-07-30T09:11:00+08:00',
    },
    {
      id: 'call-10480',
      contact: {
        id: 'contact-sophia-kim',
        name: 'Sophia Kim',
        phone: '+1 (646) 555-0165',
      },
      campaign: {
        id: 'campaign-enterprise-q3',
        name: 'Enterprise Q3',
      },
      agent: {
        id: 'agent-noah-williams',
        name: 'Noah Williams',
        avatarUrl: null,
      },
      status: 'appointment',
      durationSeconds: 517,
      startedAt: '2026-07-30T08:56:00+08:00',
    },
    {
      id: 'call-10479',
      contact: {
        id: 'contact-ethan-brown',
        name: 'Ethan Brown',
        phone: '+1 (312) 555-0194',
      },
      campaign: {
        id: 'campaign-win-back',
        name: 'Customer Win-back',
      },
      agent: {
        id: 'agent-ava-martin',
        name: 'Ava Martin',
        avatarUrl: null,
      },
      status: 'no-answer',
      durationSeconds: 28,
      startedAt: '2026-07-30T08:42:00+08:00',
    },
    {
      id: 'call-10478',
      contact: {
        id: 'contact-olivia-davis',
        name: 'Olivia Davis',
        phone: '+1 (206) 555-0127',
      },
      campaign: {
        id: 'campaign-renewals',
        name: 'Renewals',
      },
      agent: {
        id: 'agent-maya-chen',
        name: 'Maya Chen',
        avatarUrl: null,
      },
      status: 'connected',
      durationSeconds: 243,
      startedAt: '2026-07-30T08:35:00+08:00',
    },
  ],
  alerts: [
    {
      id: 'alert-carrier-latency',
      severity: 'warning',
      title: 'Elevated carrier latency',
      description: 'Outbound connections are taking longer than usual.',
      createdAt: '2026-07-30T09:04:00+08:00',
    },
    {
      id: 'alert-agent-capacity',
      severity: 'info',
      title: 'Agent capacity nearing limit',
      description: 'The Enterprise Q3 campaign is using 88% of assigned agents.',
      createdAt: '2026-07-30T08:22:00+08:00',
    },
    {
      id: 'alert-dnc-sync',
      severity: 'danger',
      title: 'DNC sync needs attention',
      description: 'One imported suppression list could not be fully processed.',
      createdAt: '2026-07-30T07:46:00+08:00',
    },
  ],
  activity: [
    {
      id: 'activity-campaign-started',
      type: 'campaign-started',
      actor: {
        id: 'agent-maya-chen',
        name: 'Maya Chen',
        avatarUrl: null,
      },
      description: 'started the Enterprise Q3 campaign.',
      occurredAt: '2026-07-30T09:16:00+08:00',
    },
    {
      id: 'activity-appointment-booked',
      type: 'appointment-booked',
      actor: {
        id: 'agent-noah-williams',
        name: 'Noah Williams',
        avatarUrl: null,
      },
      description: 'booked an appointment with Sophia Kim.',
      occurredAt: '2026-07-30T08:58:00+08:00',
    },
    {
      id: 'activity-list-imported',
      type: 'list-imported',
      actor: {
        id: 'agent-ava-martin',
        name: 'Ava Martin',
        avatarUrl: null,
      },
      description: 'imported 240 leads into Customer Win-back.',
      occurredAt: '2026-07-30T08:06:00+08:00',
    },
    {
      id: 'activity-campaign-paused',
      type: 'campaign-paused',
      actor: {
        id: 'agent-liam-patel',
        name: 'Liam Patel',
        avatarUrl: null,
      },
      description: 'paused the Renewals campaign.',
      occurredAt: '2026-07-30T07:31:00+08:00',
    },
  ],
}

export const dashboardMetricPlaceholders = mockDashboardData.metrics.map(
  ({ id, iconKey, label, status, trend }) => ({
    id,
    iconKey,
    label,
    hasStatus: Boolean(status),
    hasTrend: Boolean(trend),
  }),
)
