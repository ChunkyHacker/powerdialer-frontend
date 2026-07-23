import { Link, useMatches } from 'react-router'

function Breadcrumbs() {
  const breadcrumbs = useMatches()
    .filter((match) => match.handle?.breadcrumb)
    .map((match) => ({
      label: match.handle.breadcrumb,
      path: match.pathname,
    }))

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-role-helper mb-4 flex items-center gap-2 text-text-secondary">
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrentPage = index === breadcrumbs.length - 1

          return (
            <li key={`${breadcrumb.path}-${breadcrumb.label}`}>
              {isCurrentPage ? (
                <span aria-current="page" className="text-text-primary">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="rounded-sm hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                >
                  {breadcrumb.label}
                </Link>
              )}
              {!isCurrentPage && (
                <span aria-hidden="true" className="ml-2">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
