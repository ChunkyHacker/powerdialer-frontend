function normalizeSearchValue(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('en-US')
}

function createOwnerMap(owners) {
  return new Map(owners.map((owner) => [owner.id, owner]))
}

export function filterCampaigns(campaigns, owners, filters) {
  const query = normalizeSearchValue(filters.search)
  const ownerMap = createOwnerMap(owners)

  return campaigns.filter((campaign) => {
    const ownerName = ownerMap.get(campaign.ownerId)?.name ?? ''
    const matchesSearch =
      !query ||
      normalizeSearchValue(campaign.name).includes(query) ||
      normalizeSearchValue(ownerName).includes(query)
    const matchesStatus =
      filters.status === 'all' || campaign.status === filters.status
    const matchesOwner =
      filters.ownerId === 'all' || campaign.ownerId === filters.ownerId
    const matchesStartBoundary =
      !filters.dateRange.start ||
      campaign.startDate >= filters.dateRange.start
    const matchesEndBoundary =
      !filters.dateRange.end ||
      campaign.startDate <= filters.dateRange.end

    return (
      matchesSearch &&
      matchesStatus &&
      matchesOwner &&
      matchesStartBoundary &&
      matchesEndBoundary
    )
  })
}

export function getTotalPages(totalItems, pageSize) {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function getSafePage(page, totalPages) {
  return Math.max(1, Math.min(page, totalPages))
}

export function paginateCampaigns(campaigns, page, pageSize) {
  const startIndex = (page - 1) * pageSize
  return campaigns.slice(startIndex, startIndex + pageSize)
}
