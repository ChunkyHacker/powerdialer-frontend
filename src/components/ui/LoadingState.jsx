/**
 * Owns one accessible loading announcement while using a decorative Spinner
 * internally to avoid duplicate screen-reader messages.
 */
import Spinner from './Spinner.jsx'

const alignmentClasses = {
  start: 'justify-start text-left',
  center: 'justify-center text-center',
}

function getVisibleLabel(label) {
  return typeof label === 'string' && label.trim()
    ? label.trim()
    : 'Loading'
}

function LoadingState({
  label = 'Loading',
  size = 'md',
  inline = false,
  align = 'start',
  announce = true,
  className = '',
  spinnerClassName = '',
  ref,
  ...containerProps
}) {
  const selectedAlignment =
    alignmentClasses[align] ?? alignmentClasses.start

  return (
    <div
      {...containerProps}
      ref={ref}
      role={announce ? 'status' : undefined}
      aria-live={announce ? 'polite' : undefined}
      aria-atomic={announce ? 'true' : undefined}
      className={[
        inline
          ? 'inline-flex max-w-full items-center gap-2'
          : 'flex w-full items-center gap-2',
        selectedAlignment,
        'text-role-helper text-text-secondary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Spinner
        decorative
        size={size}
        className={spinnerClassName}
      />
      <span className="min-w-0 break-words">
        {getVisibleLabel(label)}
      </span>
    </div>
  )
}

export default LoadingState
