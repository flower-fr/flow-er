/**
 * @param {Array} xlsxRows - Rows read from the uploaded XLSX file, keyed by column header.
 * @param {Object} config - Import config.
 * @param {Array} dbRows - Rows from the database currently in scope, keyed by DB property name (must include `id` and `identifier`).
 * @returns {{ toUpdate: Array<Object>, rejected: Record<string, Object> }}
 */
const importXlsx = (xlsxRows, config, dbRows) => {
    const identifierHeader = config.properties.identifier.header
    const dbRowsByIdentifier = new Map(dbRows.map(dbRow => [dbRow.identifier, dbRow]))

    const toUpdate = []
    const rejected = {}

    for (const xlsxRow of xlsxRows) {
        const identifier = xlsxRow[identifierHeader]
        const dbRow = dbRowsByIdentifier.get(identifier)

        if (!dbRow) {
            rejected[identifier ?? "(missing identifier)"] = { status: "notInScope" }
            continue
        }

        const conflicts = {}
        const changes = { id: dbRow.id }

        for (const [dataId, definition] of Object.entries(config.properties)) {
            if (dataId === "identifier" || !definition.property) continue //

            // Check if the loaded value is empty
            const loadedValue = xlsxRow[definition.header]
            if (definition.required && isEmpty(loadedValue)) {
                conflicts[dataId] = { status: "missingRequiredData" }
                continue
            }

            // Check if the current value in the database is different from the loaded value
            const currentValue = dbRow[definition.property]
            if (!isEmpty(currentValue)) {
                if (String(currentValue) !== String(loadedValue ?? "")) {
                    conflicts[dataId] = { current: currentValue, loaded: loadedValue }
                }
                continue
            }

            if (!isEmpty(loadedValue)) changes[definition.property] = toDbValue(loadedValue)
        }

        if (Object.keys(conflicts).length > 0) {
            rejected[identifier] = { status: "inconsistentData", ...conflicts }
            continue
        }

        toUpdate.push(changes)
    }

    return { toUpdate, rejected }
}

/**
 * Check whether a value should be treated as "not provided" (empty cell, blank string...).
 * @param {unknown} value
 * @returns {boolean}
 */
const isEmpty = (value) => {
    return value === undefined || value === null || value === ""
}

/**
 * Converts a value to a format suitable for database storage.
 */
const toDbValue = (value) => {
    if (isEmpty(value)) return value
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return String(value)
}

export default importXlsx