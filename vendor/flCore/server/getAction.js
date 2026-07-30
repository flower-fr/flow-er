const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const getAction = async ({ req }, context, { sql, logger }) => 
{
    const entity = assert.notEmpty(req.params, "entity")

    const columns = (req.query.columns) ? req.query.columns.split(",").map(col => {
        const parts = col.split(":")
        return parts.length > 1 ? [parts[0], parts[1]] : parts[0]
    }) : []

    const id = req.params.id
    const hasAggregator = columns.some(c => Array.isArray(c))
    if (!hasAggregator && !columns.includes("id")) {
        columns.push("id")
    }
    logger && logger.debug(util.inspect({columns}, {depth: null, colors: true}))

    const whereParam = ((req.query.where) ? req.query.where.split("|") : []).map( x => { const [key, ...value] = x.split(":"); return [key, value.join(":")] })

    const where = {}
    for (const [key, value] of whereParam) where[key] = value.split(",")
    if (id) where.id = id
    logger && logger.debug(util.inspect({where}, {depth: null, colors: true}))

    const tags = req.query.tags ? req.query.tags.split(",") : undefined
    logger && logger.debug(util.inspect({tags}, {depth: null, colors: true}))

    const orderParam = (req.query.order) ? req.query.order.split(",") : []
    const order = {}
    for (const key of orderParam) {
        const column = (key.charAt(0) === "-") ? key.substring(1) : key     
        const direction = (key.charAt(0) === "-") ? "DESC" : "ASC"     
        order[column] = direction
    }
    logger && logger.debug(util.inspect({order}, {depth: null, colors: true}))

    const limit = (req.query.limit) ? req.query.limit : 1000
    logger && logger.debug(util.inspect({limit}, {depth: null, colors: true}))

    const vectors = (req.query.vectors) ? req.query.vectors.split(",") : []
    logger && logger.debug(util.inspect({vectors}, {depth: null, colors: true}))

    try {
        if (vectors) {
            const result = {}
            result.rows = await sql.execute({ context, type: "select", entity, columns, where, tags, order, limit })
            result.vectors = await sql.execute({context, type: "vectors", entity, vectors})
            logger && logger.debug(util.inspect({result}, {depth: null, colors: true}))
            return [200, result, "application/json"]
        }
        else { // Deprecated
            const result = await sql.execute({ context, type: "select", entity, columns, where, tags, order, limit, vectors })
            return [200, result, "application/json"]
        }
    }
    catch (err) {
        console.log(err)
        throw throwBadRequestError()
    }
}

module.exports = {
    getAction
}