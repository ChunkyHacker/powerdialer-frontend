function HeaderIconButton({ label, children, className = '', ...buttonProps }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'flex size-control-sm shrink-0 items-center justify-center rounded-md',
        'text-text-secondary transition-colors',
        'hover:bg-surface-page hover:text-text-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ].join(' ')}
      {...buttonProps}
    >
      {children}
    </button>
  )
}

export default HeaderIconButton
