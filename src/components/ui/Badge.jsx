import {
  badgeDotPositionClasses,
  badgeIconClasses,
  badgeSizeClasses,
  badgeVariantClasses,
} from './badgeStyles.js'

function Badge({
  variant = 'neutral',
  size = 'standard',
  dot = false,
  dotPosition = 'start',
  icon,
  ref,
  className = '',
  children,
  ...badgeProps
}) {
  const selectedVariant =
    badgeVariantClasses[variant] ?? badgeVariantClasses.neutral
  const selectedSize =
    badgeSizeClasses[size] ?? badgeSizeClasses.standard
  const selectedDotPositionKey = Object.prototype.hasOwnProperty.call(
    badgeDotPositionClasses,
    dotPosition,
  )
    ? dotPosition
    : 'start'
  const selectedDotPosition =
    badgeDotPositionClasses[selectedDotPositionKey]

  const statusDot = dot ? (
    <span
      aria-hidden="true"
      className={[
        'shrink-0 rounded-full',
        selectedVariant.dot,
        selectedSize.dot,
        selectedDotPosition,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  ) : null

  return (
    <span
      {...badgeProps}
      ref={ref}
      className={[
        'inline-flex max-w-full items-center justify-center whitespace-nowrap rounded-full border font-semibold',
        selectedVariant.badge,
        selectedSize.badge,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {selectedDotPositionKey === 'start' && statusDot}
      {icon && (
        <span
          aria-hidden="true"
          className={[badgeIconClasses, selectedSize.icon]
            .filter(Boolean)
            .join(' ')}
        >
          {icon}
        </span>
      )}
      {children}
      {selectedDotPositionKey === 'end' && statusDot}
    </span>
  )
}

export default Badge
