const { assert } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")

const formPost = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const formConfig = context.config[`${entity}/form/${view}`]
    const model = context.config[`${entity}/model`]

    /**
     * Search for existing row
     */
    const payload = {}, columns = formConfig.identifier, where = {}
    for (let column of columns) {
        where[column] = req.body[column]
    }
    for (let foreignKey of formConfig.foreignKeys) columns.push(foreignKey)
    const rows = (await db.execute(select(context, entity, columns, where, null, null, model, true)))

    let row = false
    if (rows[0].length > 0) {
        row = rows[0][0]
        for (let foreignKey of formConfig.foreignKeys) payload[foreignKey] = row[foreignKey]
        for (let propertyId of Object.keys(formConfig.properties)) {
            const propertyDef = formConfig.properties[propertyId]
            if (propertyDef.update) payload[propertyId] = req.body[propertyId]
        }
    }
    else for (let propertyId of Object.keys(formConfig.properties)) payload[propertyId] = req.body[propertyId]

    const { cellsToStore, cellsToReject } = dataToStore(model, payload)
    const { entitiesToInsert, entitiesToUpdate } = entitiesToStore(entity, model, cellsToStore, row)
    console.log(entitiesToInsert, entitiesToUpdate)

    if (formConfig.redirect) return { "redirect": formConfig.redirect }
    else return {}
}

/**
 * Check for integrity of the given data to store (either insert or update as determined later)
 */
const dataToStore = (model, payload) => {

    const cellsToStore = {}, cellsToReject = {}
    for (let propertyId of Object.keys(payload)) {
        const property = model.properties[propertyId]
        if (!property) cellsToReject[propertyId] = "unknown"
        else {
            let value = payload[propertyId]
            if (property.type == "int" && !Number.isInteger(value)) cellsToReject[propertyId] = "type"
            else if (property.type == "float" && typeof(value) != "number") cellsToReject[propertyId] = "type"
            else cellsToStore[propertyId] = value    
        }
    }    
    
    return { "cellsToStore": cellsToStore, "cellsToReject": cellsToReject }
}

const entitiesToStore = (mainEntity, model, payload, row) => {

    const data = {}

    /**
     * Retrieve foreign keys on already existing joined entities
     */
    for (let entityId of Object.keys(model.entities)) {
        const entity = model.entities[entityId]
        if (payload[entity.foreignKey]) data[entity.foreignKey] = payload[entity.foreignKey]
    }

    const entitiesToInsert = {}, entitiesToUpdate = {}
    for (let propertyId of Object.keys(payload)) {
        if (model.properties[propertyId]) {
            const value = payload[propertyId], property = model.properties[propertyId], entityId = property.entity

            const { table, foreignEntity, foreignKey } = 
                (model.entities[property.entity])
                ? { 
                    table: model.entities[entityId].table,
                    foreignEntity: model.entities[entityId].foreignEntity,
                    foreignKey: model.entities[entityId].foreignKey
                }
                : { table: mainEntity, foreignKey: "id" }

            let idToUpdate = data[foreignKey]
            if (!idToUpdate || idToUpdate === null) idToUpdate = 0
            if (idToUpdate == 0) {
                if (!entitiesToInsert[entityId]) entitiesToInsert[entityId] = {
                    table: table,
                    cells: {},
                    foreignEntity: foreignEntity,
                    foreignKey: foreignKey,
                }
                entitiesToInsert[entityId].cells[property.column] = value
            }
            else {
                if (!entitiesToUpdate[table]) entitiesToUpdate[table] = { 
                    rowId: idToUpdate,
                    cells: {}
                }
                if (property.column != "id" && value != row[propertyId]) entitiesToUpdate[table].cells[property.column] = value
            }
        }
    }

    return { entitiesToInsert: entitiesToInsert, entitiesToUpdate: entitiesToUpdate }
}

module.exports = {
    formPost
}