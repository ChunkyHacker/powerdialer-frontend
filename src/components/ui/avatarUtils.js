import { Children, Fragment, isValidElement } from 'react'

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function limitUppercaseCodePoints(value) {
  return Array.from(value.toUpperCase()).slice(0, 2).join('')
}

function normalizeOverflowCount(count) {
  if (
    typeof count !== 'number' ||
    !Number.isFinite(count) ||
    count <= 0
  ) {
    return 0
  }

  return Math.floor(count)
}

export function isValidImageSource(src) {
  return typeof src === 'string' && src.trim().length > 0
}

export function getAvatarInitials({ name, initials } = {}) {
  const providedInitials = normalizeText(initials).replace(/\s/gu, '')

  if (providedInitials) {
    return limitUppercaseCodePoints(providedInitials)
  }

  const normalizedName = normalizeText(name).replace(/\s+/gu, ' ')

  if (!normalizedName) {
    return '?'
  }

  const words = normalizedName.split(' ')
  const firstInitial = Array.from(words[0])[0] ?? ''
  const lastInitial =
    words.length > 1 ? Array.from(words.at(-1))[0] ?? '' : ''

  return limitUppercaseCodePoints(`${firstInitial}${lastInitial}`) || '?'
}

export function getAvatarAccessibleLabel({
  ariaLabel,
  name,
  alt,
  presence,
} = {}) {
  const explicitLabel = normalizeText(ariaLabel)

  if (explicitLabel) {
    return explicitLabel
  }

  const generatedLabel =
    normalizeText(name) || normalizeText(alt) || 'User avatar'

  return presence
    ? `${generatedLabel}, ${presence}`
    : generatedLabel
}

export function normalizeAvatarMax(max) {
  if (
    max === undefined ||
    max === null ||
    typeof max !== 'number' ||
    !Number.isFinite(max)
  ) {
    return null
  }

  return Math.max(0, Math.floor(max))
}

export function formatAvatarOverflow(count) {
  const normalizedCount = normalizeOverflowCount(count)

  if (!normalizedCount) {
    return ''
  }

  return normalizedCount > 99 ? '99+' : `+${normalizedCount}`
}

export function getAvatarOverflowLabel(count) {
  const normalizedCount = normalizeOverflowCount(count)

  if (!normalizedCount) {
    return ''
  }

  return `${normalizedCount} more ${normalizedCount === 1 ? 'user' : 'users'}`
}

export function flattenAvatarChildren(children) {
  const flattenedChildren = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return
    }

    if (child.type === Fragment) {
      flattenedChildren.push(
        ...flattenAvatarChildren(child.props.children),
      )
      return
    }

    flattenedChildren.push(child)
  })

  return flattenedChildren
}
