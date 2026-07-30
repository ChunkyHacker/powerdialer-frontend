import { useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
import { useToast } from '../../../contexts/ToastContext.js'
import CampaignEmptyState from '../components/CampaignEmptyState.jsx'
import CampaignFilters from '../components/CampaignFilters.jsx'
import CampaignsTable from '../components/CampaignsTable.jsx'
import CreateCampaignDialog from '../components/CreateCampaignDialog.jsx'
import { useCampaignsData } from '../hooks/useCampaignsData.js'
import {
  filterCampaigns,
  getSafePage,
  getTotalPages,
  paginateCampaigns,
} from '../utils/campaignFilters.js'

const initialFilters = {
  search: '',
  status: 'all',
  ownerId: 'all',
  dateRange: {
    start: '',
    end: '',
  },
}

const PAGE_SIZE = 8

function CampaignsPage() {
  const { campaigns, owners, agents, isLoading, error } =
    useCampaignsData()
  const { info } = useToast()
  const createButtonRef = useRef(null)
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredCampaigns = useMemo(
    () => filterCampaigns(campaigns, owners, filters),
    [campaigns, filters, owners],
  )
  const totalPages = getTotalPages(filteredCampaigns.length, PAGE_SIZE)
  const safePage = getSafePage(page, totalPages)
  const visibleCampaigns = useMemo(
    () => paginateCampaigns(filteredCampaigns, safePage, PAGE_SIZE),
    [filteredCampaigns, safePage],
  )
  const hasSourceCampaigns = campaigns.length > 0

  function updateFilter(key, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
    setPage(1)
  }

  function handleDateRangeChange(boundary, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      dateRange: {
        ...currentFilters.dateRange,
        [boundary]: value,
      },
    }))
    setPage(1)
  }

  function resetFilters() {
    setFilters(initialFilters)
    setPage(1)
  }

  function handleEdit(campaign) {
    info(`Editing ${campaign.name} will be available in a future step.`, {
      id: 'campaign-edit-placeholder',
      title: 'Edit Campaign',
    })
  }

  const emptyState = (
    <CampaignEmptyState
      filtered={hasSourceCampaigns}
      onReset={resetFilters}
      onCreate={() => setIsCreateDialogOpen(true)}
    />
  )

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-role-page-title">Campaigns</h1>
          <p className="mt-1 text-role-body-copy text-text-secondary">
            Create, monitor, and manage your outbound calling campaigns.
          </p>
        </div>

        <Button
          ref={createButtonRef}
          variant="accent"
          size="md"
          icon={Plus}
          onClick={() => setIsCreateDialogOpen(true)}
          className="self-start sm:self-auto"
        >
          Create Campaign
        </Button>
      </div>

      <CampaignFilters
        filters={filters}
        owners={owners}
        disabled={isLoading}
        onSearchChange={(value) => updateFilter('search', value)}
        onStatusChange={(value) => updateFilter('status', value)}
        onOwnerChange={(value) => updateFilter('ownerId', value)}
        onDateRangeChange={handleDateRangeChange}
        onReset={resetFilters}
      />

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
        >
          Campaign data could not be loaded. Please refresh and try again.
        </div>
      )}

      <section aria-labelledby="campaign-list-title" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="campaign-list-title"
              className="text-role-section-title text-text-primary"
            >
              All Campaigns
            </h2>
            <p className="mt-1 text-role-helper text-text-secondary">
              {isLoading
                ? 'Loading campaign records…'
                : `${filteredCampaigns.length.toLocaleString('en-US')} ${
                    filteredCampaigns.length === 1
                      ? 'campaign'
                      : 'campaigns'
                  }`}
            </p>
          </div>
        </div>

        <CampaignsTable
          campaigns={visibleCampaigns}
          owners={owners}
          agents={agents}
          loading={isLoading}
          emptyState={emptyState}
          page={safePage}
          pageSize={PAGE_SIZE}
          totalItems={filteredCampaigns.length}
          onPageChange={setPage}
          onEdit={handleEdit}
        />
      </section>

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        restoreFocusRef={createButtonRef}
      />
    </div>
  )
}

export default CampaignsPage
