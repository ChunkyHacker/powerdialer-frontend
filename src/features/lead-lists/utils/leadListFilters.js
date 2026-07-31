export function normalizeLeadListSearch(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('en-US')
}

export function filterLeadLists(leadLists, filters) {
  const query = normalizeLeadListSearch(filters.search)

  return leadLists.filter((leadList) => {
    const matchesSearch =
      !query ||
      normalizeLeadListSearch(leadList.name).includes(query) ||
      normalizeLeadListSearch(leadList.fileName).includes(query) ||
      normalizeLeadListSearch(leadList.source).includes(query)
    const matchesStatus =
      filters.status === 'all' ||
      leadList.status === filters.status

    return matchesSearch && matchesStatus
  })
}

export function getLeadListTotalPages(totalItems, pageSize) {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function getSafeLeadListPage(page, totalPages) {
  return Math.max(1, Math.min(page, totalPages))
}

export function paginateLeadLists(leadLists, page, pageSize) {
  const startIndex = (page - 1) * pageSize
  return leadLists.slice(startIndex, startIndex + pageSize)
}
