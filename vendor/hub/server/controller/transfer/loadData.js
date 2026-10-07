const { retrieveIdsByIdentifiers, codeIdentifierToId } = require("../idsByIdentifiers")
const util = require("util")
const { saveData } = require("../saveData")

const loadData = async (context, sql, data, logger) =>
{
    logger && logger.debug(`loadData checkpoint 1 : data = ${util.inspect(data, {colors: true, depth: null})}`)
    // For each table of each data upsert row with identifier as a key
    for (const [entity, value] of Object.entries(data)) {
        logger && logger.debug(`loadData checkpoint 2 : entity = ${entity}`)
        logger && logger.debug(`loadData checkpoint 2 : value = ${util.inspect(value, {colors: true, depth: null})}`)
        const viewConfig = context.config[`${ entity }/transfer/default`]

        // Create a dictionary of foreign keys by foreign transportable identifiers for each entity, main or foreign
        logger && logger.debug(`loadData checkpoint 3 : entity = ${entity}`)
        const foreignIds = await retrieveIdsByIdentifiers(context, sql, viewConfig, logger)
        logger && logger.debug(`loadData checkpoint 3 : foreignIds = ${util.inspect(foreignIds, {colors: true, depth: null})}`)

        // For each row, if identifier already exists, add the corresponding id into the form
        for (let row of value.rows) {
            row = await codeIdentifierToId(context, row, viewConfig, foreignIds)
            logger && logger.debug(`loadData checkpoint 4 : row = ${util.inspect(row, {colors: true, depth: null})}`)
            // Save the row
            await saveData(context, entity, [row], sql)
            // if (row.id) {
            //     await sql.execute( { context, type: "update", entity, data: row, ids: [row.id] } )
            // } else {
            //     await sql.execute( { context, type: "insert", entity, data: row } )
            // }
        }
        logger && logger.debug(`loadData checkpoint 5 : form = ${value.rows}`)
    }
}

module.exports = {
    loadData
}