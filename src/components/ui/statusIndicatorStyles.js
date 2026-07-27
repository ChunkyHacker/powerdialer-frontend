export const statusIndicatorBaseClasses =
  'inline-flex items-center whitespace-nowrap'

export const statusIndicatorToneClasses = {
  neutral: {
    text: 'text-slate-700',
    dot: 'bg-slate-500',
  },
  success: {
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  warning: {
    text: 'text-amber-900',
    dot: 'bg-amber-600',
  },
  danger: {
    text: 'text-red-800',
    dot: 'bg-red-600',
  },
  info: {
    text: 'text-sky-800',
    dot: 'bg-sky-600',
  },
  accent: {
    text: 'text-brand-primary',
    dot: 'bg-brand-accent-hover',
  },
  live: {
    text: 'text-teal-900',
    dot: 'bg-teal-600',
  },
}

export const statusIndicatorSizeClasses = {
  default: {
    root: 'gap-1.5 text-role-navigation',
    dot: 'size-2',
    icon: 'size-4 [&>svg]:size-4',
  },
  compact: {
    root: 'gap-1 text-xs leading-4',
    dot: 'size-1.5',
    icon: 'size-3.5 [&>svg]:size-3.5',
  },
}

export const statusIndicatorMarkerClasses = {
  dot: 'shrink-0 rounded-full',
  icon:
    'flex shrink-0 items-center justify-center [&>svg]:shrink-0',
}

export const statusIndicatorPulseClasses =
  'animate-pulse motion-reduce:animate-none'
