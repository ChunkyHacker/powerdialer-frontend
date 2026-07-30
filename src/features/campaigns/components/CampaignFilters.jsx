import { RotateCcw } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
import Input from '../../../components/ui/Input.jsx'
import SearchBar from '../../../components/ui/SearchBar.jsx'
import {
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select.jsx'
import { campaignStatusOptions } from '../data/mockCampaignData.js'

function CampaignFilters({
  filters,
  owners,
  disabled = false,
  onSearchChange,
  onStatusChange,
  onOwnerChange,
  onDateRangeChange,
  onReset,
}) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.ownerId !== 'all' ||
    filters.dateRange.start !== '' ||
    filters.dateRange.end !== ''
  const selectedStatus =
    campaignStatusOptions.find(
      (option) => option.value === filters.status,
    )?.label ?? 'All statuses'
  const selectedOwner =
    owners.find((owner) => owner.id === filters.ownerId)?.name ??
    'All owners'

  return (
    <section
      aria-label="Campaign filters"
      className="rounded-xl border border-border-default bg-surface-card p-4 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:items-end lg:grid-cols-4 xl:grid-cols-[minmax(13rem,2fr)_minmax(7rem,0.8fr)_minmax(8rem,0.9fr)_minmax(8rem,1fr)_minmax(8rem,1fr)_auto]">
        <SearchBar
          value={filters.search}
          onValueChange={onSearchChange}
          label="Search campaigns"
          labelHidden
          placeholder="Search campaigns or owners"
          width="full"
          wrapperClassName="min-w-0 md:col-span-2 lg:col-span-2 xl:col-span-1"
          disabled={disabled}
        />

        <div className="min-w-0">
          <span
            id="campaign-status-filter-label"
            className="mb-1.5 block text-role-helper font-semibold text-text-primary"
          >
            Status
          </span>
          <Select
            value={filters.status}
            onValueChange={onStatusChange}
            disabled={disabled}
            aria-labelledby="campaign-status-filter-label"
          >
            <SelectTrigger>
              <SelectValue>{selectedStatus}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectOption value="all">All statuses</SelectOption>
              {campaignStatusOptions.map((option) => (
                <SelectOption key={option.value} value={option.value}>
                  {option.label}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
          <span
            id="campaign-owner-filter-label"
            className="mb-1.5 block text-role-helper font-semibold text-text-primary"
          >
            Owner
          </span>
          <Select
            value={filters.ownerId}
            onValueChange={onOwnerChange}
            disabled={disabled}
            aria-labelledby="campaign-owner-filter-label"
          >
            <SelectTrigger>
              <SelectValue>{selectedOwner}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectOption value="all">All owners</SelectOption>
              {owners.map((owner) => (
                <SelectOption key={owner.id} value={owner.id}>
                  {owner.name}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          type="date"
          label="Starts from"
          value={filters.dateRange.start}
          max={filters.dateRange.end || undefined}
          disabled={disabled}
          onChange={(event) =>
            onDateRangeChange('start', event.target.value)
          }
          className="tabular-nums"
          wrapperClassName="min-w-0"
        />

        <Input
          type="date"
          label="Ends by"
          value={filters.dateRange.end}
          min={filters.dateRange.start || undefined}
          disabled={disabled}
          onChange={(event) =>
            onDateRangeChange('end', event.target.value)
          }
          className="tabular-nums"
          wrapperClassName="min-w-0"
        />

        <Button
          variant="ghost"
          size="md"
          icon={RotateCcw}
          disabled={disabled || !hasActiveFilters}
          onClick={onReset}
          className="justify-self-start xl:justify-self-end"
        >
          Reset
        </Button>
      </div>
    </section>
  )
}

export default CampaignFilters
