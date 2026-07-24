import Badge from './Badge.jsx'

function normalizeStatusKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

function isValidMap(map) {
  return Boolean(map) && typeof map === 'object' && !Array.isArray(map)
}

function StatusBadge(props) {
  const {
    value,
    map,
    fallbackLabel,
    className = '',
    ...badgeProps
  } = props
  const hasChildren = Object.prototype.hasOwnProperty.call(
    props,
    'children',
  )
  const normalizedKey = normalizeStatusKey(value ?? '')
  const hasValue = normalizedKey.length > 0

  if (!hasValue && !hasChildren) {
    return null
  }

  const mappedStatus =
    hasValue &&
    isValidMap(map) &&
    Object.prototype.hasOwnProperty.call(map, normalizedKey) &&
    map[normalizedKey] &&
    typeof map[normalizedKey] === 'object' &&
    !Array.isArray(map[normalizedKey])
      ? map[normalizedKey]
      : null

  const {
    label: mappedLabel,
    className: mappedClassName = '',
    ...mappedProps
  } = mappedStatus ?? {}
  const isKnownValue = Boolean(mappedStatus)
  const label = hasChildren
    ? props.children
    : isKnownValue
      ? mappedLabel
      : fallbackLabel ?? String(value).trim()

  return (
    <Badge
      {...mappedProps}
      variant={isKnownValue ? mappedProps.variant : 'neutral'}
      {...badgeProps}
      className={[mappedClassName, className].filter(Boolean).join(' ')}
    >
      {label}
    </Badge>
  )
}

export default StatusBadge
