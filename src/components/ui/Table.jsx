/**
 * Accessible, horizontally scrollable presentation for parent-owned row data,
 * selection, sorting, and pagination state.
 *
 * The table supplies semantic markup and rendering boundaries while callbacks
 * return user intent to the parent instead of mutating application data.
 */
import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import TablePagination from './TablePagination.jsx'

const alignmentClasses = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
}

function TableCheckbox({
  checked,
  disabled = false,
  indeterminate = false,
  className = '',
  ref,
  ...inputProps
}) {
  const internalRef = useRef(null)

  function setInputRef(node) {
    internalRef.current = node

    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      {...inputProps}
      ref={setInputRef}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      aria-checked={indeterminate ? 'mixed' : checked}
      className={[
        'size-4 shrink-0 cursor-pointer rounded border-border-default accent-brand-accent',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

function resolveCellValue(column, row) {
  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }

  if (
    typeof column.accessorKey === 'string' ||
    typeof column.accessorKey === 'number'
  ) {
    return row?.[column.accessorKey]
  }

  return undefined
}

function renderCellValue(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'boolean') {
    return String(value)
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    Array.isArray(value)
  ) {
    return value
  }

  if (typeof value === 'object' && value.$$typeof) {
    return value
  }

  return String(value)
}

function getSortButtonLabel(column, sort) {
  const heading =
    typeof column.header === 'string' ? column.header : column.id
  const isActive = sort?.columnId === column.id

  if (!isActive) {
    return `Sort by ${heading}, currently not sorted`
  }

  return `Sort by ${heading}, currently sorted ${sort.direction}`
}

function Table({
  columns = [],
  rows = [],
  getRowId,
  selectedRowIds,
  onSelectedRowIdsChange,
  isRowSelectable,
  getRowSelectionLabel,
  selectAllLabel = 'Select all visible rows',
  sort,
  onSortChange,
  renderRowActions,
  rowActionsLabel = 'Actions',
  loading = false,
  loadingRowCount = 5,
  loadingLabel = 'Loading data',
  emptyState,
  pagination,
  caption,
  captionHidden = true,
  className = '',
  containerClassName = '',
  ...tableProps
}) {
  // Defensive normalization protects presentation from malformed collections;
  // selection is enabled only when the parent supplies both state and an updater.
  const normalizedColumns = Array.isArray(columns)
    ? columns.filter(
        (column) =>
          column &&
          (typeof column.id === 'string' ||
            typeof column.id === 'number'),
      )
    : []
  const normalizedRows = Array.isArray(rows) ? rows : []
  const selectionEnabled =
    Array.isArray(selectedRowIds) &&
    typeof onSelectedRowIdsChange === 'function'
  const actionsEnabled = typeof renderRowActions === 'function'
  const totalColumnCount = Math.max(
    1,
    normalizedColumns.length +
      (selectionEnabled ? 1 : 0) +
      (actionsEnabled ? 1 : 0),
  )

  if (normalizedRows.length > 0 && typeof getRowId !== 'function') {
    throw new Error(
      'Table requires getRowId when rows are provided.',
    )
  }

  const rowEntries = normalizedRows.map((row, rowIndex) => {
    const rowId = getRowId(row)

    if (rowId === null || rowId === undefined) {
      throw new Error(
        `Table getRowId returned no ID for row at index ${rowIndex}.`,
      )
    }

    return { row, rowId, rowIndex }
  })
  const selectedIds = new Set(
    selectionEnabled ? selectedRowIds : [],
  )
  const selectableEntries = selectionEnabled
    ? rowEntries.filter(
        ({ row }) =>
          typeof isRowSelectable !== 'function' ||
          isRowSelectable(row),
      )
    : []
  const selectableIds = selectableEntries.map(({ rowId }) => rowId)
  const selectedVisibleCount = selectableIds.filter((rowId) =>
    selectedIds.has(rowId),
  ).length
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectedVisibleCount === selectableIds.length
  const someVisibleSelected =
    selectedVisibleCount > 0 && !allVisibleSelected
  const normalizedLoadingRowCount =
    typeof loadingRowCount === 'number' &&
    Number.isFinite(loadingRowCount) &&
    loadingRowCount > 0
      ? Math.floor(loadingRowCount)
      : 1

  function updateVisibleSelection(shouldSelect) {
    const nextSelectedIds = new Set(selectedRowIds)

    selectableIds.forEach((rowId) => {
      if (shouldSelect) {
        nextSelectedIds.add(rowId)
      } else {
        nextSelectedIds.delete(rowId)
      }
    })

    onSelectedRowIdsChange([...nextSelectedIds])
  }

  function updateRowSelection(rowId, shouldSelect) {
    const nextSelectedIds = new Set(selectedRowIds)

    if (shouldSelect) {
      nextSelectedIds.add(rowId)
    } else {
      nextSelectedIds.delete(rowId)
    }

    onSelectedRowIdsChange([...nextSelectedIds])
  }

  // Sorting remains controlled: the table derives the next direction and emits
  // it without reordering rows that belong to the parent.
  function requestSort(column) {
    if (!column.sortable || typeof onSortChange !== 'function') {
      return
    }

    const direction =
      sort?.columnId === column.id &&
      sort.direction === 'ascending'
        ? 'descending'
        : 'ascending'

    onSortChange({ columnId: column.id, direction })
  }

  // Loading rows take precedence over empty and populated states. Populated
  // cells cross the customization boundary only through column/action renderers.
  return (
    <div
      className={[
        'min-w-0 overflow-hidden rounded-xl border border-border-default bg-surface-card',
        containerClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="min-w-0 overflow-x-auto">
        <table
          {...tableProps}
          aria-busy={loading || undefined}
          className={[
            'w-full min-w-[48rem] border-collapse text-role-body-copy text-text-primary',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {caption !== undefined && caption !== null && (
            <caption className={captionHidden ? 'sr-only' : 'p-4 text-left text-role-section-title'}>
              {caption}
            </caption>
          )}

          <thead className="bg-surface-page">
            <tr className="border-b border-border-default">
              {selectionEnabled && (
                <th
                  scope="col"
                  className="w-12 px-4 py-3 text-left"
                >
                  <TableCheckbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    disabled={selectableIds.length === 0 || loading}
                    aria-label={selectAllLabel}
                    onChange={(event) =>
                      updateVisibleSelection(event.target.checked)
                    }
                  />
                </th>
              )}

              {normalizedColumns.map((column) => {
                const align =
                  alignmentClasses[column.align] ??
                  alignmentClasses.start
                const isSorted = sort?.columnId === column.id
                const SortIcon = isSorted
                  ? sort.direction === 'descending'
                    ? ArrowDown
                    : ArrowUp
                  : ArrowUpDown

                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? isSorted
                          ? sort.direction === 'descending'
                            ? 'descending'
                            : 'ascending'
                          : 'none'
                        : undefined
                    }
                    className={[
                      'px-4 py-3 text-role-table-heading uppercase text-text-secondary',
                      align,
                      column.nowrap && 'whitespace-nowrap',
                      column.className,
                      column.headerClassName,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        aria-label={getSortButtonLabel(column, sort)}
                        disabled={
                          loading ||
                          typeof onSortChange !== 'function'
                        }
                        onClick={() => requestSort(column)}
                        className={[
                          'inline-flex items-center gap-1.5 rounded-sm text-inherit',
                          align === 'center' && 'justify-center',
                          align === 'end' && 'ml-auto justify-end',
                          'hover:text-text-primary',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
                          'disabled:cursor-not-allowed disabled:opacity-50',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span>{column.header}</span>
                        <SortIcon
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}

              {actionsEnabled && (
                <th
                  scope="col"
                  className="w-14 px-4 py-3 text-right text-role-table-heading uppercase text-text-secondary"
                >
                  <span className="sr-only">{rowActionsLabel}</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                {Array.from(
                  { length: normalizedLoadingRowCount },
                  (_, rowIndex) => (
                    <tr
                      key={`loading-row-${rowIndex}`}
                      aria-hidden="true"
                      className="border-b border-border-default last:border-b-0"
                    >
                      {Array.from(
                        { length: totalColumnCount },
                        (_, cellIndex) => (
                          <td
                            key={`loading-cell-${cellIndex}`}
                            className="px-4 py-4"
                          >
                            <span className="block h-4 max-w-32 rounded bg-border-default" />
                          </td>
                        ),
                      )}
                    </tr>
                  ),
                )}
              </>
            ) : rowEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumnCount}
                  className="px-6 py-12 text-center"
                >
                  <div className="text-role-helper text-text-secondary">
                    {emptyState ?? 'No data available.'}
                  </div>
                </td>
              </tr>
            ) : (
              rowEntries.map(({ row, rowId, rowIndex }) => {
                const isSelected =
                  selectionEnabled && selectedIds.has(rowId)
                const selectable =
                  selectionEnabled &&
                  (typeof isRowSelectable !== 'function' ||
                    isRowSelectable(row))

                return (
                  <tr
                    key={rowId}
                    className={[
                      'border-b border-border-default transition-colors last:border-b-0 hover:bg-surface-page',
                      isSelected && 'bg-brand-accent/10',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {selectionEnabled && (
                      <td className="w-12 px-4 py-3">
                        <TableCheckbox
                          checked={isSelected}
                          disabled={!selectable}
                          aria-label={
                            typeof getRowSelectionLabel === 'function'
                              ? getRowSelectionLabel(row)
                              : `Select row ${rowIndex + 1}`
                          }
                          onChange={(event) =>
                            updateRowSelection(
                              rowId,
                              event.target.checked,
                            )
                          }
                        />
                      </td>
                    )}

                    {normalizedColumns.map((column) => {
                      const value = resolveCellValue(column, row)
                      const align =
                        alignmentClasses[column.align] ??
                        alignmentClasses.start

                      return (
                        <td
                          key={column.id}
                          className={[
                            'px-4 py-3 align-middle',
                            align,
                            column.nowrap && 'whitespace-nowrap',
                            column.className,
                            column.cellClassName,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {typeof column.cell === 'function'
                            ? column.cell({
                                value,
                                row,
                                rowId,
                                rowIndex,
                              })
                            : renderCellValue(value)}
                        </td>
                      )
                    })}

                    {actionsEnabled && (
                      <td className="w-14 px-4 py-2 text-right">
                        {renderRowActions({
                          row,
                          rowId,
                          rowIndex,
                        })}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="sr-only" role="status" aria-live="polite">
          {loadingLabel}
        </p>
      )}

      {pagination && (
        <TablePagination
          {...pagination}
          disabled={loading || pagination.disabled}
        />
      )}
    </div>
  )
}

export default Table
