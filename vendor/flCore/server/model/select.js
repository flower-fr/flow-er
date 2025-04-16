const { qi, qv } = require("./quote")
const { join } = require("./join")
const { selectColumns } = require("./selectColumns")
const { selectWhere } = require("./selectWhere")

const select = (context, entity, columns, where, order = [], limit = null, model = [], debug = false) => {

    const table = (model.entities[entity]) ? model.entities[entity].table : entity

    if (model.properties.visibility && (!where.visibility || where.visibility == "deleted") /* deleted never visible */) where.visibility = 'active'

    if (!columns) {
        columns = []
        for (let propertyId of Object.keys(model.properties)) {
            const property = model.properties[propertyId]
            if (property.entity == entity) columns.push(propertyId)
        }
    }

    const joins = join(entity, columns, where, order, model)

    const { columnDict, groupBy } = selectColumns(context, entity, columns, model, joins)

    const select = []
    for (let propertyId of Object.keys(columnDict)) {
        const column = columnDict[propertyId]
        select.push(`${column} AS ${propertyId}`)
    }

    let request = `SELECT ${select.join(", ")} FROM ${table} AS ${entity}\n`

    request += `${Object.values(joins).join("\n")}\n`

    const predicates = selectWhere(context, entity, where, model, joins)

    /**
     * Access control
     */
    if (model.access) {
        for (const [modelProp, profileProp] of Object.entries(model.access)) {
            if (context.user[profileProp]) {
                const property = model.properties[modelProp], qEntity = `${qi(property.entity)}.`, qColumn = qi(property.column)
                predicates.push(`${qEntity}${qColumn} = ${ context.user[profileProp] }`)
            }
        }
    }

    if (predicates.length > 0) request += `WHERE ${predicates.join("\nAND ")}\n`    

    if (groupBy) request += `GROUP BY ${groupBy.join(", ")}\n`
    
    if (order != null) {
        request += "ORDER BY "
        const orderArray = []
        for (let orderSpecifier of Object.keys(order)) {
            const direction = order[orderSpecifier]
            const orderProperty = model.properties[orderSpecifier]
            const orderTable = (orderProperty.entity) ? ((model.entities[orderProperty.entity]) ? model.entities[orderProperty.entity].table : table) : false
            const qColumn = qi(orderProperty.column)
            orderArray.push(`${ (orderTable) ? `${qi(orderTable)}.` : "" }${qColumn} ${direction}`)
        }
        request += orderArray.join(", ")
        request += "\n"
    }

    if (limit) request += `LIMIT ${limit}\n`

    if (debug) console.log(request)
    
    return request
}

module.exports = {
    select
}