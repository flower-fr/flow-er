const { select } = require("./select")

const sensitiveWhere = async (context, db, entity, model, columns, where, order = [], limit = null, debug = false) =>
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
        idsToKeep[table] = ["in"]
        const vector = (await db.execute(select(context, table, columns, [], null, null, context.config[`model/${ table }`])))[0]
        for (const row of vector) {

            let keep = true // initialization

            for (let [column, rule] of sensitiveWhere[table]) {
                let cell = row[column]
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
                        let match = false
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
                        for (const modality of rule) {
                            if (cell == modality) {
                                keep = false
                                break
                            }
                        }
                        if (!keep) {
                            break
                        }
                    }
                    else if (operator == "between") {
                        if (cell < rule[1] || cell > rule[2]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "like") {
                        cell = cell.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        if (cell != rule) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "contains") {
                        cell = cell.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        if (!(new RegExp(rule[1])).test(cell)) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "startsWith") {
                        cell = cell.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        if (!cell.startsWith(rule[1])) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "endsWith") {
                        cell = cell.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        if (!cell.endsWith(rule[1])) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "=") {
                        if (!cell === rule[1]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "!=") {
                        if (cell === rule[1]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == ">") {
                        if (cell <= rule[1]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == ">=") {
                        if (cell < rule[1]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "<") {
                        if (cell >= rule[1]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "<=") {
                        if (cell > rule[1]) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "null") {
                        if (!cell === null) {
                            keep = false
                            break
                        }
                    }
                    else if (operator == "not_null") {
                        if (cell === null) {
                            keep = false
                            break
                        }
                    }
                }
                else {
                    cell = cell.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    if (cell !== rule) {
                        keep = false
                        break
                    }
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

    const rows = (await db.execute(select(context, entity, columns, where, order, limit, model)))[0]
    if (debug) console.log(rows)
    return rows
}

module.exports = {
    sensitiveWhere
}