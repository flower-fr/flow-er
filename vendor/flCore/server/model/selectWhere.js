const { qi, qv } = require("./quote")

const selectWhere = (context, table, where, model, joins) => {

    const qTable = qi(table)

    const predicates = []
    if (model.properties.visibility) predicates.push(`${qTable}.${qi("visibility")} != 'deleted'`)
    
    for (let propertyId of Object.keys(where)) {
        if (!["touched_by"].includes(propertyId)) {
            if (propertyId == "id" || model.properties[propertyId]) {
                const property = model.properties[propertyId]

                let qEntity, qColumn
                if (property.type == "CONCAT") {
                    qEntity = ""
                    const components = []
                    for (let component of property.components) {
                        if (model.properties[component]) {
                            const e = model.properties[component].entity, c = model.properties[component].column
                            if (model.properties[component].type == "month-MMMM") {
                                const comp = `${qi(model.properties[model.properties[component].components[0]].entity)}.${qi(model.properties[model.properties[component].components[0]].column)}`
                                components.push(`
                                CASE
                                    WHEN MONTH(${ comp }) = 1 THEN 'janvier'
                                    WHEN MONTH(${ comp }) = 2 THEN 'février'
                                    WHEN MONTH(${ comp }) = 3 THEN 'mars'
                                    WHEN MONTH(${ comp }) = 4 THEN 'avril'
                                    WHEN MONTH(${ comp }) = 5 THEN 'mai'
                                    WHEN MONTH(${ comp }) = 6 THEN 'juin'
                                    WHEN MONTH(${ comp }) = 7 THEN 'juillet'
                                    WHEN MONTH(${ comp }) = 8 THEN 'août'
                                    WHEN MONTH(${ comp }) = 9 THEN 'septembre'
                                    WHEN MONTH(${ comp }) = 10 THEN 'octobre'
                                    WHEN MONTH(${ comp }) = 11 THEN 'novembre'
                                    WHEN MONTH(${ comp }) = 12 THEN 'décembre'
                                END`)
                            }
                            else if (model.properties[component].type == "year") {
                                const comp = `${qi(model.properties[model.properties[component].components[0]].entity)}.${qi(model.properties[model.properties[component].components[0]].column)}`
                                components.push(`YEAR(${ comp })`)
                            }
                            else if (e == table || Object.keys(joins).includes(e)) {
                                components.push(`REPLACE(COALESCE(${ qi(e) }.${ qi(c) }, ''), ' ' , '')`)
                            }
                        }
                        else components.push(`COALESCE(${ qv(component) }, '')`)
                        components.push(qv("|"))
                    }
                    qColumn = `CONCAT(${components.join(", ")})`    
                }
                else {
                    qEntity = `${qi(property.entity)}.`
                    qColumn = qi(property.column)
                }

                let value = where[propertyId]

                if (Array.isArray(value)) {
                    if (["like", "contains", "startsWith", "endsWith"].includes(value[0])) {
                        value = value.map(x => { return x.split(" ").join("") })
                    }
                    else if (!["in", "ni", "between", "=", "!=", ">", ">=", "<", "<=", "null", "not_null"].includes(value[0])) {
                        value = ["in"].concat(value)
                    }
                    const operator = value[0]

                    if (operator == "in") {
                        value.shift()
                        predicates.push(`${qEntity}${qColumn} IN (${value.map(x => (isNaN(x)) ? qv(x) : x).join(", ")})`)
                    }
                    else if (operator == "ni") {
                        value.shift()
                        predicates.push(`${qEntity}${qColumn} NOT IN (${value.map(x => (isNaN(x)) ? qv(x) : x).join(", ")})`)
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
                    else if (operator == "<=") {
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
                    if (typeof(value) === "string") value = qv(value)
                    if (property.type && ["primary", "foreign", "int", "float", "modality"].includes(property.type)) predicates.push(`${qEntity}${qColumn} = ${value}\n`)
                    else predicates.push(`${qEntity}${qColumn} LIKE ${value}\n`)
                }
            }
        }
    }
    return predicates
}

module.exports = {
    selectWhere
}