import { cloneElement, isValidElement } from 'react'
import {
  statusIndicatorBaseClasses,
  statusIndicatorMarkerClasses,
  statusIndicatorPulseClasses,
  statusIndicatorSizeClasses,
  statusIndicatorToneClasses,
} from './statusIndicatorStyles.js'

function hasVisibleLabel(label) {
  return (
    label !== null &&
    label !== undefined &&
    !(typeof label === 'string' && label.trim().length === 0)
  )
}

function getDecorativeIcon(icon) {
  if (!isValidElement(icon)) {
    return icon
  }

  return cloneElement(icon, {
    'aria-hidden': 'true',
    focusable: 'false',
    tabIndex: -1,
  })
}

function StatusIndicator({
  label,
  tone = 'neutral',
  presentation = 'dot',
  size = 'default',
  pulse = false,
  icon,
  className = '',
  ref,
  ...spanProps
}) {
  if (!hasVisibleLabel(label)) {
    return null
  }

  const selectedTone =
    statusIndicatorToneClasses[tone] ??
    statusIndicatorToneClasses.neutral
  const selectedSize =
    statusIndicatorSizeClasses[size] ??
    statusIndicatorSizeClasses.default
  const selectedPresentation =
    presentation === 'icon' && icon ? 'icon' : 'dot'
  const pulseClasses = pulse ? statusIndicatorPulseClasses : ''

  const marker =
    selectedPresentation === 'icon' ? (
      <span
        aria-hidden="true"
        className={[
          statusIndicatorMarkerClasses.icon,
          selectedSize.icon,
          pulseClasses,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {getDecorativeIcon(icon)}
      </span>
    ) : (
      <span
        aria-hidden="true"
        className={[
          statusIndicatorMarkerClasses.dot,
          selectedTone.dot,
          selectedSize.dot,
          pulseClasses,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    )

  return (
    <span
      {...spanProps}
      ref={ref}
      className={[
        statusIndicatorBaseClasses,
        selectedTone.text,
        selectedSize.root,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {marker}
      <span>{label}</span>
    </span>
  )
}

export default StatusIndicator
