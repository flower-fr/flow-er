const { getWhere } = require("./getWhere")
const { select } = require("../../../flCore/server/model/select")
const { getProperties } = require("./getProperties")

const getMeasure = async (db, context, entity, view, column, whereParam) => {

    let listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    const propertyDefs = listConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)

    const where = getWhere(properties, whereParam)

    const model = context.config[`${entity}/model`]
    const columns = [["count", "id"]]
    if (column) columns.push(["sum", column])
    const rows = (where) ? (await db.execute(select(context, entity, columns, where, null, null, model)))[0] : []
    return rows[0]
}

module.exports = {
    getMeasure
}