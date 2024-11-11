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
    
    let listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    
    const propertyDefs = { ...listConfig.properties }

    const whereParam = {}
    const restriction = (listConfig.where) ? listConfig.where : {}
    for (let propertyId of Object.keys(restriction)) whereParam[propertyId] = restriction[propertyId]
    for (let param of (where != null) ? where.split("|") : []) {
        const keyValue = param.split(":")
        const key = keyValue[0], value = keyValue[1]
        whereParam[key] = value
        if (!propertyDefs[key]) propertyDefs[key] = {}
    }

    for (let propertyId of ((order != null) ? order.split(",") : [])) {
        if (propertyId[0] == "-") propertyId = propertyId.substring(1)
        if (!propertyDefs[propertyId]) propertyDefs[propertyId] = {}
    }

    const properties = await getProperties(db, context, entity, view, propertyDefs)
    /**
     * List of DB columns to retrieve
     */
    let columns = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (property.type != "tag") columns.push(propertyId)
    }

    if (listConfig.checkData) {
        for (let propertyId of listConfig.checkData) columns.push(propertyId)
    }

    if (listConfig.hidden) {
        for (let propertyId of Object.keys(listConfig.hidden)) columns.push(propertyId)
    }

    columns.push("id")

    let major = false
    if (order != null) {
        major = order.split(",")[0]
        if (major.charAt(0) == "-") major = major.substring(1)
    }
    
    const rows = await getList(db, context, entity, view, columns, properties, whereParam, order, limit)
    return { rows, config: listConfig, properties, where, order, limit }
}

module.exports = {
    listAction,
}