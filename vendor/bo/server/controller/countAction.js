const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getWhere } = require("./getWhere")
const { select } = require("../../../flCore/server/model/select")

const util = require('util')

const countAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const columns = [["count", "id"]]
    const whereParam = (req.query.where) ? req.query.where.split("|") : []

    /**
     * Properties definition
     */
    let viewConfig = context.config[`${entity}/view/default`]
    const propertyDefs = viewConfig.properties
    const properties = await getProperties(db, context, entity, null, propertyDefs, whereParam)

    const where = getWhere(properties, whereParam)
    const model = context.config[`${entity}/model`]
    const data = (where) ? (await db.execute(select(context, entity, columns, where, null, null, model)))[0] : []

    return { "status": "ok", "data": data }
}

module.exports = {
    countAction
}