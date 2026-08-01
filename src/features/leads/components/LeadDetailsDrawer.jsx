import { X } from 'lucide-react'
import Avatar from '../../../components/ui/Avatar.jsx'
import StatusBadge from '../../../components/ui/StatusBadge.jsx'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/Dialog.jsx'

const drawerStatusMap = {
  new: { label: 'New', variant: 'info', dot: true },
  contacted: { label: 'Contacted', variant: 'neutral', dot: true },
  qualified: { label: 'Qualified', variant: 'success', dot: true },
  'follow-up': { label: 'Follow-up', variant: 'accent', dot: true },
  unresponsive: { label: 'Unresponsive', variant: 'warning', dot: true },
  'do-not-call': { label: 'Do not call', variant: 'danger', dot: true },
}

const drawerPriorityMap = {
  low: { label: 'Low priority', variant: 'neutral', dot: true },
  medium: { label: 'Medium priority', variant: 'info', dot: true },
  high: { label: 'High priority', variant: 'warning', dot: true },
  urgent: { label: 'Urgent priority', variant: 'danger', dot: true },
}

function formatLastContact(lead) {
  if (!lead.lastContactedAt) {
    return 'Not contacted yet'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: lead.timezoneId,
  }).format(new Date(lead.lastContactedAt))
}

function DetailItem({ label, children }) {
  return (
    <div>
      <dt className="text-role-helper font-semibold text-text-secondary">
        {label}
      </dt>
      <dd className="mt-1 break-words text-role-body-copy text-text-primary">
        {children}
      </dd>
    </div>
  )
}

function LeadDetailsDrawer({
  lead,
  agent,
  open,
  onOpenChange,
  restoreFocusRef,
}) {
  if (!lead) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      restoreFocusRef={restoreFocusRef}
    >
      <DialogContent
        size="md"
        className="fixed inset-y-0 right-0 h-dvh !max-h-dvh !max-w-md !rounded-none border-y-0 border-r-0"
      >
        <DialogHeader>
          <div className="min-w-0">
            <DialogTitle>{lead.name}</DialogTitle>
            <DialogDescription>
              Lead details and recent contact context.
            </DialogDescription>
          </div>
          <DialogClose
            variant="icon"
            size="sm"
            icon={X}
            iconOnly
            aria-label="Close lead details"
          />
        </DialogHeader>

        <DialogBody className="space-y-6">
          <section aria-labelledby="lead-overview-title">
            <h3
              id="lead-overview-title"
              className="text-role-section-title text-text-primary"
            >
              Overview
            </h3>
            <p className="mt-1 text-role-body-copy font-semibold text-text-primary">
              {lead.jobTitle}
            </p>
            <p className="mt-0.5 text-role-helper text-text-secondary">
              {lead.company}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                value={lead.status}
                map={drawerStatusMap}
                size="small"
              />
              <StatusBadge
                value={lead.priority}
                map={drawerPriorityMap}
                size="small"
              />
            </div>
          </section>

          <section aria-labelledby="lead-contact-title">
            <h3
              id="lead-contact-title"
              className="text-role-section-title text-text-primary"
            >
              Contact
            </h3>
            <dl className="mt-4 grid gap-4">
              <DetailItem label="Phone">
                <a
                  href={`tel:${lead.phone.replace(/\s/g, '')}`}
                  className="hover:text-brand-secondary hover:underline"
                >
                  {lead.phone}
                </a>
              </DetailItem>
              <DetailItem label="Email">
                <a
                  href={`mailto:${lead.email}`}
                  className="hover:text-brand-secondary hover:underline"
                >
                  {lead.email}
                </a>
              </DetailItem>
              <DetailItem label="Timezone">
                {lead.timezone}
                <span className="block text-role-helper text-text-secondary">
                  {lead.timezoneId}
                </span>
              </DetailItem>
            </dl>
          </section>

          <section aria-labelledby="lead-ownership-title">
            <h3
              id="lead-ownership-title"
              className="text-role-section-title text-text-primary"
            >
              Ownership and source
            </h3>
            <dl className="mt-4 grid gap-4">
              <DetailItem label="Assigned agent">
                {agent ? (
                  <span className="flex items-center gap-2">
                    <Avatar name={agent.name} size="sm" />
                    {agent.name}
                  </span>
                ) : (
                  'Unassigned'
                )}
              </DetailItem>
              <DetailItem label="Source">{lead.source}</DetailItem>
            </dl>
          </section>

          <section aria-labelledby="lead-history-title">
            <h3
              id="lead-history-title"
              className="text-role-section-title text-text-primary"
            >
              Contact history
            </h3>
            <dl className="mt-4 grid gap-4">
              <DetailItem label="Last contact">
                {lead.lastContactedAt ? (
                  <time dateTime={lead.lastContactedAt}>
                    {formatLastContact(lead)}
                  </time>
                ) : (
                  formatLastContact(lead)
                )}
              </DetailItem>
              <DetailItem label="Outcome">
                {lead.lastContactOutcome ?? 'No outcome recorded'}
              </DetailItem>
              <DetailItem label="Notes">{lead.notes}</DetailItem>
            </dl>
          </section>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export default LeadDetailsDrawer
