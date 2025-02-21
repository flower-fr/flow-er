const { qi, qv } = require("./quote")

const selectColumns = (context, table, columns, model, joins) => {

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
                let first = true
                for (let component of property.components) {
                    if (!first) components.push(qv((property.separator) ? property.separator : " "))
                    if (model.properties[component]) {
                        const e = model.properties[component].entity
                        if (e == table || Object.keys(joins).includes(e)) {
                            first = false
                            components.push(`COALESCE(${qi(model.properties[component].entity)}.${qi(model.properties[component].column)}, '')`)
                        }
                    }
                    else components.push(`COALESCE(${ qv(component) }, '')`)
                }
                expression = `CONCAT(${components.join(", ")})`
            }
            else if (property.type == "month-MMMM") {
                const component = `${qi(model.properties[property.components[0]].entity)}.${qi(model.properties[property.components[0]].column)}`
                expression = `
                CASE
                    WHEN MONTH(${ component }) = 1 THEN 'janvier'
                    WHEN MONTH(${ component }) = 2 THEN 'février'
                    WHEN MONTH(${ component }) = 3 THEN 'mars'
                    WHEN MONTH(${ component }) = 4 THEN 'avril'
                    WHEN MONTH(${ component }) = 5 THEN 'mai'
                    WHEN MONTH(${ component }) = 6 THEN 'juin'
                    WHEN MONTH(${ component }) = 7 THEN 'juillet'
                    WHEN MONTH(${ component }) = 8 THEN 'août'
                    WHEN MONTH(${ component }) = 9 THEN 'septembre'
                    WHEN MONTH(${ component }) = 10 THEN 'octobre'
                    WHEN MONTH(${ component }) = 11 THEN 'novembre'
                    WHEN MONTH(${ component }) = 12 THEN 'décembre'
                END`
            }
            else if (property.type == "year") {
                const component = `${qi(model.properties[property.components[0]].entity)}.${qi(model.properties[property.components[0]].column)}`
                expression = `YEAR(${ component })`
            }
            else if (property.type == "DISTINCT") {
                const property = model.properties[propertyId]
                const entityId = property.entity
                const qEntity = qi(entityId)
                const qColumn = qi(property.component)
                if (entityId == table) expression = `${qTable}.${qColumn}`
                else expression = `${qEntity}.${qColumn}`
                expression = `DISTINCT(${expression})`
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
   
    return { columnDict, groupBy }
}

module.exports = {
    selectColumns
}