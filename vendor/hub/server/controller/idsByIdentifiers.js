const util = require("util")

/**
 * Create a dictionary of foreignKeys by foreign transportable identifiers for each foreignEntity
 */
const retrieveIdsByIdentifiers = async (context, sql, viewConfig, logger) =>
{
    const foreignIds = {}
    logger && logger.debug(`retrieveIdsByIdentifiers : viewConfig = ${util.inspect(viewConfig, {colors: true, depth: null})}`)
    for (const propertyDef of Object.values(viewConfig.properties)) {
        if (propertyDef.type && ["primary", "foreignKey", "foreignKeys"].includes(propertyDef.type)) {
            if (!foreignIds[propertyDef.entity]) {
                foreignIds[propertyDef.entity] = {}
                const rows = await sql.execute({ context, type: "select", entity: propertyDef.entity, columns: ["id", "identifier"] })
                for (const row of rows) foreignIds[propertyDef.entity][row.identifier] = row.id
            }
        }
    }
    return foreignIds
}

/**
 * Code primary or foreign keys from transportable identifier to local id 
 */
const codeIdentifierToId = async (context, row, viewConfig, foreignIds) =>
{
    const result = {}
    for (const [propertyId, propertyDef] of Object.entries(viewConfig.properties)) {
        let value
        if (propertyDef.type && ["primary", "foreignKey"].includes(propertyDef.type)) {
            value = foreignIds[propertyDef.entity][row[propertyId]]
        } else if (propertyDef.type && propertyDef.type === "foreignKeys") {
            value = []
            for (const id of row[propertyId]) {
                value.push(foreignIds[propertyDef.entity][id])
            }
        } else value = row[propertyId]
        result[propertyId] = value
    }
    return result
}

module.exports = {
    retrieveIdsByIdentifiers,
    codeIdentifierToId
}