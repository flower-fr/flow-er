const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")
const { getMeasure } = require("./getMeasure")
const { getDistribution } = require("./getDistribution")

const listAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const where = (req.query.where) ? req.query.where : null
    const order = (req.query.order) ? req.query.order : null
    const limit = (req.query.limit) ? req.query.limit : 1000

    const whereParam = (where != null) ? where.split("|") : []

    let listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    const propertyDefs = listConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)

    /**
     * List of DB columns to retrieve
     */
    let columns = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (property.type != "tag") columns.push(propertyId)
    }
    columns.push("id")

    const propertyList = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (property.type != "tags") propertyList.push(propertyId)
    }

    let major = false
    if (order != null) {
        major = order.split(",")[0]
        if (major.charAt(0) == "-") major = major.substring(1)
    }

    if (!columns) columns = propertyList
    columns = columns.concat(["id"])

    const rows = await getList(db, context, entity, view, columns, properties, whereParam, order, limit)
    return {
        rows : rows, 
        limit: limit, 
        config: listConfig,
        properties: properties 
    }
}

module.exports = {
    listAction,
}