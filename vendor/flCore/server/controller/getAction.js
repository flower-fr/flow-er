const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const getAction = async ({ req }, context, { sql, logger }) => 
{
    const entity = assert.notEmpty(req.params, "entity")

    const columns = (req.query.columns) ? req.query.columns.split(",") : []
    const id = req.params.id
    if (id && !columns.includes("id")) columns.push("id")
    logger && logger.debug(`columns: ${util.inspect(columns, {colors: true, depth: null})}`)

    const whereParam = ((req.query.where) ? req.query.where.split("|") : []).map( x => x.split(":"))
    const where = {}
    for (const [key, value] of whereParam) where[key] = value.split(",")
    if (id) where.id = id

    const orderParam = (req.query.order) ? req.query.order.split(",") : []
    const order = {}
    for (const key of orderParam) {
        const column = (key.charAt(0) === "-") ? key.substring(1) : key     
        const direction = (key.charAt(0) === "-") ? "DESC" : "ASC"     
        order[column] = direction
    }

    const limit = (req.query.limit) ? req.query.limit : 1000

    try {
        const result = await sql.execute({ context, type: "select", entity, columns, where, order, limit })
        return JSON.stringify(result)
    }
    catch {
        throw throwBadRequestError()
    }
}

module.exports = {
    getAction
}