const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")

const detailTabAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"
    const whereParam = (req.query.where) ? req.query.where.split("|") : []
    let order = (req.query.order) ? req.query.order : null
    const limit = (req.query.limit) ? req.query.limit : 1000

    const where = {}
    for (let pair of whereParam) {
        pair = pair.split(":")
        const key = pair[0], value = pair[1].split(",")
        where[key] = value
    }
    if (id) where.id = id

    let detailTabConfig = context.config[`${entity}/detailTab/${view}`]
    if (!detailTabConfig) detailTabConfig = context.config[`${entity}/detailTab/default`]

    const data = { id, where, order, limit }
    for (const [key, value] of Object.entries(where)) data[key] = value
    for (let entityId of Object.keys(detailTabConfig.data)) {

        const dataConfig = detailTabConfig.data[entityId]

        const whereDef = dataConfig.where
        const subWhere = {}
        for (let key of Object.keys(whereDef)) {
            if (where[key] && where[key] != 0) {
                subWhere[whereDef[key]] = where[key]
            }
        }

        data[entityId] = {}

        const propertyDefs = dataConfig.properties
        const properties = await getProperties(db, context, entityId, view, propertyDefs, where)
        data[entityId].properties = properties    

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
        
        let defaultOrder = order
        if (order == null) {
            defaultOrder = (dataConfig.order) ? dataConfig.order : "-touched_at"
            data.order = defaultOrder
        }
        major = defaultOrder.split(",")[0]
        if (major.charAt(0) == "-") major = major.substring(1)
    
        if (!columns) columns = propertyList
        columns = columns.concat(["id"])

        let rows
        if (Object.keys(subWhere).length > 0) {
            rows = await getList(db, context, entityId, columns, properties, subWhere, order, limit)
        }
        else rows = []
        data[entityId].rows = rows        
    }

    return { data, detailTabConfig }
}

module.exports = {
    detailTabAction,
}