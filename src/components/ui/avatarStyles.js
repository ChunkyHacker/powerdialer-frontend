export const avatarSizeClasses = {
  xs: {
    root: 'size-6',
    text: 'text-[0.625rem] leading-none',
    presence: 'size-1.5',
    presencePosition: 'right-0 bottom-0',
    overlap: '-ml-1.5',
  },
  sm: {
    root: 'size-8',
    text: 'text-xs leading-4',
    presence: 'size-2',
    presencePosition: 'right-0 bottom-0',
    overlap: '-ml-2',
  },
  md: {
    root: 'size-10',
    text: 'text-sm leading-5',
    presence: 'size-2.5',
    presencePosition: 'right-0 bottom-0',
    overlap: '-ml-2.5',
  },
  lg: {
    root: 'size-12',
    text: 'text-base leading-6',
    presence: 'size-3',
    presencePosition: 'right-0 bottom-0',
    overlap: '-ml-3',
  },
  xl: {
    root: 'size-16',
    text: 'text-xl leading-7',
    presence: 'size-3.5',
    presencePosition: 'right-0.5 bottom-0.5',
    overlap: '-ml-4',
  },
}

export const avatarPresenceClasses = {
  online: 'bg-emerald-600',
  away: 'bg-amber-600',
  busy: 'bg-red-600',
  offline: 'bg-slate-500',
}

export const avatarBaseClasses =
  'relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full align-middle'

export const avatarClipClasses =
  'absolute inset-0 overflow-hidden rounded-full'

export const avatarFallbackClasses =
  'flex size-full items-center justify-center rounded-full bg-brand-secondary font-semibold text-surface-card select-none'

export const avatarImageClasses =
  'absolute inset-0 size-full rounded-full object-cover'

export const avatarPresenceBaseClasses =
  'absolute z-10 rounded-full ring-2 ring-surface-card'

export const avatarGroupedClasses = 'ring-2 ring-surface-card'

export const avatarGroupClasses =
  'isolate inline-flex flex-nowrap items-center align-middle'

export const avatarGroupItemClasses = 'relative shrink-0'

export const avatarOverflowClasses =
  'relative inline-flex shrink-0 items-center justify-center rounded-full bg-surface-page font-semibold tabular-nums whitespace-nowrap text-text-secondary'
