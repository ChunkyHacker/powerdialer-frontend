export const badgeVariantClasses = {
  neutral: {
    badge: 'border-slate-200 bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
  },
  success: {
    badge: 'border-emerald-200 bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-600',
  },
  warning: {
    badge: 'border-amber-200 bg-amber-100 text-amber-900',
    dot: 'bg-amber-600',
  },
  danger: {
    badge: 'border-red-200 bg-red-100 text-red-800',
    dot: 'bg-red-600',
  },
  info: {
    badge: 'border-sky-200 bg-sky-100 text-sky-800',
    dot: 'bg-sky-600',
  },
  accent: {
    badge:
      'border-brand-accent/40 bg-brand-accent/15 text-brand-primary',
    dot: 'bg-brand-accent-hover',
  },
  live: {
    badge: 'border-teal-200 bg-teal-100 text-teal-900',
    dot: 'bg-teal-600',
  },
}

export const badgeSizeClasses = {
  small: {
    badge: 'min-h-5 gap-1 px-2 py-0.5 text-xs leading-4',
    dot: 'size-1.5',
    icon: '[&>svg]:size-3',
  },
  standard: {
    badge: 'min-h-6 gap-1.5 px-2.5 py-0.5 text-role-navigation',
    dot: 'size-2',
    icon: '[&>svg]:size-4',
  },
}

export const badgeDotPositionClasses = {
  start: 'order-first',
  end: 'order-last',
}

export const badgeIconClasses =
  'flex shrink-0 items-center justify-center [&>svg]:shrink-0'
