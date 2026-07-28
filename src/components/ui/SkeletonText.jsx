/**
 * Builds realistic text placeholders with a defensively capped line count.
 */
import Skeleton from './Skeleton.jsx'

const MAX_LINES = 20

function normalizeLineCount(lines) {
  return typeof lines === 'number' && Number.isFinite(lines)
    ? Math.min(MAX_LINES, Math.max(1, Math.floor(lines)))
    : 1
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

function SkeletonText({
  lines = 1,
  width = '100%',
  lastLineWidth,
  lineWidths,
  height = '0.75rem',
  gap = '0.5rem',
  className = '',
  lineClassName = '',
}) {
  const lineCount = normalizeLineCount(lines)
  const normalizedWidth = normalizeDimension(width) ?? '100%'
  const normalizedHeight = normalizeDimension(height) ?? '0.75rem'
  const normalizedGap = normalizeDimension(gap) ?? '0.5rem'
  const hasExplicitLastLineWidth =
    normalizeDimension(lastLineWidth) !== undefined

  function getLineWidth(index) {
    const configuredLineWidth = Array.isArray(lineWidths)
      ? normalizeDimension(lineWidths[index])
      : undefined

    if (configuredLineWidth !== undefined) {
      return configuredLineWidth
    }

    // A shorter final line resembles natural copy and avoids a repetitive block
    // when callers have not supplied per-line widths.
    if (index === lineCount - 1) {
      if (hasExplicitLastLineWidth) {
        return normalizeDimension(lastLineWidth)
      }

      if (lineCount > 1 && normalizedWidth === '100%') {
        return '72%'
      }
    }

    return normalizedWidth
  }

  return (
    <div
      aria-hidden="true"
      style={{ gap: normalizedGap }}
      className={['flex min-w-0 flex-col', className]
        .filter(Boolean)
        .join(' ')}
    >
      {Array.from({ length: lineCount }, (_, index) => (
        <Skeleton
          key={`skeleton-text-line-${index}`}
          width={getLineWidth(index)}
          height={normalizedHeight}
          radius="md"
          className={lineClassName}
        />
      ))}
    </div>
  )
}

export default SkeletonText
