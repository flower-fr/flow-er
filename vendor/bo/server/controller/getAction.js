const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")

const util = require('util')

const getAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.params.view) ? req.params.view : "default"
    const where = (req.query.where) ? req.query.where : null
    const order = (req.query.order) ? req.query.order : "-id"
    const limit = (req.query.limit) ? req.query.limit : 1000

    const whereParam = (where != null) ? where.split("|") : []

    /**
     * Properties definition
     */
    let viewConfig = context.config[`${entity}/view/${view}`]
    const propertyDefs = viewConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)
    
    /**
     * List of DB columns to retrieve
     */
    const columns = Object.keys(context.config[`${entity}/view/${view}`].properties).concat("id")
    
    const data = await getList(db, context, entity, view, columns, properties, whereParam, order, limit)

    const result = []
    for (let row of data) {
        const obj = {}
        for (let key of Object.keys(row)) {
            if (row[key] != null) obj[key] = row[key]
        }
        result.push(obj)
    }
    return { "status": "ok", "data": result, "properties": properties }
}

module.exports = {
    getAction
}