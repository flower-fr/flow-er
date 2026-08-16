const util = require("util")

const ensure = async ({ req, step }, context, rows, { sql, logger }) =>
{
    const { entity, foreignKey, columns, identifier, match } = step
    logger && logger.debug(util.inspect({ step: "ensure", entity, foreignKey, columns, identifier, match }, { depth: null, colors: true }))

    const data = req.body.rows

    /**
     * Find out the missing data by identifier 
     */
    const existingIdentifiers = Array.from(data.reduce((set, row) => (row[match]) ? set.add(row[match]) : set, new Set()))
    const model = context.config[`${ entity }/model`], where = {}
    // where[identifier] = ["in"].concat(existingIdentifiers)
    const cursor = (existingIdentifiers.length > 0) ? await sql.execute({ context, type: "select", entity, columns/*, where*/, limit: null, model }) : []

    const addedRows = {}
    for (const row of data) {
        if (row[match] && !cursor.find(cursorRow => cursorRow[identifier] === row[match])) {
            addedRows[row[match]] = row[match]
        }
    }

    /**
     * Insert the missing data
     */
    for (const value of Object.keys(addedRows)) {
        const data = {}
        data[identifier] = value
        addedRows[value] = await sql.execute({ context, type: "insert", entity: entity, data, params: [] })
    }

    /**
     * Update the data with the inserted row ids
     */
    for (const row of data) {
        if (!row[foreignKey]) row[foreignKey] = addedRows[row[match]]
    }

    logger && logger.debug(util.inspect({ data }, { depth: null, colors: true }))
    return { status: "ok", stored: Object.keys(addedRows).map(([key, id]) => ({ id: id, [identifier]: key })) }
}

module.exports = ensure