/**
 * @param {Array} xlsxRows - Rows read from the uploaded XLSX file, keyed by column header.
 * @param {Object} config - Import config.
 * @param {Array} dbRows - Rows from the database currently in scope, keyed by DB property name (must include `id` and `identifier`).
 * @returns {{ toUpdate: Array<Object>, rejected: Record<string, Object> }}
 */
const importXlsx = (xlsxRows, config, dbRows) => {
    const identifierHeader = config.properties.identifier?.header
    const dbRowsByIdentifier = new Map(dbRows.map(dbRow => [dbRow.identifier, dbRow]))

    const toUpdate = []
    const rejected = {}

    for (const xlsxRow of xlsxRows) {
        const identifier = identifierHeader ?? xlsxRow[identifierHeader]
        const dbRow = dbRowsByIdentifier.get(identifier)

        if (identifierHeader && !dbRow) {
            rejected[identifier ?? "(missing identifier)"] = { status: "notInScope" }
            continue
        }

        const conflicts = {}
        const changes = {}
        if (identifierHeader) changes.id = dbRow.id

        for (const [dataId, definition] of Object.entries(config.properties)) {
console.log({ dataId, definition })
            if (dataId === "identifier" || !definition.property) continue //

            // Check if the loaded value is empty
            let loadedValue = xlsxRow[definition.header]
            if (definition.required && isEmpty(loadedValue)) {
                conflicts[dataId] = { status: "missingRequiredData" }
                continue
            }

            if (!isEmpty(loadedValue) && definition.type === "date" && definition.format === "dd/mm/yyyy HH:mm:ss") {
                const dateString = "29/10/2004 00:00:00"

                // 1. Séparer la date et l'heure
                const [datePart, timePart] = dateString.split(" ")

                // 2. Découper le jour, le mois et l'année
                const [day, month, year] = datePart.split("/")

                // 3. Recomposer au format SQL (AAAA-MM-JJ HH:mm:ss)
                loadedValue = `${year}-${month}-${day}`
            }

            // Check if the current value in the database is different from the loaded value
            let currentValue
            if (identifierHeader) {
                currentValue = dbRow[definition.property]
                if (!isEmpty(currentValue)) {
                    if (String(currentValue) !== String(loadedValue ?? "")) {
                        conflicts[dataId] = { current: currentValue, loaded: loadedValue }
                    }
                    continue
                }
            }

            if (!isEmpty(loadedValue)) changes[definition.property] = toDbValue(loadedValue, definition)
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
const toDbValue = (value, definition) => {
    if (isEmpty(value)) return value
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    if (definition.mapping) return Object.entries(definition.mapping).find(([target, source]) => (value === source) ? target : false)
    return String(value)
}

export default importXlsx