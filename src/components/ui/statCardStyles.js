/**
 * Independent visual dimensions for metric cards and their trends.
 *
 * Trend sentiment communicates business direction separately from the overall
 * card tone, so a positive trend need not inherit the card's visual treatment.
 */
export const statCardToneClasses = {
  neutral: 'bg-slate-100 text-slate-700',
  accent: 'bg-brand-accent/15 text-brand-primary',
  info: 'bg-sky-100 text-sky-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-900',
  danger: 'bg-red-100 text-red-800',
  live: 'bg-teal-100 text-teal-900',
}

export const statCardTrendSentimentClasses = {
  positive: 'text-emerald-800',
  negative: 'text-red-800',
  neutral: 'text-text-secondary',
}
