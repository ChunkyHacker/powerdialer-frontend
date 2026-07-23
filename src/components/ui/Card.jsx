import { CardCompactProvider } from './CardContext.js'

const statusClasses = {
  danger: 'border-l-4 border-l-danger',
  accent: 'border-l-4 border-l-brand-accent',
}

function Card({
  as: Component = 'section',
  compact = false,
  interactive = false,
  status,
  shadow = false,
  ref,
  className = '',
  children,
  ...cardProps
}) {
  return (
    <CardCompactProvider value={compact}>
      <Component
        {...cardProps}
        ref={ref}
        className={[
          'overflow-hidden rounded-xl border border-border-default bg-surface-card text-text-primary',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
          interactive &&
            'transition-[border-color,box-shadow] hover:border-text-secondary focus-within:border-brand-accent focus-within:shadow-sm',
          statusClasses[status],
          shadow && 'shadow-sm',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </Component>
    </CardCompactProvider>
  )
}

export default Card
