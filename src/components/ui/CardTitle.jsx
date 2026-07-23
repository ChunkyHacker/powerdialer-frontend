function CardTitle({
  as: Component = 'h2',
  ref,
  className = '',
  children,
  ...titleProps
}) {
  return (
    <Component
      {...titleProps}
      ref={ref}
      className={[
        'text-role-section-title min-w-0 text-text-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}

export default CardTitle
