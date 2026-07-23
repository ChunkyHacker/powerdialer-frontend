import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import FormField from './FormField.jsx'
import { InputControl } from './Input.jsx'

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

function PasswordInput({
  id,
  label,
  labelHidden = false,
  helperText,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  leadingIcon,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  fullWidth = true,
  size = 'md',
  variant = 'default',
  className = '',
  wrapperClassName = '',
  labelClassName = '',
  messageClassName = '',
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-errormessage': ariaErrorMessage,
  ...inputProps
}) {
  const [isVisible, setIsVisible] = useState(false)
  const VisibilityIcon = isVisible ? EyeOff : Eye

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
        <InputControl
          {...inputProps}
          ref={ref}
          id={controlId}
          type={isVisible ? 'text' : 'password'}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          size={size}
          variant={variant}
          leadingIcon={leadingIcon}
          hasError={hasError}
          fullWidth={fullWidth}
          className={className}
          aria-describedby={mergeDescriptionIds(
            ariaDescribedBy,
            descriptionId,
          )}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-errormessage={hasError ? errorId : ariaErrorMessage}
          trailingControl={
            <button
              type="button"
              disabled={disabled}
              aria-label={
                isVisible ? hidePasswordLabel : showPasswordLabel
              }
              aria-pressed={isVisible}
              onClick={() => setIsVisible((current) => !current)}
              className={[
                'flex size-9 shrink-0 items-center justify-center rounded-md text-text-secondary',
                'transition-colors hover:bg-surface-page hover:text-text-primary',
                'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-accent',
                'disabled:cursor-not-allowed disabled:opacity-50',
                size === 'sm' && 'size-8',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <VisibilityIcon aria-hidden="true" className="size-5" />
            </button>
          }
        />
      )}
    </FormField>
  )
}

export default PasswordInput
