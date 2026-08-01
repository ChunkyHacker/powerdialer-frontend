import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
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
import Input from '../../../components/ui/Input.jsx'
import {
  CALLBACK_REFERENCE_DATE,
} from '../data/mockCallbackData.js'
import {
  CALLBACK_REFERENCE_TIME,
  createManilaScheduledAt,
  formatCallbackSchedule,
  getScheduleInputValues,
  hasScheduleErrors,
  validateCallbackSchedule,
} from '../utils/callbackGrouping.js'

function RescheduleCallbackDialog({
  callback,
  open,
  pending,
  restoreFocusRef,
  onOpenChange,
  onSave,
}) {
  const initialValues = getScheduleInputValues(callback.scheduledAt)
  const [date, setDate] = useState(initialValues.date)
  const [time, setTime] = useState(initialValues.time)
  const [submitError, setSubmitError] = useState('')

  const errors = validateCallbackSchedule(date, time)
  const invalid = hasScheduleErrors(errors)
  const currentSchedule = formatCallbackSchedule(callback.scheduledAt)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    if (invalid || pending) {
      return
    }

    try {
      await onSave(createManilaScheduledAt(date, time))
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') {
        setSubmitError('The callback could not be rescheduled. Please try again.')
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      restoreFocusRef={restoreFocusRef}
      closeOnEscape={!pending}
      closeOnOutsideClick={!pending}
    >
      <DialogContent size="md">
        <DialogHeader>
          <div className="min-w-0">
            <DialogTitle>Reschedule {callback.contactName}</DialogTitle>
            <DialogDescription>
              Choose a new callback time in the board’s Manila timezone.
            </DialogDescription>
          </div>
          <DialogClose
            variant="icon"
            size="sm"
            icon={X}
            iconOnly
            disabled={pending}
            aria-label="Close reschedule callback dialog"
          />
        </DialogHeader>

        <DialogBody>
          <form id="reschedule-callback-form" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-border-default bg-surface-page px-4 py-3">
              <p className="text-role-helper font-semibold text-text-primary">
                Current schedule
              </p>
              <p className="mt-1 break-words text-role-helper text-text-secondary">
                {currentSchedule.date} at {currentSchedule.time}
              </p>
            </div>

            <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
              <Input
                type="date"
                label="Callback date"
                required
                min={CALLBACK_REFERENCE_DATE}
                value={date}
                error={errors.date}
                disabled={pending}
                onChange={(event) => {
                  setDate(event.target.value)
                  setSubmitError('')
                }}
              />
              <Input
                type="time"
                label="Callback time"
                required
                min={
                  date === CALLBACK_REFERENCE_DATE
                    ? CALLBACK_REFERENCE_TIME
                    : undefined
                }
                value={time}
                error={errors.time}
                disabled={pending}
                onChange={(event) => {
                  setTime(event.target.value)
                  setSubmitError('')
                }}
              />
            </div>

            {submitError && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
              >
                {submitError}
              </p>
            )}
          </form>
        </DialogBody>

        <DialogFooter>
          <DialogClose variant="outline" disabled={pending} reason="cancel">
            Cancel
          </DialogClose>
          <Button
            type="submit"
            form="reschedule-callback-form"
            isLoading={pending}
            disabled={invalid || pending}
          >
            Save Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RescheduleCallbackDialog
