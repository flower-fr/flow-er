const util = require("util")

const { assert, throwConflictError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { insert } = require("../../../flCore/server/model/insert")
const { updateCase } = require("../../../flCore/server/model/updateCase")
const { getProperties } = require("./getProperties")
const { renderAdd } = require("../view/renderAdd")

/**
 * Check for integrity of the given data to store (either insert or update as determined later)
 */
const dataToStore = (entity, model, form) => {

    const rowsToStore = [], rowsToReject = []

    for (const row of form) {
        const cellsToStore = {}, cellsToReject = {}
        for (let propertyId of Object.keys(row)) {
            if (propertyId != ("formJwt")) {
                const property = model.properties[propertyId]
                if (!property) cellsToReject[propertyId] = "unknown"
                //else if (property.type == "primary") cellsToReject[propertyId] = "primary"
                else {
                    let value = row[propertyId]
                    if (property.type == "int") {
                        if (Number.isNaN(value)) cellsToReject[propertyId] = "type"
                        else cellsToStore[propertyId] = parseInt(value)
                    }
                    else if (property.type == "decimal") {
                        if (Number.isNaN(value)) cellsToReject[propertyId] = "type"
                        else cellsToStore[propertyId] = parseFloat(value)
                    }
                    else cellsToStore[propertyId] = value    
                }
            }
        }    
        rowsToStore.push(cellsToStore)
        if (Object.keys(cellsToReject).length !== 0) rowsToReject.push(cellsToReject)
    }

    return { "rowsToStore": rowsToStore, "rowsToReject": rowsToReject }
}

const entitiesToStore = (mainEntity, model, rowsToStore, audit) => {

    for (let row of rowsToStore) {
        const data = {}

        if (row.id) data.id = row.id

        /**
         * Retrieve foreign keys on already existing joined entities
         */
        for (const entity of Object.values(model.entities)) {
            if (row[entity.foreignKey]) data[entity.foreignKey] = row[entity.foreignKey]
        }
    
        const entitiesToInsert = {}, entitiesToUpdate = {}
        for (let propertyId of Object.keys(row)) {
            if (model.properties[propertyId]) {
                const value = row[propertyId], property = model.properties[propertyId], entityId = property.entity
    
                const { table, foreignEntity, foreignKey } = 
                    (entityId != mainEntity && model.entities[property.entity])
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
                        table: table,
                        rowId: idToUpdate,
                        cells: {}
                    }
                    if (property.column != "id") entitiesToUpdate[table].cells[property.column] = value
                }
            }
        }
        row.entitiesToInsert = entitiesToInsert
        row.entitiesToUpdate = entitiesToUpdate
    }

    return rowsToStore
}

const storeEntities = async (context, mainEntity, rowsToStore, model, db) => {

    const columnsToUpdate = {}

    for (let row of rowsToStore) {
        const entitiesToInsert = row.entitiesToInsert, entitiesToUpdate = row.entitiesToUpdate
        const insertEntity = async (entityId, entity) => {
            const entityToInsert = entitiesToInsert[entityId]
            const insertModel = context.config[`${entity.table}/model`]
            const [insertedRow] = (await db.execute(insert(context, entity.table, entityToInsert.cells, insertModel)))
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
        for (const [entityId, entity] of Object.entries(model.entities).reverse()) {
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
                await db.execute(update(context, table, [entityToUpdate.rowId], entityToUpdate.cells, updateModel))
            }
        }
    }
    
    /**
     * Update existing entities
     */
    for (let table of Object.keys(columnsToUpdate)) {
        const columns = columnsToUpdate[table]
        for (let column of Object.keys(columns)) {
            const pairs = columns[column]
            await db.execute(updateCase(context, table, column, pairs))
        }
    }
}

const auditCells = async (context, rowsToStore, db) => {

    for (let row of rowsToStore) {
        const insertedEntities = row.entitiesToInsert, updatedEntities = row.entitiesToUpdate

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
                    await db.execute(insert(context, auditTable, auditToInsert, auditModel))
                }
            }
        }
    
        for (const [entity, insertedEntity] of Object.entries(insertedEntities)) {
            const model = context.config[`${insertedEntity.table}/model`]
            await insertAudit(entity, insertedEntity, model)
        }
    
        for (const [entity, updatedEntity] of Object.entries(updatedEntities)) {
            const model = context.config[`${updatedEntity.table}/model`]
            await insertAudit(entity, updatedEntity, model)
        }
    }
}

const postAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = (req.query.id) ? req.query.id : 0

    const connection = await db.getConnection()

    const model = context.config[`${entity}/model`]

    await connection.beginTransaction()

    const form = req.body

    /**
     * Find out the data to actually store in the database 
     */

    let { rowsToStore, rowsToReject } = dataToStore(entity, model, form)

    if (rowsToReject.length > 0) {
        return JSON.stringify({ "status": "ko", "errors": rowsToReject })
    }
    
    /**
     * Find out the entities to insert vs update in the database 
     */

    rowsToStore = entitiesToStore(entity, model, rowsToStore)
    await storeEntities(context, entity, rowsToStore, model, connection)
    await auditCells(context, rowsToStore, connection)

    await connection.commit()
    return JSON.stringify({ "status": "ok", "stored": rowsToStore })
}

module.exports = {
    postAction
}