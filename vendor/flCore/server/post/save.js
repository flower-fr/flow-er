const { assert } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")

const { dataToStore } = require("./dataToStore")
const { entitiesToStore } = require("./entitiesToStore")
const { storeEntities } = require("./storeEntities")
const { updateColumns } = require("./updateColumns")
const { auditCells } = require("./auditCells")

/**
 * Merge received payload with stored data
 */

const foreignKeys = (mainEntity, model, propertyIds) => {
    const result = ["id"]
    for (let propertyId of propertyIds) {
        if (model.properties[propertyId]) {
            const entityId = model.properties[propertyId].entity
            if (entityId != mainEntity && model.entities[entityId] && model.entities[entityId].foreignKey) {
                const foreignKey = model.entities[entityId].foreignKey
                if (!result.includes(foreignKey)) result.push(foreignKey)
            }    
        }
    }
    return result
}

const mergePayload = async (context, entity, model, form, config, connection) => {

    /**
     * Search for existing row and retrieve foreign key values and updatable property values
     */

    const fks = foreignKeys(entity, model, Object.keys(config.properties))
    const columns = [ ...config.identifier ].concat(fks)
    columns.push("id")

    for (let column of Object.keys(config.properties)) {
        if (config.properties[column].update) columns.push(column)
    }

    const where = {}
    for (let formRow of form) {
        for (let id of config.identifier) {
            if (!where[id]) where[id] = ["in"]
            where[id].push(formRow[id])
        }
    }

    /**
     * Index the current data
     */

    const [cursor] = await connection.execute(select(context, entity, columns, where, null, null, model))
    const rows = {}
    for (const row of cursor) {
        const identifier = []
        for (let item of config.identifier) identifier.push(row[item])
        rows[identifier.join("|")] = row
    }

    /**
     * Index the form data
     */

    const formData = {}
    for (const formRow of form) {
        const identifier = []
        for (let item of config.identifier) identifier.push(formRow[item])
        formData[identifier.join("|")] = formRow
    }

    /**
     * Rows to add or update
     */

    const payload = []
    for (const [identifier, formRow] of Object.entries(formData)) {
        const payloadRow = {}
        if (rows[identifier]) {
            const row = rows[identifier]
            for (let foreignKey of fks) payloadRow[foreignKey] = row[foreignKey]
            for (const [propertyId, propertyDef] of Object.entries(config.properties)) {
                if (propertyDef.update || propertyDef.insert) {
                    let update = true
                    if (propertyDef.update_condition) {
                        for (let key of Object.keys(propertyDef.update_condition)) {
                            const predicate = propertyDef.update_condition[key]
                            if (!predicate.includes(row[key])) update = false
                        }
                    }
                    if (update && formRow[propertyId] && formRow[propertyId] != row[propertyId]) payloadRow[propertyId] = formRow[propertyId]
                }
            }
        }
        else for (let propertyId of Object.keys(config.properties)) {
            if (formRow[propertyId]) payloadRow[propertyId] = formRow[propertyId]
        }

        payload.push(payloadRow)
    }

    /**
     * Rows to delete
     */

    // for (const [identifier, row] of Object.entries(rows)) {
    //     const payloadRow = {}
    //     if (rows[identifier]) {
    //         for (let foreignKey of fks) payloadRow[foreignKey] = row[foreignKey]
    //         payloadRow["visibility"] = "archived"
    //         payloadRow["vcard_visibility"] = "archived"

    //         payload.push(payloadRow)
    //     }
    // }

    return payload
}

const save = async ({ req }, context, rows, { connection }) => {
    const entity = assert.notEmpty(req.params, "entity")

    const model = context.config[`${entity}/model`]

    const form = req.body
    
    /**
     * Find out the data to actually store in the database 
     */
    
    let { rowsToStore, rowsToReject } = dataToStore(entity, model, rows)

    // if (rowsToReject.length > 0) {
    //     return JSON.stringify({ "status": "ko", "errors": rowsToReject })
    // }
    
    /**
     * Find out the entities to insert vs update in the database 
     */
    
    rowsToStore = entitiesToStore(entity, model, rowsToStore)
    const columnsToUpdate = await storeEntities(context, entity, rowsToStore, model, connection)
    await updateColumns(context, columnsToUpdate, model, connection)
    await auditCells(context, rowsToStore, connection)

    return JSON.stringify({ "status": "ok", "stored": rowsToStore })
}

module.exports = {
    mergePayload,
    save
}