const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const getAction = async ({ req }, context, { sql, logger }) => 
{
    const entity = assert.notEmpty(req.params, "entity")

    const columns = (req.query.columns) ? req.query.columns.split(",") : []
    const id = req.params.id
    if (!columns.includes("id")) {
        columns.push("id")
    }
    logger && logger.debug(util.inspect({columns}))

    const whereParam = ((req.query.where) ? req.query.where.split("|") : []).map( x => x.split(":"))
    const where = {}
    for (const [key, value] of whereParam) where[key] = value.split(",")
    if (id) where.id = id
    logger && logger.debug(util.inspect({where}))

    const orderParam = (req.query.order) ? req.query.order.split(",") : []
    const order = {}
    for (const key of orderParam) {
        const column = (key.charAt(0) === "-") ? key.substring(1) : key     
        const direction = (key.charAt(0) === "-") ? "DESC" : "ASC"     
        order[column] = direction
    }
    logger && logger.debug(util.inspect({order}))

    const limit = (req.query.limit) ? req.query.limit : 1000
    logger && logger.debug(util.inspect({limit}))

    const vectors = (req.query.vectors) ? req.query.vectors.split(",") : []
    logger && logger.debug(util.inspect({vectors}))

    try {
        if (vectors) {
            const result = {}
            result.rows = await sql.execute({ context, type: "select", entity, columns, where, order, limit })
            result.vectors = await sql.execute({context, type: "vectors", entity, vectors})
            return [200, result, "application/json"]
        }
        else {
            const result = await sql.execute({ context, type: "select", entity, columns, where, order, limit, vectors })
            return [200, result, "application/json"]
        }
    }
    catch (err) {
        console.log(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = {
    getAction
}