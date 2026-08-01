import { useEffect, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/Select.jsx'
import { leadImportSystemFields } from '../data/mockLeadImportData.js'

function LeadColumnMapping({
  columns,
  mappingValidation,
  focusRequest,
  disabled = false,
  onMappingChange,
}) {
  const triggerRefs = useRef(new Map())

  useEffect(() => {
    if (focusRequest.columnId) {
      triggerRefs.current.get(focusRequest.columnId)?.focus()
    }
  }, [focusRequest])

  if (columns.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="lead-column-mapping-title"
      className="min-w-0"
    >
      <div className="mb-3">
        <h2
          id="lead-column-mapping-title"
          className="text-role-section-title text-text-primary"
          tabIndex="-1"
        >
          Map imported columns
        </h2>
        <p className="mt-1 text-role-helper text-text-secondary">
          Preview values are simulated. Phone Number is required, and each
          destination field can be selected only once.
        </p>
      </div>

      {mappingValidation.sectionError && (
        <p
          id="lead-mapping-section-error"
          role="alert"
          className="mb-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-role-helper text-danger"
        >
          {mappingValidation.sectionError}
        </p>
      )}

      <div className="grid min-w-0 gap-2">
        {columns.map((column) => {
          const labelId = `mapping-label-${column.id}`
          const errorId = `mapping-error-${column.id}`
          const rowError = mappingValidation.rowErrors[column.id]
          const describedBy = [
            rowError ? errorId : null,
            mappingValidation.sectionError &&
            mappingValidation.firstInvalidColumnId === column.id
              ? 'lead-mapping-section-error'
              : null,
          ]
            .filter(Boolean)
            .join(' ') || undefined
          const selectedLabel =
            column.selectedFieldId === 'ignore'
              ? 'Ignore Column'
              : leadImportSystemFields.find(
                  (field) => field.id === column.selectedFieldId,
                )?.label ?? 'Choose a field'

          return (
            <div
              key={column.id}
              className="grid min-w-0 gap-3 rounded-xl border border-border-default bg-surface-card p-3 xl:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.4fr)_minmax(13rem,1fr)] xl:items-start"
            >
              <div className="min-w-0">
                <p className="text-role-table-heading uppercase text-text-secondary">
                  Imported column
                </p>
                <p
                  id={labelId}
                  className="mt-0.5 break-words font-semibold text-text-primary"
                >
                  {column.name}
                </p>
                {column.mappingSource === 'auto' && (
                  <p className="mt-0.5 text-role-helper text-text-secondary">
                    Suggested automatically
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-role-table-heading uppercase text-text-secondary">
                  Simulated preview
                </p>
                <div className="mt-1 flex min-w-0 flex-wrap gap-1.5">
                  {column.previewValues.map((value) => (
                    <span
                      key={`${column.id}-preview-${value}`}
                      title={value || 'Empty value'}
                      className="max-w-full truncate rounded-md bg-surface-page px-2 py-0.5 text-role-helper text-text-secondary"
                    >
                      {value || 'Empty'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <span className="mb-1 block text-role-helper font-semibold text-text-primary">
                  PowerDialer field
                </span>
                <Select
                  value={column.selectedFieldId}
                  onValueChange={(value) =>
                    onMappingChange(column.id, value)
                  }
                  disabled={disabled}
                  aria-label={`Map ${column.name} to a PowerDialer field`}
                >
                  <SelectTrigger
                    ref={(node) => {
                      if (node) {
                        triggerRefs.current.set(column.id, node)
                      } else {
                        triggerRefs.current.delete(column.id)
                      }
                    }}
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(
                      rowError ||
                        (mappingValidation.sectionError &&
                          mappingValidation.firstInvalidColumnId ===
                            column.id),
                    )}
                  >
                    <SelectValue>{selectedLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectOption value="ignore">
                      Ignore Column
                    </SelectOption>
                    {leadImportSystemFields.map((field) => (
                      <SelectOption key={field.id} value={field.id}>
                        {field.label}
                        {field.required ? ' (required)' : ''}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>

                {rowError && (
                  <p
                    id={errorId}
                    className="mt-1 break-words text-role-helper text-danger"
                  >
                    {rowError}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default LeadColumnMapping
