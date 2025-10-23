const util = require("util")

const { decrypt } = require("./encrypt")
const { select } = require("./select")

const sensitiveWhere = async ({context, model, where}, connection, logger) =>
{
    const unsensitiveWhere = {}, sensitiveWhere = {}, requests = {}
    for (const [propertyId, rule] of Object.entries(where)) {
        const property = model.properties[propertyId]
        if (property.sensitive) {
            const entity = property.entity, column = property.column
            if (!sensitiveWhere[entity]) sensitiveWhere[entity] = {}
            sensitiveWhere[entity][column] = rule
            if (!requests[entity]) requests[entity] = ["id"]
            requests[entity].push(column)
        } else {
            unsensitiveWhere[propertyId] = rule
        }
    }

    /**
     * Retrieve vectors of sensitive properties
     */
    const idsToKeep = {}
    for (const [table, columns] of Object.entries(requests)) {
        idsToKeep[table] = []
        const vector = (await connection.execute(select(context, table, columns, {}, null, null, context.config[`${ table }/model`])))[0]
        for (const row of vector) {

            let keep = true // initialization

            for (let [column, rule] of Object.entries(sensitiveWhere[table])) {
                let cell = row[column]

                // Decryption
                if (cell) {
                    const decrypted = decrypt(context, cell)
                    cell = decrypted || cell
                }

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

    for (const [table, ids] of Object.entries(idsToKeep)) {
        unsensitiveWhere[model.entities[table].foreignKey] = ids
    }

    logger && logger.debug(util.inspect(unsensitiveWhere))
    
    return unsensitiveWhere
}

module.exports = {
    sensitiveWhere
}