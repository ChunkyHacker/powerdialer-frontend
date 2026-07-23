function CardDescription({
  as: Component = 'p',
  ref,
  className = '',
  children,
  ...descriptionProps
}) {
  return (
    <Component
      {...descriptionProps}
      ref={ref}
      className={[
        'text-role-helper mt-1 text-text-secondary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  )
}

export default CardDescription
