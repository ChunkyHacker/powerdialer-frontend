import Pagination from './Pagination.jsx'

function TablePagination({
  className = '',
  'aria-label': ariaLabel = 'Table pagination',
  ...paginationProps
}) {
  return (
    <Pagination
      {...paginationProps}
      aria-label={ariaLabel}
      className={[
        'border-t border-border-default bg-surface-card',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export default TablePagination
