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

function FilterSelect({
  id,
  label,
  value,
  options,
  allLabel,
  disabled,
  onValueChange,
}) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? allLabel

  return (
    <div className="min-w-0">
      <span
        id={id}
        className="mb-1.5 block text-role-helper font-semibold text-text-primary"
      >
        {label}
      </span>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        aria-labelledby={id}
      >
        <SelectTrigger>
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectOption value="all">{allLabel}</SelectOption>
          {options.map((option) => (
            <SelectOption key={option.value} value={option.value}>
              {option.label}
            </SelectOption>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function LeadsFilters({
  filters,
  statusOptions,
  priorityOptions,
  agents,
  disabled = false,
  hasActiveFilters = false,
  onFilterChange,
  onReset,
}) {
  const agentOptions = agents.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }))

  return (
    <section
      aria-label="Lead filters"
      className="rounded-xl border border-border-default bg-surface-card p-4 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:items-end xl:grid-cols-[minmax(14rem,2fr)_repeat(3,minmax(9rem,1fr))_auto]">
        <SearchBar
          value={filters.search}
          onValueChange={(value) => onFilterChange('search', value)}
          label="Search leads"
          labelHidden
          placeholder="Search leads, companies, phones, or agents"
          width="full"
          disabled={disabled}
          wrapperClassName="min-w-0 md:col-span-2 xl:col-span-1"
        />

        <FilterSelect
          id="lead-status-filter-label"
          label="Status"
          value={filters.status}
          options={statusOptions}
          allLabel="All statuses"
          disabled={disabled}
          onValueChange={(value) => onFilterChange('status', value)}
        />

        <FilterSelect
          id="lead-priority-filter-label"
          label="Priority"
          value={filters.priority}
          options={priorityOptions}
          allLabel="All priorities"
          disabled={disabled}
          onValueChange={(value) => onFilterChange('priority', value)}
        />

        <FilterSelect
          id="lead-agent-filter-label"
          label="Assigned agent"
          value={filters.agentId}
          options={agentOptions}
          allLabel="All agents"
          disabled={disabled}
          onValueChange={(value) => onFilterChange('agentId', value)}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            icon={RotateCcw}
            disabled={disabled}
            onClick={onReset}
            className="justify-self-start xl:justify-self-end"
          >
            Reset
          </Button>
        )}
      </div>
    </section>
  )
}

export default LeadsFilters
