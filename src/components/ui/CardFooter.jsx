import { useCardCompact } from './CardContext.js'

function CardFooter({
  as: Component = 'div',
  ref,
  className = '',
  children,
  ...footerProps
}) {
  const compact = useCardCompact()

  return (
    <Component
      {...footerProps}
      ref={ref}
      className={[
        'flex flex-wrap items-center gap-3',
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

export default CardFooter
