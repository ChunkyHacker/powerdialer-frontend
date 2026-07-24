import AvatarOverflow from './AvatarOverflow.jsx'
import { AvatarGroupProvider } from './AvatarGroupContext.js'
import {
  avatarGroupClasses,
  avatarGroupItemClasses,
  avatarSizeClasses,
} from './avatarStyles.js'
import {
  flattenAvatarChildren,
  normalizeAvatarMax,
} from './avatarUtils.js'

function AvatarGroup({
  children,
  max,
  size = 'md',
  overlap = true,
  className = '',
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...groupProps
}) {
  const selectedSizeKey = Object.prototype.hasOwnProperty.call(
    avatarSizeClasses,
    size,
  )
    ? size
    : 'md'
  const selectedSize = avatarSizeClasses[selectedSizeKey]
  const normalizedMax = normalizeAvatarMax(max)
  const normalizedChildren = flattenAvatarChildren(children)
  const total = normalizedChildren.length
  const hasOverflow =
    normalizedMax !== null &&
    normalizedMax > 0 &&
    total > normalizedMax
  const visibleChildCount = hasOverflow
    ? Math.max(0, normalizedMax - 1)
    : normalizedMax === 0
      ? 0
      : total
  const visibleChildren = normalizedChildren.slice(
    0,
    visibleChildCount,
  )
  const overflowCount = hasOverflow ? total - visibleChildCount : 0
  const visibleItems = [
    ...visibleChildren,
    ...(overflowCount > 0
      ? [
          <AvatarOverflow
            key="avatar-group-overflow"
            count={overflowCount}
          />,
        ]
      : []),
  ]
  const isLabelled = Boolean(ariaLabel || ariaLabelledBy)

  return (
    <AvatarGroupProvider
      value={{ size: selectedSizeKey, grouped: overlap }}
    >
      <span
        {...groupProps}
        ref={ref}
        role={isLabelled ? 'group' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={[avatarGroupClasses, className]
          .filter(Boolean)
          .join(' ')}
      >
        {visibleItems.map((child, index) => (
          <span
            key={child.key ?? index}
            className={[
              avatarGroupItemClasses,
              overlap && index > 0 && selectedSize.overlap,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {child}
          </span>
        ))}
      </span>
    </AvatarGroupProvider>
  )
}

export default AvatarGroup
