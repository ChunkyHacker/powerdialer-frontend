import { useAvatarGroup } from './AvatarGroupContext.js'
import {
  avatarGroupedClasses,
  avatarOverflowClasses,
  avatarSizeClasses,
} from './avatarStyles.js'
import {
  formatAvatarOverflow,
  getAvatarOverflowLabel,
} from './avatarUtils.js'

function AvatarOverflow({
  count,
  size,
  decorative = false,
  className = '',
  ref,
  'aria-label': ariaLabel,
  ...overflowProps
}) {
  const group = useAvatarGroup()
  const selectedSizeKey = Object.prototype.hasOwnProperty.call(
    avatarSizeClasses,
    size,
  )
    ? size
    : Object.prototype.hasOwnProperty.call(
          avatarSizeClasses,
          group.size,
        )
      ? group.size
      : 'md'
  const selectedSize = avatarSizeClasses[selectedSizeKey]
  const visibleCount = formatAvatarOverflow(count)
  const explicitLabel =
    typeof ariaLabel === 'string' ? ariaLabel.trim() : ''

  if (!visibleCount) {
    return null
  }

  return (
    <span
      {...overflowProps}
      ref={ref}
      role={decorative ? undefined : 'img'}
      aria-label={
        decorative
          ? undefined
          : explicitLabel || getAvatarOverflowLabel(count)
      }
      aria-hidden={decorative || undefined}
      className={[
        avatarOverflowClasses,
        selectedSize.root,
        selectedSize.text,
        group.grouped && avatarGroupedClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true">{visibleCount}</span>
    </span>
  )
}

export default AvatarOverflow
