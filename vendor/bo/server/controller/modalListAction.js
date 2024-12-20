const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")
const { getList } = require("./getList")

const modalListAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"
    const where = (req.query.where) ? req.query.where : `commitment_id:${id}`
    const defaultOrder = (["crm_appointment", "crm_attachment", "crm_event"].includes(entity)) ? "-date" : "-touched_at"
    const order = (req.query.order) ? req.query.order : defaultOrder
    const limit = (req.query.limit) ? req.query.limit : 1000

    let modalListConfig = context.config[`${entity}/modalList/${view}`]
    if (!modalListConfig) modalListConfig = context.config[`${entity}/modalList/default`]

    const propertyDefs = { ...modalListConfig.properties }

    const whereParam = {}
    for (let param of (where != null) ? where.split("|") : []) {
        const keyValue = param.split(":")
        const key = keyValue[0], value = keyValue[1]
        whereParam[key] = value
        if (!propertyDefs[key]) propertyDefs[key] = {}
    }

    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)

    /**
     * List of DB columns to retrieve
     */
    let columns = []
    for (let propertyId of Object.keys(modalListConfig.properties)) {
        const property = properties[propertyId]
        if (property.type != "tag") columns.push(propertyId)
    }

    const propertyList = []
    for (let propertyId of Object.keys(modalListConfig.properties)) {
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
        entity: entity,
        id: id,
        rows : rows, 
        limit: limit, 
        config: modalListConfig,
        properties: properties 
    }
}

module.exports = {
    modalListAction,
}