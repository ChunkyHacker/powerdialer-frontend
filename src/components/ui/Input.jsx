/**
 * Composes FormField's accessible structure with a reusable low-level input.
 *
 * Exporting InputControl lets related fields such as PasswordInput share base
 * behavior without duplicating control markup or styling.
 */
import FormField from './FormField.jsx'
import {
  controlBaseClasses,
  inputBaseClasses,
  sizeClasses,
  variantClasses,
} from './inputStyles.js'

// ARIA ID lists may come from both consumers and FormField; normalization
// removes whitespace and duplicates before the relationship reaches the input.
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

// This primitive owns the native input, adornments, and visual state while its
// callers remain responsible for labels and descriptive-message ownership.
export function InputControl({
  type,
  disabled,
  readOnly,
  size,
  variant,
  leadingIcon,
  trailingIcon,
  trailingControl,
  hasError,
  fullWidth,
  className,
  ref,
  ...inputProps
}) {
  const selectedSize = sizeClasses[size] ?? sizeClasses.md
  const selectedVariant = variantClasses[variant] ?? variantClasses.default
  const iconClasses = [
    'pointer-events-none flex shrink-0 items-center justify-center text-text-secondary',
    '[&>svg]:shrink-0',
    selectedSize.icon,
    hasError && 'text-danger',
    disabled && 'opacity-50',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={[
        controlBaseClasses,
        selectedSize.control,
        selectedVariant,
        fullWidth ? 'w-full' : 'w-auto',
        disabled
          ? 'cursor-not-allowed border-border-default bg-surface-page text-text-secondary opacity-70'
          : hasError
            ? 'border-danger focus-within:ring-2 focus-within:ring-danger/20'
            : 'border-border-default hover:border-text-secondary focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/20',
        readOnly && !disabled && 'bg-surface-page',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leadingIcon && (
        <span
          aria-hidden="true"
          className={[iconClasses, selectedSize.iconPadding, 'pr-0']
            .filter(Boolean)
            .join(' ')}
        >
          {leadingIcon}
        </span>
      )}

      <input
        {...inputProps}
        ref={ref}
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        className={[
          inputBaseClasses,
          selectedSize.input,
          leadingIcon && 'pl-2',
          (trailingIcon || trailingControl) && 'pr-2',
          readOnly && 'cursor-text',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />

      {trailingIcon && (
        <span
          aria-hidden="true"
          className={[iconClasses, selectedSize.iconPadding, 'pl-0']
            .filter(Boolean)
            .join(' ')}
        >
          {trailingIcon}
        </span>
      )}

      {trailingControl}
    </div>
  )
}

function Input({
  type = 'text',
  id,
  label,
  labelHidden = false,
  helperText,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  leadingIcon,
  trailingIcon,
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
  // FormField errors override consumer-provided ARIA state so visible
  // validation and the control's accessibility relationships agree.
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
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          size={size}
          variant={variant}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
          hasError={hasError}
          fullWidth={fullWidth}
          className={className}
          aria-describedby={mergeDescriptionIds(
            ariaDescribedBy,
            descriptionId,
          )}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-errormessage={hasError ? errorId : ariaErrorMessage}
        />
      )}
    </FormField>
  )
}

export default Input
