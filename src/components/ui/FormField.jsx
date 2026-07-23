import { useId } from 'react'

function hasContent(value) {
  return value !== undefined && value !== null && value !== false && value !== ''
}

function FormField({
  id,
  label,
  labelHidden = false,
  helperText,
  error,
  required = false,
  fullWidth = true,
  wrapperClassName = '',
  labelClassName = '',
  messageClassName = '',
  children,
}) {
  const generatedId = useId()
  const controlId = id || `field-${generatedId.replaceAll(':', '')}`
  const helperId = `${controlId}-helper`
  const errorId = `${controlId}-error`
  const hasError = hasContent(error)
  const hasHelper = !hasError && hasContent(helperText)
  const descriptionId = hasError ? errorId : hasHelper ? helperId : undefined

  return (
    <div
      className={[
        'flex min-w-0 flex-col gap-1.5',
        fullWidth ? 'w-full' : 'inline-flex',
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {hasContent(label) && (
        <label
          htmlFor={controlId}
          className={[
            'text-role-navigation text-text-primary',
            labelHidden && 'sr-only',
            labelClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
          )}
        </label>
      )}

      {children({
        controlId,
        descriptionId,
        errorId,
        hasError,
      })}

      {(hasError || hasHelper) && (
        <p
          id={descriptionId}
          className={[
            'text-role-helper min-w-0 break-words',
            hasError ? 'text-danger' : 'text-text-secondary',
            messageClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  )
}

export default FormField
