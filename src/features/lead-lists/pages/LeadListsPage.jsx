import { useMemo, useState } from 'react'
import { Upload } from 'lucide-react'
import { useNavigate } from 'react-router'
import Button from '../../../components/ui/Button.jsx'
import { useToast } from '../../../contexts/ToastContext.js'
import LeadListsEmptyState from '../components/LeadListsEmptyState.jsx'
import LeadListsFilters from '../components/LeadListsFilters.jsx'
import LeadListsTable from '../components/LeadListsTable.jsx'
import { leadListStatusOptions } from '../data/mockLeadListData.js'
import { useLeadListsData } from '../hooks/useLeadListsData.js'
import {
  filterLeadLists,
  getLeadListTotalPages,
  getSafeLeadListPage,
  paginateLeadLists,
} from '../utils/leadListFilters.js'

const initialFilters = {
  search: '',
  status: 'all',
}

const PAGE_SIZE = 8

function LeadListsPage() {
  const navigate = useNavigate()
  const { info } = useToast()
  const { leadLists, isLoading, error } = useLeadListsData()
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)

  const filteredLeadLists = useMemo(
    () => filterLeadLists(leadLists, filters),
    [filters, leadLists],
  )
  const totalPages = getLeadListTotalPages(
    filteredLeadLists.length,
    PAGE_SIZE,
  )
  const safePage = getSafeLeadListPage(page, totalPages)
  const visibleLeadLists = useMemo(
    () => paginateLeadLists(filteredLeadLists, safePage, PAGE_SIZE),
    [filteredLeadLists, safePage],
  )
  const hasSourceLeadLists = leadLists.length > 0
  const hasActiveFilters =
    filters.search !== '' || filters.status !== 'all'

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

  function importLeads() {
    navigate('/lead-lists/import')
  }

  function handleViewDetails(leadList) {
    info(`Details for ${leadList.name} will be available in a future step.`, {
      id: 'lead-list-details-placeholder',
      title: 'Lead List Details',
    })
  }

  function handleRetry(leadList) {
    info(`Retrying ${leadList.name} will be available in a future step.`, {
      id: 'lead-list-retry-placeholder',
      title: 'Retry Import',
    })
  }

  function handleViewValidationIssues(leadList) {
    info(
      `Validation issues for ${leadList.name} will be available in a future step.`,
      {
        id: 'lead-list-validation-placeholder',
        title: 'Validation Issues',
      },
    )
  }

  const emptyState = error ? (
    'Lead list data is unavailable.'
  ) : (
    <LeadListsEmptyState
      filtered={hasSourceLeadLists}
      onReset={resetFilters}
      onImport={importLeads}
    />
  )

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-role-page-title">Lead Lists</h1>
          <p className="mt-1 text-role-body-copy text-text-secondary">
            Review imported lead files, validation results, and processing
            status.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          icon={Upload}
          onClick={importLeads}
          className="self-start sm:self-auto"
        >
          Import Leads
        </Button>
      </div>

      <LeadListsFilters
        search={filters.search}
        status={filters.status}
        statusOptions={leadListStatusOptions}
        disabled={isLoading}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={(value) => updateFilter('search', value)}
        onStatusChange={(value) => updateFilter('status', value)}
        onReset={resetFilters}
      />

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
        >
          Lead list data could not be loaded. Please refresh and try
          again.
        </div>
      )}

      <section aria-labelledby="lead-list-title" className="min-w-0">
        <div className="mb-4">
          <h2
            id="lead-list-title"
            className="text-role-section-title text-text-primary"
          >
            Imported Lead Lists
          </h2>
          <p className="mt-1 text-role-helper text-text-secondary">
            {isLoading
              ? 'Loading lead list records…'
              : `${filteredLeadLists.length.toLocaleString('en-US')} ${
                  filteredLeadLists.length === 1
                    ? 'lead list'
                    : 'lead lists'
                }`}
          </p>
        </div>

        <LeadListsTable
          leadLists={visibleLeadLists}
          loading={isLoading}
          emptyState={emptyState}
          page={safePage}
          pageSize={PAGE_SIZE}
          totalItems={filteredLeadLists.length}
          onPageChange={setPage}
          onViewDetails={handleViewDetails}
          onRetry={handleRetry}
          onViewValidationIssues={handleViewValidationIssues}
        />
      </section>
    </div>
  )
}

export default LeadListsPage
