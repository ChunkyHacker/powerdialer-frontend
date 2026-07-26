import Skeleton from './Skeleton.jsx'

const alignmentClasses = {
  start: '',
  center: 'mx-auto',
  end: 'ml-auto',
}

function normalizeDimension(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim()
    return normalizedValue || undefined
  }

  return undefined
}

function SkeletonTableRow({
  columns = [],
  selection = false,
  actions = false,
  cellHeight = '1rem',
  className = '',
  cellClassName = '',
  selectionCellClassName = '',
  actionCellClassName = '',
  ref,
  ...rowProps
}) {
  const normalizedColumns = Array.isArray(columns)
    ? columns.map((column) =>
        column && typeof column === 'object' ? column : {},
      )
    : []
  const normalizedCellHeight =
    normalizeDimension(cellHeight) ?? '1rem'

  return (
    <tr
      {...rowProps}
      ref={ref}
      aria-hidden="true"
      className={[
        'border-b border-border-default last:border-b-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {selection && (
        <td
          className={[
            'w-12 px-4 py-3 align-middle',
            cellClassName,
            selectionCellClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Skeleton
            width="1rem"
            height="1rem"
            radius="sm"
          />
        </td>
      )}

      {normalizedColumns.map((column, index) => {
        const selectedAlignment =
          alignmentClasses[column.align] ?? alignmentClasses.start
        const selectedWidth =
          normalizeDimension(column.width) ??
          (index === normalizedColumns.length - 1 ? '60%' : '80%')

        return (
          <td
            key={`skeleton-table-cell-${index}`}
            className={[
              'px-4 py-3 align-middle',
              cellClassName,
              column.className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Skeleton
              width={selectedWidth}
              height={normalizedCellHeight}
              className={[
                'max-w-full',
                selectedAlignment,
                column.skeletonClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </td>
        )
      })}

      {actions && (
        <td
          className={[
            'w-14 px-4 py-2 align-middle',
            cellClassName,
            actionCellClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Skeleton
            width="1.5rem"
            height="1.5rem"
            radius="md"
            className="ml-auto"
          />
        </td>
      )}
    </tr>
  )
}

export default SkeletonTableRow
