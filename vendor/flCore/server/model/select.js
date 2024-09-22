const { qi, qv } = require("./quote")
const { join } = require("./join")

const select = (context, table, columns, where, order = [], limit = null, model = [], debug = false) => {

    if (!where.visibility || where.visibility == 'deleted' /* deleted never visible */) where.visibility = 'active'

    if (!columns) {
        columns = []
        for (let propertyId of Object.keys(model.properties)) {
            const property = model.properties[propertyId]
            if (property.entity == table) columns.push(propertyId)
        }
    }

    const joins = join(table, columns, where, order, model)

    const qTable = qi(table)

    const columnDict = {}
    let groupBy = false
    for (let column of columns) {
        const propertyId = (Array.isArray(column)) ? column[1] : column
        const aggregator = (Array.isArray(column)) ? column[0] : false
        if (aggregator && column[2]) groupBy = column[2]
        const qPropertyId = qi(propertyId)
        if (model.properties[propertyId]) {
            const property = model.properties[propertyId]
            let expression
            if (property.type == "CONCAT") {
                const components = []
                for (let component of property.components) {
                    if (model.properties[component]) {
                        components.push(`${qi(model.properties[component].entity)}.${qi(model.properties[component].column)}`)
                    }
                    else components.push(qv(component))
                }
                expression = `CONCAT(${components.join(", ")})`
            }
            else {
                const property = model.properties[propertyId]
                const entityId = property.entity
                const qEntity = qi(entityId)
                const qColumn = qi(property.column)
                if (entityId == table) expression = `${qTable}.${qPropertyId}`
                else expression = `${qEntity}.${qColumn}`
            }
            columnDict[qPropertyId] = (aggregator) ? `${aggregator}(${expression})` : expression
        }
    }

    const select = []
    for (let propertyId of Object.keys(columnDict)) {
        const column = columnDict[propertyId]
        select.push(`${column} AS ${propertyId}`)
    }

    let request = `SELECT ${select.join(", ")} FROM ${table}\n`

    request += `${Object.values(joins).join("\n")}\n`

    const predicates = []
    if (model.properties.status) predicates.push(`${qTable}.${qi("visibility")} != 'deleted'`)
    
    for (let propertyId of Object.keys(where)) {
        if (!["instance_id", "touched_at", "touched_by"].includes(propertyId)) {
            if (propertyId == "id" || model.properties[propertyId]) {
                const property = model.properties[propertyId]

                let qEntity, qColumn
                if (property.type == "CONCAT") {
                    qEntity = ""
                    const components = []
                    for (let component of property.components) {
                        if (model.properties[component]) {
                            components.push(`${qi(model.properties[component].entity)}.${qi(model.properties[component].column)}`)
                        }
                        else components.push(qv(component))
                    }
                    qColumn = `CONCAT(${components.join(", ")})`    
                }
                else {
                    qEntity = `${qi(property.entity)}.`
                    qColumn = qi(property.column)
                }

                let value = where[propertyId]

                if (Array.isArray(value)) {
                    if (!["in", "ni", "between", "like", "contains", "startsWith", "endsWith", "=", "!=", ">", ">=", "<lt>", "<=>", "null", "not_null"].includes(value[0])) {
                        value = ["in"].concat(value)
                    }
                    const operator = value[0]
                    if (operator == "in") {
                        value.shift()
                        predicates.push(`${qEntity}${qColumn} IN (${value.map(qv).join(", ")})`)
                    }
                    else if (operator == "ni") {
                        value.shift()
                        predicates.push(`${qEntity}${qColumn} NOT IN (${value.map(qv).join(", ")})`)
                    }
                    else if (operator == "between") {
                        if (property.type && property.type == "datetime") {
                            predicates.push(`${qEntity}${qColumn} BETWEEN ${qv(value[1])} AND ${qv(value[2] + " 23:59:59.999")}`)
                        }
                        else {
                            predicates.push(`${qEntity}${qColumn} BETWEEN ${qv(value[1])} AND ${qv(value[2])}`)
                        }
                    }
                    else if (operator == "like") {
                        predicates.push(`${qEntity}${qColumn} LIKE ${qv(value[1])}`)
                    }
                    else if (operator == "contains") {
                        predicates.push(`${qEntity}${qColumn} LIKE ${qv(`%${value[1]}%`)}`)
                    }
                    else if (operator == "startsWith") {
                        predicates.push(`${qEntity}${qColumn} LIKE ${qv(`${value[1]}%`)}`)
                    }
                    else if (operator == "endsWith") {
                        predicates.push(`${qEntity}${qColumn} LIKE ${qv(`%${value[1]}`)}`)
                    }
                    else if (operator == "=") {
                        predicates.push(`${qEntity}${qColumn} = ${qv(`${value[1]}`)}`)
                    }
                    else if (operator == "!=") {
                        predicates.push(`${qEntity}${qColumn} != ${qv(`${value[1]}`)}`)
                    }
                    else if (operator == ">") {
                        predicates.push(`${qEntity}${qColumn} > ${qv(`${value[1]}`)}`)
                    }
                    else if (operator == ">=") {
                        predicates.push(`${qEntity}${qColumn} >= ${qv(`${value[1]}`)}`)
                    }
                    else if (operator == "<") {
                        predicates.push(`${qEntity}${qColumn} < ${qv(`${value[1]}`)}`)
                    }
                    else if (operator == "<=>") {
                        predicates.push(`${qEntity}${qColumn} <= ${qv(`${value[1]}`)}`)
                    }
                    else if (operator == "null") {
                        predicates.push(`${qEntity}${qColumn} IS NULL`)
                    }
                    else if (operator == "not_null") {
                        predicates.push(`${qEntity}${qColumn} IS NOT NULL`)
                    }
                }
                else {
                    value = qv(value)
                    if (property.type && ["primary", "foreign", "int", "float", "modality"].includes(property.type)) predicates.push(`${qEntity}${qColumn} = ${value}\n`)
                    else predicates.push(`${qEntity}${qColumn} LIKE ${value}\n`)
                }
        
                // Perimeter check
                /*for (let propertyId of Object.keys(model.properties)) {
                    const property = model.properties[propertyId]
                    if (property.perimeter) {
                        perimeterValue = context->getPerimeter(property.perimeter.type, property.perimeter.predicate)
                        if (perimeterValue) {
                            const qEntity = qi(model.properties[propertyId].entity)
                            const qColumn = qi(propertyId)
                            const value = perimeterValue.map(qv);
                            value = value.join(",")
                            request += `AND ${qEntity}.${qColumn} IN (${value})\n`
                        }
                    }
                }*/    
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
            const orderTable = (model.entities[orderProperty.entity]) ? model.entities[orderProperty.entity].table : table
            const qColumn = qi(orderProperty.column)
            orderArray.push(`${qi(orderTable)}.${qColumn} ${direction}`)
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