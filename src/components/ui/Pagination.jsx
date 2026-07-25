import Button from './Button.jsx'

function normalizePositiveInteger(value, fallback) {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0
    ? Math.floor(value)
    : fallback
}

function normalizeTotalItems(value) {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value > 0
    ? Math.floor(value)
    : 0
}

function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Pagination',
  ...navProps
}) {
  const normalizedPage = normalizePositiveInteger(page, 1)
  const normalizedPageSize = normalizePositiveInteger(pageSize, 1)
  const normalizedTotalItems = normalizeTotalItems(totalItems)
  const totalPages = Math.max(
    1,
    Math.ceil(normalizedTotalItems / normalizedPageSize),
  )
  const displayPage = Math.min(normalizedPage, totalPages)
  const rangeStart =
    normalizedTotalItems === 0
      ? 0
      : (displayPage - 1) * normalizedPageSize + 1
  const rangeEnd =
    normalizedTotalItems === 0
      ? 0
      : Math.min(
          displayPage * normalizedPageSize,
          normalizedTotalItems,
        )
  const pageOutOfRange = normalizedPage > totalPages
  const controlsDisabled =
    disabled ||
    normalizedTotalItems === 0 ||
    typeof onPageChange !== 'function'
  const previousDisabled =
    controlsDisabled || normalizedPage <= 1 || pageOutOfRange
  const nextDisabled =
    controlsDisabled ||
    normalizedPage >= totalPages ||
    pageOutOfRange

  function requestPage(nextPage) {
    if (
      controlsDisabled ||
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return
    }

    onPageChange(nextPage)
  }

  return (
    <nav
      {...navProps}
      aria-label={ariaLabel}
      className={[
        'flex flex-wrap items-center justify-between gap-3 px-4 py-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-role-helper text-text-secondary">
        Showing {rangeStart}
        {normalizedTotalItems > 0 && `–${rangeEnd}`} of{' '}
        {normalizedTotalItems} results
      </p>

      <div className="flex items-center gap-3">
        <p
          className="text-role-helper text-text-secondary"
          aria-live="polite"
        >
          Page {displayPage} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={previousDisabled}
            aria-label="Go to previous page"
            onClick={() => requestPage(normalizedPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={nextDisabled}
            aria-label="Go to next page"
            onClick={() => requestPage(normalizedPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Pagination
