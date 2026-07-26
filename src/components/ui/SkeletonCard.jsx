function SkeletonCard({
  as: Component = 'div',
  compact = false,
  className = '',
  children,
  ref,
  ...cardProps
}) {
  return (
    <Component
      {...cardProps}
      ref={ref}
      className={[
        'overflow-hidden rounded-xl border border-border-default bg-surface-card',
        compact ? 'p-4' : 'p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}

export default SkeletonCard
