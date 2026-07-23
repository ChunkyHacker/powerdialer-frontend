const variantClasses = {
  primary:
    'bg-brand-primary text-surface-card hover:bg-brand-secondary',
  accent:
    'bg-brand-accent text-brand-primary hover:bg-brand-accent-hover',
  secondary:
    'bg-surface-card text-text-primary shadow-sm hover:bg-surface-page',
  outline:
    'border border-border-default bg-transparent text-text-primary hover:border-text-secondary hover:bg-surface-page',
  danger:
    'bg-danger text-surface-card hover:opacity-90',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-page hover:text-text-primary',
  icon:
    'bg-transparent text-text-secondary hover:bg-surface-page hover:text-text-primary',
}

const sizeClasses = {
  sm: {
    button: 'h-control-sm text-role-helper',
    content: 'gap-1.5 px-3',
    loadingText: 'gap-1.5 px-px',
    iconOnly: 'size-control-sm',
    icon: 'size-4',
  },
  md: {
    button: 'h-control-md text-role-navigation',
    content: 'gap-2 px-4',
    loadingText: 'gap-2 px-0.5',
    iconOnly: 'size-control-md',
    icon: 'size-5',
  },
  lg: {
    button: 'h-control-lg text-role-navigation',
    content: 'gap-2 px-6',
    loadingText: 'gap-2 px-2.5',
    iconOnly: 'size-control-lg',
    icon: 'size-5',
  },
}

function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'start',
  iconOnly = false,
  isLoading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  ref,
  className = '',
  children,
  ...buttonProps
}) {
  const selectedVariant = variantClasses[variant] ?? variantClasses.primary
  const selectedSize = sizeClasses[size] ?? sizeClasses.md
  const showStatusIcon = Boolean(Icon) || isLoading
  const contentClasses =
    isLoading && !Icon ? selectedSize.loadingText : selectedSize.content

  const statusIcon = showStatusIcon ? (
    isLoading ? (
      <span
        aria-hidden="true"
        className={[
          selectedSize.icon,
          'shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    ) : (
      <Icon
        aria-hidden="true"
        className={[selectedSize.icon, 'shrink-0'].filter(Boolean).join(' ')}
      />
    )
  ) : null

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={[
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold select-none',
        'transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selectedVariant,
        selectedSize.button,
        iconOnly ? selectedSize.iconOnly : contentClasses,
        fullWidth && !iconOnly && 'w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {iconOnly ? (
        statusIcon
      ) : (
        <>
          {iconPosition === 'start' && statusIcon}
          {children}
          {iconPosition === 'end' && statusIcon}
        </>
      )}
    </button>
  )
}

export default Button
