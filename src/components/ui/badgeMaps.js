export const campaignStatusMap = {
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
}

export const callDispositionMap = {
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
}

export const leadStatusMap = {
  new: {
    label: 'New',
    variant: 'info',
  },
  contacted: {
    label: 'Contacted',
    variant: 'neutral',
  },
}

export const priorityMap = {
  high: {
    label: 'High',
    variant: 'warning',
  },
  urgent: {
    label: 'Urgent',
    variant: 'danger',
  },
}

export const liveStatusMap = {
  live: {
    label: 'Live',
    variant: 'live',
    dot: true,
  },
  'on-call': {
    label: 'On Call',
    variant: 'live',
    dot: true,
  },
}
