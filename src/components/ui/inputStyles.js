export const controlBaseClasses =
  'flex min-w-0 items-center rounded-lg border text-text-primary transition-[border-color,box-shadow,background-color]'

export const inputBaseClasses =
  'min-w-0 flex-1 border-0 bg-transparent text-text-primary outline-none placeholder:text-text-secondary disabled:cursor-not-allowed'

export const textareaBaseClasses =
  'min-w-0 text-text-primary outline-none placeholder:text-text-secondary disabled:cursor-not-allowed'

export const sizeClasses = {
  sm: {
    control: 'h-control-sm',
    input: 'px-3 text-role-helper',
    icon: '[&>svg]:size-4',
    iconPadding: 'px-3',
  },
  md: {
    control: 'h-control-md',
    input: 'px-3 text-role-body-copy',
    icon: '[&>svg]:size-5',
    iconPadding: 'px-3',
  },
  lg: {
    control: 'h-control-lg',
    input: 'px-4 text-role-body-copy',
    icon: '[&>svg]:size-5',
    iconPadding: 'px-4',
  },
}

export const variantClasses = {
  default: 'bg-surface-card',
  subtle: 'bg-surface-page',
}

export const textareaSizeClasses = {
  sm: 'min-h-control-lg px-3 py-2 text-role-helper',
  md: 'min-h-24 px-3 py-2.5 text-role-body-copy',
  lg: 'min-h-32 px-4 py-3 text-role-body-copy',
}

export const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
}
