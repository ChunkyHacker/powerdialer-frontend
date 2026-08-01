import {
  CALLBACK_DISPLAY_TIME_ZONE,
  CALLBACK_REFERENCE_DATE,
  CALLBACK_REFERENCE_NOW,
} from '../data/mockCallbackData.js'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: CALLBACK_DISPLAY_TIME_ZONE,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: CALLBACK_DISPLAY_TIME_ZONE,
  timeZoneName: 'short',
})

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: CALLBACK_DISPLAY_TIME_ZONE,
})

export const CALLBACK_REFERENCE_TIME = CALLBACK_REFERENCE_NOW.slice(11, 16)

function toTimestamp(value) {
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : Number.POSITIVE_INFINITY
}

function getDateKey(value) {
  const parts = dateKeyFormatter.formatToParts(new Date(value))
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  )
  return `${values.year}-${values.month}-${values.day}`
}

export function groupCallbacks(callbacks) {
  const groups = {
    overdue: [],
    dueToday: [],
    completed: [],
    upcoming: [],
  }
  const referenceTimestamp = toTimestamp(CALLBACK_REFERENCE_NOW)

  callbacks.forEach((callback) => {
    if (callback.status === 'completed') {
      groups.completed.push(callback)
      return
    }

    const scheduledTimestamp = toTimestamp(callback.scheduledAt)
    if (scheduledTimestamp < referenceTimestamp) {
      groups.overdue.push(callback)
    } else if (getDateKey(callback.scheduledAt) === CALLBACK_REFERENCE_DATE) {
      groups.dueToday.push(callback)
    } else {
      groups.upcoming.push(callback)
    }
  })

  groups.overdue.sort(
    (first, second) =>
      toTimestamp(first.scheduledAt) - toTimestamp(second.scheduledAt),
  )
  groups.dueToday.sort(
    (first, second) =>
      toTimestamp(first.scheduledAt) - toTimestamp(second.scheduledAt),
  )
  groups.completed.sort(
    (first, second) =>
      toTimestamp(second.completedAt) - toTimestamp(first.completedAt),
  )
  groups.upcoming.sort(
    (first, second) =>
      toTimestamp(first.scheduledAt) - toTimestamp(second.scheduledAt),
  )

  return groups
}

export function getCallbackCounts(groups) {
  return {
    overdue: groups.overdue.length,
    dueToday: groups.dueToday.length,
    completed: groups.completed.length,
    upcoming: groups.upcoming.length,
  }
}

export function formatCallbackSchedule(value) {
  const date = new Date(value)
  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  }
}

export function getScheduleInputValues(value) {
  return {
    date: getDateKey(value),
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: CALLBACK_DISPLAY_TIME_ZONE,
    }).format(new Date(value)),
  }
}

export function createManilaScheduledAt(date, time) {
  return `${date}T${time}:00+08:00`
}

export function validateCallbackSchedule(date, time) {
  const errors = { date: '', time: '' }

  if (!date) {
    errors.date = 'Choose a callback date.'
  }
  if (!time) {
    errors.time = 'Choose a callback time.'
  }
  if (errors.date || errors.time) {
    return errors
  }

  if (date < CALLBACK_REFERENCE_DATE) {
    errors.date = `Choose ${CALLBACK_REFERENCE_DATE} or a later date.`
  } else if (
    toTimestamp(createManilaScheduledAt(date, time)) <
    toTimestamp(CALLBACK_REFERENCE_NOW)
  ) {
    errors.time = `Choose ${CALLBACK_REFERENCE_TIME} or later for the reference date.`
  }

  return errors
}

export function hasScheduleErrors(errors) {
  return Boolean(errors.date || errors.time)
}
