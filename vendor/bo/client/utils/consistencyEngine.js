/**
 * Detects duplicate slots and resource conflicts from a flat list containing start_date, start_time and duration, using rules config.
 * @param {Object} params
 * @param {Array<Object>} params.rows - Rows already sorted by start_date, start_time.
 * @param {Object} params.rules - Consistency rules, including conflictResources config.
 * @returns {Map<number, Object>} issuesById - Map of row id to { [resourceType]: conflictingIds[] }.
 */
function computeConsistencyIssues({ rows, rules })
{
    const issuesById = new Map()

	// Detect resource conflicts for each resource field specified in the rules
    for (const [resourceType, resource] of Object.entries(rules.conflictResources)) {
        const conflicts = detectResourceConflicts(rows, resource.fields)
        for (const { idA, idB } of conflicts) {
            addConflict(issuesById, idA, resourceType, idB)
            addConflict(issuesById, idB, resourceType, idA)
        }
    }

    return issuesById
}

function detectResourceConflicts(rows, fields) {
    const conflicts = []
    const grouped = new Map()

	// Group rows by resource ID and convert them to intervals
    for (const row of rows) {
        if (fields.some(f => row[f] == null || row[f] === "" || row[f] == 0)) continue
        const resourceKey = fields.map(f => row[f]).join("_")
        if (!grouped.has(resourceKey)) grouped.set(resourceKey, [])
        grouped.get(resourceKey).push(toInterval(row))
    }

	// For each group of intervals, check for overlaps and record conflicts
    for (const [resourceKey, intervals] of grouped) {
        for (let i = 0; i < intervals.length; i++) {
            for (let j = i + 1; j < intervals.length; j++) {
                if (intervals[j].start >= intervals[i].end) break
                conflicts.push({ idA: intervals[i].id, idB: intervals[j].id })
            }
        }
    }
    return conflicts
}

function toInterval(row) {
    const start = new Date(`${row.start_date}T${row.start_time}`)
    const end = new Date(start.getTime() + row.duration * 60000)
    return { id: row.id, start, end, row }
}

function addConflict(issuesById, id, resourceType, conflictingId) {
    if (!issuesById.has(id)) issuesById.set(id, {})
    const issues = issuesById.get(id)
    if (!issues[resourceType]) issues[resourceType] = []
    issues[resourceType].push(conflictingId)
}

export { computeConsistencyIssues }