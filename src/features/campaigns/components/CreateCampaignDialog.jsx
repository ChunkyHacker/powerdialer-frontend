import { Megaphone, X } from 'lucide-react'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/Dialog.jsx'

function CreateCampaignDialog({
  open,
  onOpenChange,
  restoreFocusRef,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      restoreFocusRef={restoreFocusRef}
    >
      <DialogContent size="md">
        <DialogHeader>
          <div className="min-w-0">
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Set up a new outbound campaign for your team.
            </DialogDescription>
          </div>
          <DialogClose
            variant="icon"
            size="sm"
            icon={X}
            iconOnly
            aria-label="Close create campaign dialog"
          />
        </DialogHeader>

        <DialogBody>
          <div className="rounded-xl border border-dashed border-border-default bg-surface-page px-6 py-8 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface-card text-brand-secondary shadow-sm"
            >
              <Megaphone className="size-6" />
            </span>
            <p className="mt-4 text-role-section-title text-text-primary">
              Campaign setup is ready for the next step
            </p>
            <p className="mx-auto mt-2 max-w-sm text-role-helper text-text-secondary">
              Campaign details, audience selection, and dialing settings will
              be added in the dedicated creation workflow.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose variant="outline">Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCampaignDialog
