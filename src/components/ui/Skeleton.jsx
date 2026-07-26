const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

const animationClasses = {
  pulse: 'animate-pulse motion-reduce:animate-none',
  none: '',
}

function normalizeDimension(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim()
    return normalizedValue || undefined
  }

  return undefined
}

function Skeleton({
  as: Component = 'div',
  width,
  height,
  radius = 'md',
  animation = 'pulse',
  className = '',
  style,
  ref,
  children,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-live': ariaLive,
  ...skeletonProps
}) {
  void children
  void role
  void tabIndex
  void ariaLabel
  void ariaLive
  const selectedRadius =
    radiusClasses[radius] ?? radiusClasses.md
  const selectedAnimation =
    animationClasses[animation] ?? animationClasses.pulse
  const normalizedWidth = normalizeDimension(width)
  const normalizedHeight = normalizeDimension(height)
  const resolvedStyle = {
    ...style,
    ...(normalizedWidth !== undefined
      ? { width: normalizedWidth }
      : {}),
    ...(normalizedHeight !== undefined
      ? { height: normalizedHeight }
      : {}),
  }

  return (
    <Component
      {...skeletonProps}
      ref={ref}
      aria-hidden="true"
      style={resolvedStyle}
      className={[
        'bg-border-default pointer-events-none shrink-0',
        selectedRadius,
        selectedAnimation,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export default Skeleton
