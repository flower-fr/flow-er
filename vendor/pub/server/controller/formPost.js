const { assert } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { insert } = require("../../../flCore/server/model/insert")
const { updateCase } = require("../../../flCore/server/model/updateCase")

const formPost = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const formConfig = context.config[`${entity}/form/${view}`]
    const model = context.config[`${entity}/model`]

    const connection = await db.getConnection()

    /**
     * Search for existing row and retrieve foreign key values and updatable property values
     */

    const payload = {}, columns = [ ...formConfig.identifier ], where = {}
    for (let column of columns) {
        where[column] = req.body[column]
    }
    const fks = foreignKeys({ entity }, model, Object.keys(formConfig.properties))
    columns.concat(fks)
    columns.push("id")

    for (let column of Object.keys(formConfig.properties)) {
        if (formConfig.properties[column].update) columns.push(column)
    }

    const rows = (await connection.execute(select(context, entity, columns, where, null, null, model)))

    let row = false
    if (rows[0].length > 0) {
        row = rows[0][0]
        for (let foreignKey of fks) payload[foreignKey] = row[foreignKey]
        for (let propertyId of Object.keys(formConfig.properties)) {
            const propertyDef = formConfig.properties[propertyId]
            if (propertyDef.update || propertyDef.insert) {
                let update = true
                if (propertyDef.update_condition) {
                    for (let key of Object.keys(propertyDef.update_condition)) {
                        const predicate = propertyDef.update_condition[key]
                        if (!predicate.includes(row[key])) update = false
                    }
                }
                if (update) payload[propertyId] = req.body[propertyId]
            }
        }
    }
    else for (let propertyId of Object.keys(formConfig.properties)) payload[propertyId] = req.body[propertyId]
    console.log(payload)
    const { cellsToStore, cellsToReject } = dataToStore(model, payload)
    const { entitiesToInsert, entitiesToUpdate } = entitiesToStore(entity, model, cellsToStore, row)

    await connection.beginTransaction()

    await storeEntities(context, entity, { entitiesToInsert, entitiesToUpdate }, model, row, connection)
    await auditCells(context, { insertedEntities: entitiesToInsert, updatedEntities: entitiesToUpdate }, connection)

    await connection.commit()
    await connection.release()

    if (formConfig.redirect) return { "redirect": formConfig.redirect }
    else return {}
}

const foreignKeys = ({ entity }, model, propertyIds) => {
    const result = []
    for (let propertyId of propertyIds) {
        if (model.properties[propertyId]) {
            const entityId = model.properties[propertyId].entity
            if (model.entities[entityId] && model.entities[entityId].foreignKey) {
                const foreignKey = model.entities[entityId].foreignKey
                if (!result.includes(foreignKey)) result.push(foreignKey)
            }    
        }
    }
    return result
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
            if (property.type == "int" && !parseInt(value)) cellsToReject[propertyId] = "type"
            else if (property.type == "float" && typeof(value) != "number") cellsToReject[propertyId] = "type"
            else cellsToStore[propertyId] = value    
        }
    }    
    
    return { "cellsToStore": cellsToStore, "cellsToReject": cellsToReject }
}

const entitiesToStore = (mainEntity, model, payload, row) => {

    const data = {}
    if (row) data["id"] = row["id"]

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
                (entityId == mainEntity)
                    ? { table: mainEntity, foreignKey: "id" }
                    : {
                        table: model.entities[entityId].table,
                        foreignEntity: model.entities[entityId].foreignEntity,
                        foreignKey: model.entities[entityId].foreignKey
                    }

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

    return { entitiesToInsert, entitiesToUpdate }
}

const storeEntities = async (context, mainEntity, { entitiesToInsert, entitiesToUpdate }, model, row, connection) => {

    const columnsToUpdate = {}

    const insertEntity = async (entityId, entity) => {
        const entityToInsert = entitiesToInsert[entityId]
        const insertModel = context.config[`${entity.table}/model`]
        const [insertedRow] = (await connection.execute(insert(context, entity.table, entityToInsert.cells, insertModel)))
        entityToInsert.rowId = insertedRow.insertId
        if (entity.foreignEntity) {
            if (entitiesToInsert[entity.foreignEntity]) {
                entitiesToInsert[entity.foreignEntity].cells[entity.foreignKey] = insertedRow.insertId
            }

            if (entitiesToUpdate[entity.foreignEntity]) {
                entitiesToUpdate[entity.foreignEntity].cells[entity.foreignKey] = insertedRow.insertId
            }
        }
    }

    /**
     * Insert new entities in order defined in the model and propagate the foreign keys
     */
    for (let entityId of Object.keys(model.entities).reverse()) {
        const entity = model.entities[entityId]
        if (entitiesToInsert[entityId]) await insertEntity(entityId, entity)
        else {
            if (entityId == mainEntity && entity.foreignEntity) {
                if (entitiesToInsert[entity.foreignEntity]) {
                    entitiesToInsert[entity.foreignEntity].cells[entity.foreignKey] = row.id
                }
    
                if (entitiesToUpdate[entity.foreignEntity]) {
                    entitiesToUpdate[entity.foreignEntity].cells[entity.foreignKey] = row.id
                }
            }
        }
    }
    //if (entitiesToInsert[mainEntity]) await insertEntity(mainEntity, { table: mainEntity })

    /**
     * Perfs: Pivot the per row basis update vector to per column basis vectors
     * (update case is a scalable approach in SQL)
     */
    for (let entityId of Object.keys(entitiesToUpdate)) {
        if (entitiesToUpdate[entityId]) {
            const entity = model.entities[entityId], table = (entity) ? entity.table : entityId, entityToUpdate = entitiesToUpdate[entityId]
            const updateModel = context.config[`${entityId}/model`]
            for (let columnId of Object.keys(entityToUpdate.cells)) {
                const value = entityToUpdate.cells[columnId]
                if (!columnsToUpdate[entityId]) columnsToUpdate[entityId] = {}
                if (!columnsToUpdate[entityId][columnId]) columnsToUpdate[entityId][columnId] = {}
                columnsToUpdate[entityId][columnId][entityToUpdate.rowId] = value
            }
            await connection.execute(update(context, table, [entityToUpdate.rowId], entityToUpdate.cells, updateModel))
        }
    }
    
    /**
     * Update existing entities
     */
    for (let table of Object.keys(columnsToUpdate)) {
        const columns = columnsToUpdate[table]
        for (let column of Object.keys(columns)) {
            const pairs = columns[column]
            await connection.execute(updateCase(context, table, column, pairs))
        }
    }
}

const auditCells = async (context, { insertedEntities, updatedEntities }, connection) => {

    const insertAudit = async (entity, data, model) => {
        const auditTable = (model.audit) ? model.audit : "audit", auditModel = context.config[`${auditTable}/model`]
        for (let propertyId of Object.keys(data.cells)) {
            const property = model.properties[propertyId]
            if (property.audit) {
                const value = data.cells[propertyId]
                const auditToInsert = {
                    entity: entity,
                    row_id: data.rowId,
                    property: propertyId,
                    value: value
                }
                await connection.execute(insert(context, auditTable, auditToInsert, auditModel))
            }
        }
    }

    for (let entityId of Object.keys(insertedEntities)) {
        const entity = insertedEntities[entityId], table = (entity.table) ? entity.table : entityId
        const insertedEntity = insertedEntities[entityId], model = context.config[`${table}/model`]
        await insertAudit(table, insertedEntity, model)
    }

    for (let entityId of Object.keys(updatedEntities)) {
        const entity = updatedEntities[entityId], table = (entity.table) ? entity.table : entityId
        const updatedEntity = updatedEntities[entityId], model = context.config[`${table}/model`]
        await insertAudit(table, updatedEntity, model)
    }
}

module.exports = {
    formPost
}