import { RotateCcw } from 'lucide-react'
import Button from '../../../components/ui/Button.jsx'
import SearchBar from '../../../components/ui/SearchBar.jsx'
import {
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select.jsx'

function LeadListsFilters({
  search,
  status,
  statusOptions,
  disabled = false,
  hasActiveFilters = false,
  onSearchChange,
  onStatusChange,
  onReset,
}) {
  const selectedStatus =
    statusOptions.find((option) => option.value === status)?.label ??
    'All statuses'

  return (
    <section
      aria-label="Lead list filters"
      className="rounded-xl border border-border-default bg-surface-card p-4 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(12rem,1fr)_auto] md:items-end">
        <SearchBar
          value={search}
          onValueChange={onSearchChange}
          label="Search lead lists"
          labelHidden
          placeholder="Search lead lists, filenames, or sources"
          width="full"
          disabled={disabled}
        />

        <div className="min-w-0">
          <span
            id="lead-list-status-filter-label"
            className="mb-1.5 block text-role-helper font-semibold text-text-primary"
          >
            Status
          </span>
          <Select
            value={status}
            onValueChange={onStatusChange}
            disabled={disabled}
            aria-labelledby="lead-list-status-filter-label"
          >
            <SelectTrigger>
              <SelectValue>{selectedStatus}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectOption value="all">All statuses</SelectOption>
              {statusOptions.map((option) => (
                <SelectOption key={option.value} value={option.value}>
                  {option.label}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            icon={RotateCcw}
            disabled={disabled}
            onClick={onReset}
            className="justify-self-start md:justify-self-end"
          >
            Reset
          </Button>
        )}
      </div>
    </section>
  )
}

export default LeadListsFilters
