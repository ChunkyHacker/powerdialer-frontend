function normalizeLeadSearch(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('en-US')
}

export function filterLeads(leads, agents, filters) {
  const query = normalizeLeadSearch(filters.search)
  const agentMap = new Map(agents.map((agent) => [agent.id, agent]))

  return leads.filter((lead) => {
    const agentName = agentMap.get(lead.assignedAgentId)?.name ?? ''
    const matchesSearch =
      !query ||
      [lead.name, lead.jobTitle, lead.company, lead.phone, agentName].some(
        (value) => normalizeLeadSearch(value).includes(query),
      )
    const matchesStatus =
      filters.status === 'all' || lead.status === filters.status
    const matchesPriority =
      filters.priority === 'all' || lead.priority === filters.priority
    const matchesAgent =
      filters.agentId === 'all' ||
      lead.assignedAgentId === filters.agentId

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesAgent
    )
  })
}

export function getLeadTotalPages(totalItems, pageSize) {
  return Math.max(1, Math.ceil(totalItems / pageSize))
}

export function getSafeLeadPage(page, totalPages) {
  return Math.max(1, Math.min(page, totalPages))
}

export function paginateLeads(leads, page, pageSize) {
  const startIndex = (page - 1) * pageSize
  return leads.slice(startIndex, startIndex + pageSize)
}
