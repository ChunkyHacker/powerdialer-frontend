import { useState } from 'react'
import { useAvatarGroup } from './AvatarGroupContext.js'
import {
  avatarBaseClasses,
  avatarClipClasses,
  avatarFallbackClasses,
  avatarGroupedClasses,
  avatarImageClasses,
  avatarPresenceBaseClasses,
  avatarPresenceClasses,
  avatarSizeClasses,
} from './avatarStyles.js'
import {
  getAvatarAccessibleLabel,
  getAvatarInitials,
  isValidImageSource,
} from './avatarUtils.js'

function AvatarImage({
  src,
  loading,
  decoding,
  onLoad,
  onError,
}) {
  const [hasFailed, setHasFailed] = useState(false)

  if (hasFailed) {
    return null
  }

  return (
    <img
      src={src}
      alt=""
      loading={loading}
      decoding={decoding}
      onLoad={onLoad}
      onError={(event) => {
        setHasFailed(true)
        onError?.(event)
      }}
      className={avatarImageClasses}
    />
  )
}

function Avatar({
  src,
  alt,
  name,
  initials,
  size,
  presence,
  decorative = false,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  className = '',
  ref,
  'aria-label': ariaLabel,
  ...avatarProps
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
  const selectedPresence = Object.prototype.hasOwnProperty.call(
    avatarPresenceClasses,
    presence,
  )
    ? presence
    : null
  const normalizedSrc = isValidImageSource(src) ? src.trim() : ''
  const accessibleLabel = getAvatarAccessibleLabel({
    ariaLabel,
    name,
    alt,
    presence: selectedPresence,
  })

  return (
    <span
      {...avatarProps}
      ref={ref}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : accessibleLabel}
      aria-hidden={decorative || undefined}
      className={[
        avatarBaseClasses,
        selectedSize.root,
        group.grouped && avatarGroupedClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={avatarClipClasses}>
        <span
          aria-hidden="true"
          className={[
            avatarFallbackClasses,
            selectedSize.text,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {getAvatarInitials({ name, initials })}
        </span>

        {normalizedSrc && (
          <AvatarImage
            key={normalizedSrc}
            src={normalizedSrc}
            loading={loading}
            decoding={decoding}
            onLoad={onLoad}
            onError={onError}
          />
        )}
      </span>

      {selectedPresence && (
        <span
          aria-hidden="true"
          className={[
            avatarPresenceBaseClasses,
            avatarPresenceClasses[selectedPresence],
            selectedSize.presence,
            selectedSize.presencePosition,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}
    </span>
  )
}

export default Avatar
