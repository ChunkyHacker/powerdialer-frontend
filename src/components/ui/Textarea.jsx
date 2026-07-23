import FormField from './FormField.jsx'
import {
  resizeClasses,
  textareaBaseClasses,
  textareaSizeClasses,
  variantClasses,
} from './inputStyles.js'

function mergeDescriptionIds(...values) {
  return [
    ...new Set(
      values
        .flatMap((value) =>
          typeof value === 'string' ? value.trim().split(/\s+/) : [],
        )
        .filter(Boolean),
    ),
  ].join(' ') || undefined
}

function Textarea({
  id,
  label,
  labelHidden = false,
  helperText,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  fullWidth = true,
  size = 'md',
  variant = 'default',
  rows = 4,
  resize = 'vertical',
  className = '',
  wrapperClassName = '',
  labelClassName = '',
  messageClassName = '',
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-errormessage': ariaErrorMessage,
  ...textareaProps
}) {
  const selectedSize =
    textareaSizeClasses[size] ?? textareaSizeClasses.md
  const selectedVariant =
    variantClasses[variant] ?? variantClasses.default
  const selectedResize =
    resizeClasses[resize] ?? resizeClasses.vertical

  return (
    <FormField
      id={id}
      label={label}
      labelHidden={labelHidden}
      helperText={helperText}
      error={error}
      required={required}
      fullWidth={fullWidth}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      messageClassName={messageClassName}
    >
      {({ controlId, descriptionId, errorId, hasError }) => (
        <textarea
          {...textareaProps}
          ref={ref}
          id={controlId}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-describedby={mergeDescriptionIds(
            ariaDescribedBy,
            descriptionId,
          )}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-errormessage={hasError ? errorId : ariaErrorMessage}
          className={[
            textareaBaseClasses,
            'block min-w-0 rounded-lg border',
            fullWidth ? 'w-full' : 'w-auto',
            selectedSize,
            selectedVariant,
            selectedResize,
            disabled
              ? 'cursor-not-allowed border-border-default bg-surface-page text-text-secondary opacity-70'
              : hasError
                ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                : 'border-border-default hover:border-text-secondary focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20',
            readOnly && !disabled && 'cursor-text bg-surface-page',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      )}
    </FormField>
  )
}

export default Textarea
