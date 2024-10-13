const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getWhere } = require("./getWhere")
const { select } = require("../../../flCore/server/model/select")

const util = require('util')

const countAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const columns = [["count", "id"]]
    let where = (req.query.where) ? req.query.where.split("|") : []

    const whereParam = {}
    const restriction = (listConfig.where) ? listConfig.where : {}
    for (let propertyId of Object.keys(restriction)) whereParam[propertyId] = restriction[propertyId]
    for (let param of (where != null) ? where.split("|") : []) {
        const keyValue = param.split(":")
        const key = keyValue[0], value = keyValue[1]
        whereParam[key] = value
        if (!propertyDefs[key]) propertyDefs[key] = {}
    }

    /**
     * Properties definition
     */
    let viewConfig = context.config[`${entity}/view/default`]
    const propertyDefs = viewConfig.properties
    const properties = await getProperties(db, context, entity, null, propertyDefs)

    where = getWhere(properties, whereParam)
    const model = context.config[`${entity}/model`]
    const data = (where) ? (await db.execute(select(context, entity, columns, where, null, null, model)))[0] : []

    return { "status": "ok", "data": data }
}

module.exports = {
    countAction
}