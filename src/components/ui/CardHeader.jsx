import { useCardCompact } from './CardContext.js'

function CardHeader({
  as: Component = 'div',
  ref,
  className = '',
  children,
  ...headerProps
}) {
  const compact = useCardCompact()

  return (
    <Component
      {...headerProps}
      ref={ref}
      className={[
        'flex flex-wrap items-start justify-between',
        compact
          ? 'gap-3 px-4 py-2 first:pt-4 last:pb-4'
          : 'gap-4 px-6 py-3 first:pt-6 last:pb-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}

export default CardHeader
