const sizeClasses = {
  xs: {
    className: 'size-3',
    strokeWidth: 1.5,
  },
  sm: {
    className: 'size-4',
    strokeWidth: 1.75,
  },
  md: {
    className: 'size-5',
    strokeWidth: 2,
  },
  lg: {
    className: 'size-6',
    strokeWidth: 2,
  },
}

function getAccessibleLabel(label) {
  return typeof label === 'string' && label.trim()
    ? label.trim()
    : 'Loading'
}

function Spinner({
  size = 'md',
  label = 'Loading',
  decorative = false,
  className = '',
  ref,
  ...svgProps
}) {
  const selectedSize = sizeClasses[size] ?? sizeClasses.md

  return (
    <svg
      {...svgProps}
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : getAccessibleLabel(label)}
      aria-hidden={decorative ? 'true' : undefined}
      className={[
        selectedSize.className,
        'shrink-0 pointer-events-none animate-spin motion-reduce:animate-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={selectedSize.strokeWidth}
        opacity="0.25"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth={selectedSize.strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Spinner
