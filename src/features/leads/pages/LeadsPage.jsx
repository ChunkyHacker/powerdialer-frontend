import { useMemo, useRef, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog.jsx'
import { useToast } from '../../../contexts/ToastContext.js'
import LeadDetailsDrawer from '../components/LeadDetailsDrawer.jsx'
import LeadsEmptyState from '../components/LeadsEmptyState.jsx'
import LeadsFilters from '../components/LeadsFilters.jsx'
import LeadsTable from '../components/LeadsTable.jsx'
import {
  leadPriorityOptions,
  leadStatusOptions,
} from '../data/mockLeadData.js'
import { useLeadsData } from '../hooks/useLeadsData.js'
import {
  filterLeads,
  getLeadTotalPages,
  getSafeLeadPage,
  paginateLeads,
} from '../utils/leadFilters.js'

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  agentId: 'all',
}

const PAGE_SIZE = 8

function escapeCsvValue(value) {
  let text = String(value ?? '')

  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`
  }

  return `"${text.replaceAll('"', '""')}"`
}

function createLeadsCsv(leads, agentMap) {
  const rows = [
    [
      'Name',
      'Job title',
      'Company',
      'Phone',
      'Timezone',
      'Timezone ID',
      'Email',
      'Status',
      'Priority',
      'Assigned agent',
      'Source',
      'Last contacted',
      'Last contact outcome',
      'Notes',
    ],
    ...leads.map((lead) => [
      lead.name,
      lead.jobTitle,
      lead.company,
      lead.phone,
      lead.timezone,
      lead.timezoneId,
      lead.email,
      lead.status,
      lead.priority,
      agentMap.get(lead.assignedAgentId)?.name ?? 'Unassigned',
      lead.source,
      lead.lastContactedAt ?? '',
      lead.lastContactOutcome ?? '',
      lead.notes,
    ]),
  ]

  return rows
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n')
}

function LeadsPage() {
  const {
    leads,
    agents,
    isLoading,
    error: loadError,
    retry,
    addLeadToDnc,
    dncPendingLeadId,
    dncError,
    clearDncError,
  } = useLeadsData()
  const { success, error, info } = useToast()
  const lastActionTriggerRef = useRef(null)
  const leadListHeadingRef = useRef(null)
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedLeadIds, setSelectedLeadIds] = useState([])
  const [drawerLeadId, setDrawerLeadId] = useState(null)
  const [dncCandidateId, setDncCandidateId] = useState(null)

  const agentMap = useMemo(
    () => new Map(agents.map((agent) => [agent.id, agent])),
    [agents],
  )
  const filteredLeads = useMemo(
    () => filterLeads(leads, agents, filters),
    [agents, filters, leads],
  )
  const totalPages = getLeadTotalPages(filteredLeads.length, PAGE_SIZE)
  const safePage = getSafeLeadPage(page, totalPages)
  const visibleLeads = useMemo(
    () => paginateLeads(filteredLeads, safePage, PAGE_SIZE),
    [filteredLeads, safePage],
  )
  const drawerLead =
    leads.find((lead) => lead.id === drawerLeadId) ?? null
  const dncCandidate =
    leads.find((lead) => lead.id === dncCandidateId) ?? null
  const hasSourceLeads = leads.length > 0
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== (key === 'search' ? '' : 'all'),
  )

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
    setPage(1)
  }

  function resetFilters() {
    setFilters(initialFilters)
    setPage(1)
  }

  function handleNewLead() {
    info('Lead creation will be available in a future form workflow.', {
      id: 'new-lead-placeholder',
      title: 'New Lead',
    })
  }

  function handleActionTrigger(trigger) {
    lastActionTriggerRef.current = trigger
  }

  function handleViewDetails(lead) {
    setDrawerLeadId(lead.id)
  }

  function handleRequestDnc(lead) {
    clearDncError()
    setDncCandidateId(lead.id)
  }

  async function handleConfirmDnc() {
    if (!dncCandidate) {
      return
    }

    try {
      await addLeadToDnc(dncCandidate.id)
      success(`${dncCandidate.name} was added to the DNC list.`, {
        id: `lead-dnc-${dncCandidate.id}`,
        title: 'Lead updated',
      })
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') {
        error('The lead could not be added to DNC. Please try again.', {
          id: `lead-dnc-error-${dncCandidate.id}`,
          title: 'DNC update failed',
        })
      }
      throw requestError
    }
  }

  function handleExport() {
    let objectUrl = null
    let downloadLink = null

    try {
      const csv = createLeadsCsv(filteredLeads, agentMap)
      const file = new Blob([`\uFEFF${csv}`], {
        type: 'text/csv;charset=utf-8',
      })
      objectUrl = URL.createObjectURL(file)
      downloadLink = document.createElement('a')
      downloadLink.href = objectUrl
      downloadLink.download = `powerdialer-leads-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
      document.body.appendChild(downloadLink)
      downloadLink.click()

      success(
        `${filteredLeads.length.toLocaleString('en-US')} ${
          filteredLeads.length === 1 ? 'lead was' : 'leads were'
        } exported.`,
        {
          id: 'lead-export-success',
          title: 'Export complete',
        },
      )
    } catch {
      error('The leads export could not be created. Please try again.', {
        id: 'lead-export-error',
        title: 'Export failed',
      })
    } finally {
      downloadLink?.remove()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }

  const emptyState = loadError ? (
    <LeadsEmptyState type="error" onRetry={retry} />
  ) : (
    <LeadsEmptyState
      type={hasSourceLeads ? 'filtered' : 'source'}
      onReset={resetFilters}
      onNewLead={handleNewLead}
    />
  )

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-role-page-title">Leads</h1>
          <p className="mt-1 text-role-body-copy text-text-secondary">
            Search, prioritize, and manage prospects across your calling team.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            size="md"
            icon={Download}
            disabled={isLoading || filteredLeads.length === 0}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="accent"
            size="md"
            icon={Plus}
            onClick={handleNewLead}
          >
            New Lead
          </Button>
        </div>
      </div>

      <LeadsFilters
        filters={filters}
        statusOptions={leadStatusOptions}
        priorityOptions={leadPriorityOptions}
        agents={agents}
        disabled={isLoading}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <section aria-labelledby="lead-list-title" className="min-w-0">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {selectedLeadIds.length.toLocaleString('en-US')} leads selected
        </p>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              ref={leadListHeadingRef}
              id="lead-list-title"
              tabIndex="-1"
              className="text-role-section-title text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              All Leads
            </h2>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-1 text-role-helper text-text-secondary"
            >
              {isLoading
                ? 'Loading lead records…'
                : `${filteredLeads.length.toLocaleString('en-US')} ${
                    filteredLeads.length === 1 ? 'lead' : 'leads'
                  }`}
            </p>
          </div>

          {selectedLeadIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <p
                className="text-role-helper font-semibold text-text-primary"
              >
                {selectedLeadIds.length.toLocaleString('en-US')} selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLeadIds([])}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>

        <LeadsTable
          leads={visibleLeads}
          agents={agents}
          selectedLeadIds={selectedLeadIds}
          onSelectedLeadIdsChange={setSelectedLeadIds}
          loading={isLoading}
          emptyState={emptyState}
          page={safePage}
          pageSize={PAGE_SIZE}
          totalItems={filteredLeads.length}
          onPageChange={setPage}
          onViewDetails={handleViewDetails}
          onRequestDnc={handleRequestDnc}
          onActionTrigger={handleActionTrigger}
        />
      </section>

      <LeadDetailsDrawer
        lead={drawerLead}
        agent={
          drawerLead
            ? agentMap.get(drawerLead.assignedAgentId)
            : undefined
        }
        open={Boolean(drawerLead)}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerLeadId(null)
          }
        }}
        restoreFocusRef={lastActionTriggerRef}
      />

      <ConfirmationDialog
        open={Boolean(dncCandidate)}
        onOpenChange={(open) => {
          if (!open) {
            setDncCandidateId(null)
            clearDncError()
          }
        }}
        title={
          dncCandidate
            ? `Add ${dncCandidate.name} to DNC?`
            : 'Add lead to DNC?'
        }
        description="This prevents the lead from being called in future dialing workflows. The lead record will remain available."
        confirmLabel="Add to DNC"
        variant="danger"
        loading={dncPendingLeadId === dncCandidateId}
        disabled={!dncCandidate}
        onConfirm={handleConfirmDnc}
        restoreFocusRef={leadListHeadingRef}
      >
        {dncError && (
          <p
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
          >
            The DNC update failed. Please try again.
          </p>
        )}
      </ConfirmationDialog>
    </div>
  )
}

export default LeadsPage
