const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")

const { select } = require("../model/select")

const getAction = async ({ req }, context, { db }) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const model = context.config[`${entity}/model`]

    const columns = (req.query.columns) ? req.query.columns.split(",") : []
    const id = req.params.id
    if (id && !columns.includes("id")) columns.push("id")

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

    const debug = req.query.debug

    const request = select(context, entity, columns, where, order, limit, model)
    if (debug) return request

    const connection = await db.getConnection()
    try {
        const result = (await db.execute(request))[0]
        connection.release()
        return JSON.stringify(result)
    }
    catch {
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    getAction
}