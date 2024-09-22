const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")

const apiAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const where = (req.query.where) ? req.query.where : null
    const order = (req.query.order) ? req.query.order : null
    let columns = Object.keys(context.config[`${entity}/v1/${view}`].properties)

    const whereParam = (where != null) ? where.split("|") : []

    let orderArray = null
    if (order != null) {
        orderArray = {}
        for (let orderer of order.split(",")) {
            let propertyId, direction
            if (orderer[0] == "-") {
                propertyId = orderer.substring(1)
                direction = "DESC"
            }
            else {
                propertyId = orderer
                direction = "ASC"
            }
            orderArray[propertyId] = direction    
        }    
    }

    let apiConfig = context.config[`${entity}/v1/${view}`]
    if (!apiConfig) apiConfig = context.config[`${entity}/v1`]
    const propertyDefs = apiConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)
    const propertyList = []
    for (let propertyId of properties) {
        const property = properties[propertyId]
        if (property.type != "tags") propertyList.push(propertyId)
    }

    if (!columns) columns = propertyList
    columns = columns.concat(["id"])

    const data = await getList(db, context, entity, view, columns, properties, whereParam, order)

    return JSON.stringify(data)
}

module.exports = {
    apiAction
}