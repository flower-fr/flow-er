const { select } = require("../select")

const retrieve = async (context, db, entity, model, columns, where, order = [], limit = null, debug = false) =>
{
    const unsensitiveWhere = {}, sensitiveWhere = {}, requests = {}
    for (const [propertyId, rule] of Object.entries(where)) {
        const property = model.properties[propertyId]
        if (property.sensitive) {
            const property = model.properties[propertyId], table = property.table, column = property.column
            if (!sensitiveWhere[table]) sensitiveWhere[table] = {}
            sensitiveWhere[table][column] = rule
            if (!requests[table]) requests[table] = ["id"]
            requests[table].push(column)
        } else {
            unsensitiveWhere[propertyId] = rule
        }
    }

    /**
     * Retrieve vectors of sensitive properties
     */
    const idsToKeep = {}
    for (const [table, columns] of requests) {
        const vector = (await db.execute(select(context, table, columns, [], null, null, context.config[`model/${ table }`])))[0]
        for (const row of vector) {

            let keep = true // initialization

            for (let [column, rule] of sensitiveWhere[table]) {
                const cell = row[column]
                rule = [...rule]

                if (Array.isArray(rule)) {
                    if (["like", "contains", "startsWith", "endsWith"].includes(rule[0])) {
                        rule = rule.map(x => { return x.split(" ").join("") })
                    }
                    else if (!["in", "ni", "between", "=", "!=", ">", ">=", "<", "<=", "null", "not_null"].includes(rule[0])) {
                        rule = ["in"].concat(rule)
                    }

                    const operator = rule[0]
    
                    if (operator == "in") {
                        rule.shift()
                        const match = false
                        for (const modality of rule) {
                            if (cell == modality) {
                                match = true
                                break
                            }
                        }
                        if (!match) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "ni") {
                        rule.shift()
                    }
                    else if (operator == "between") {
                    }
                    else if (operator == "like") {
                    }
                    else if (operator == "contains") {
                    }
                    else if (operator == "startsWith") {
                    }
                    else if (operator == "endsWith") {
                    }
                    else if (operator == "=") {
                    }
                    else if (operator == "!=") {
                    }
                    else if (operator == ">") {
                    }
                    else if (operator == ">=") {
                    }
                    else if (operator == "<") {
                    }
                    else if (operator == "<=") {
                    }
                    else if (operator == "null") {
                    }
                    else if (operator == "not_null") {
                    }
                }
                else {
                }
            }
            if (keep) {
                idsToKeep[table].push(row.id)
            }
        }
    }

    for (const [table, ids] of idsToKeep) {
        unsensitiveWhere[model.entities[table].foreignKey] = ids
    }

    const rows = await db.execute(select(context, entity, columns, where, order, limit, model))
    if (debug) console.log(rows)
    return rows
}

module.exports = {
    retrieve
}