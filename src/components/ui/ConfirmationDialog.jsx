import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import Button from './Button.jsx'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog.jsx'

function isPromiseLike(value) {
  return value && typeof value.then === 'function'
}

export default function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'standard',
  loading = false,
  disabled = false,
  onConfirm,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  initialFocusRef,
  restoreFocusRef,
  size = 'sm',
  children,
}) {
  const [internalPending, setInternalPending] = useState(false)
  const pendingGuardRef = useRef(false)
  const effectivelyBusy = loading || internalPending
  const confirmVariant = variant === 'danger' ? 'danger' : 'primary'

  async function handleConfirm() {
    if (effectivelyBusy || disabled || pendingGuardRef.current) {
      return
    }

    pendingGuardRef.current = true
    setInternalPending(true)

    try {
      const result = onConfirm?.()
      if (isPromiseLike(result)) {
        await result
      }
      onOpenChange?.(false, 'confirm')
    } catch {
      // Feature-level error presentation remains the parent's responsibility.
    } finally {
      pendingGuardRef.current = false
      setInternalPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      initialFocusRef={initialFocusRef}
      restoreFocusRef={restoreFocusRef}
      closeOnEscape={closeOnEscape && !effectivelyBusy}
      closeOnOutsideClick={closeOnOutsideClick && !effectivelyBusy}
    >
      <DialogContent size={size} role="alertdialog">
        <DialogHeader>
          <div className="min-w-0">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </div>
          <DialogClose
            variant="icon"
            size="sm"
            icon={X}
            iconOnly
            aria-label="Close dialog"
            disabled={effectivelyBusy}
          />
        </DialogHeader>

        {children && <DialogBody>{children}</DialogBody>}

        <DialogFooter>
          <DialogClose
            reason="cancel"
            variant="outline"
            disabled={effectivelyBusy}
          >
            {cancelLabel}
          </DialogClose>
          <Button
            variant={confirmVariant}
            disabled={disabled || effectivelyBusy}
            isLoading={effectivelyBusy}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
