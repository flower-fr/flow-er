const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")
const { getMeasure } = require("./getMeasure")
const { getDistribution } = require("./getDistribution")

const util = require('util')

const searchAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const where = (req.query.where) ? req.query.where : null
    const order = (req.query.order) ? req.query.order : null
    const limit = (req.query.limit) ? req.query.limit : 1000

    const whereParam = (where != null) ? where.split("|") : []

    /**
     * Properties definition
     */
    let listConfig = context.config[`${entity}/search/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/search/default`]
    if (!listConfig) listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    const propertyDefs = listConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)
    
    let major = false
    if (order != null) {
        major = order.split(",")[0]
        if (major.charAt(0) == "-") major = major.substring(1)
    }

    /**
     * Measure the data as a tuplet [count, sum]
     */
    const measure = await getMeasure(db, context, entity, view, (listConfig.measure) ? listConfig.measure : false, whereParam)

    /**
     * Retrieve distributions of the data
     */
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        property.distribution = await getDistribution(db, context, entity, view, propertyId, properties, whereParam)
    }

    const result = {
        rows: measure,
        config: listConfig,
        properties: properties
    }
    return result
}

module.exports = {
    searchAction,
}