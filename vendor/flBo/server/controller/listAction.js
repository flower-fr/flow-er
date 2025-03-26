const moment = require("moment")

const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")

const listAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const where = (req.query.where) ? req.query.where : null
    const order = (req.query.order) ? req.query.order : "-touched_by"
    const limit = (req.query.limit) ? req.query.limit : 1000
    
    let listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    
    const propertyDefs = { ...listConfig.properties }

    const whereParam = {}
    let restriction = (listConfig.where) ? listConfig.where : {}
    for (let propertyId of Object.keys(restriction)) whereParam[propertyId] = restriction[propertyId]
    for (let param of (where != null) ? where.split("|") : []) {
        const keyValue = param.split(":")
        const key = keyValue[0], value = keyValue[1]
        whereParam[key] = value.split(",")
        //if (!propertyDefs[key]) propertyDefs[key] = {}
    }
    if (Object.values(whereParam).length == 0) {
        restriction = (listConfig.defaultWhere) ? listConfig.defaultWhere : {}
        for (let propertyId of Object.keys(restriction)) {
            if (Array.isArray(restriction[propertyId])) {
                const value = []
                for (let comp of restriction[propertyId]) {
                    if (comp.includes("today")) {
                        if (comp.charAt(5) == "+") comp = moment().add(comp.substring(6), "days").format("YYYY-MM-DD")
                        else if (comp && comp.charAt(5) == "-") comp = moment().subtract(comp.substring(6), "days").format("YYYY-MM-DD")
                        else comp = moment().format("YYYY-MM-DD")        
                    }
                    value.push(comp)
                }
                whereParam[propertyId] = value
            }
            else if (restriction[propertyId] === "profile_id") whereParam[propertyId] = context.user.profile_id
            else whereParam[propertyId] = restriction[propertyId]
        }    
    }

    for (let propertyId of ((order != null) ? order.split(",") : [])) {
        if (propertyId[0] == "-") propertyId = propertyId.substring(1)
        if (!propertyDefs[propertyId]) propertyDefs[propertyId] = {}
    }

    const properties = await getProperties(db, context, entity, view, propertyDefs)

    /**
     * List of DB columns to retrieve
     */
    const columns = []
    for (const [propertyId, property] of Object.entries(properties)) {
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
    
    const rows = await getList(db, context, entity, columns, properties, whereParam, order, limit)
    const result = { rows, config: listConfig, properties, where, order, limit }
    
    if (listConfig.crossEntity) {

        const crossEntity = listConfig.crossEntity
        const ids = rows.map(x => x.id)

        if (ids.length > 0) {

            /**
             * Cross entity
             */
        
            const crossPropertyDefs = { ...listConfig.crossProperties }

            for (let propertyId of ((order != null) ? order.split(",") : [])) {
                if (propertyId[0] == "-") propertyId = propertyId.substring(1)
                if (!propertyDefs[propertyId]) propertyDefs[propertyId] = {}
            }

            const crossProperties = await getProperties(db, context, crossEntity, null, crossPropertyDefs)

            const crossColumns = ["id"]
            for (const [propertyId, property] of Object.entries(crossProperties)) {
                if (property.type != "tag") crossColumns.push(propertyId)
            }
        
            const crossOrder = listConfig.crossOrder || order
            const crossWhere = { [listConfig.crossKey]: ["in"].concat(ids) }
            result.crossRows = await getList(db, context, crossEntity, crossColumns, crossProperties, crossWhere, crossOrder, limit)
            result.crossProperties = crossProperties
            result.crossOrder = crossOrder
        }
    }

    return result
}

module.exports = {
    listAction,
}