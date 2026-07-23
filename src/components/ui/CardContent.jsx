import { useCardCompact } from './CardContext.js'

function CardContent({
  as: Component = 'div',
  ref,
  className = '',
  children,
  ...contentProps
}) {
  const compact = useCardCompact()

  return (
    <Component
      {...contentProps}
      ref={ref}
      className={[
        compact
          ? 'px-4 py-2 first:pt-4 last:pb-4'
          : 'px-6 py-3 first:pt-6 last:pb-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}

export default CardContent
