const { updateColumns } = require("./updateColumns")
const { insert } = require("../../../flCore/server/model/insert")

const storeEntities = async (context, mainEntity, rowsToStore, model, sql) => {

    const columnsToUpdate = {}

    for (let row of rowsToStore) {
        const entitiesToInsert = row.entitiesToInsert, entitiesToUpdate = row.entitiesToUpdate
        const insertEntity = async (entityId, entity) => {
            const entityToInsert = entitiesToInsert[entityId]
            const insertModel = context.config[`${entity.table}/model`]
            const params = []
            for (const key of Object.keys(entityToInsert.cells)) {
                const value = insertModel.properties[key]
                if (["longblob", "mediumblob"].includes(value.type)) params.push(entityToInsert.cells[key])
            }
            // const [insertedRow] = (await connection.execute(insert(context, entity.table, entityToInsert.cells, insertModel), params))
            // entityToInsert.rowId = insertedRow.insertId
            entityToInsert.rowId = (await sql.execute({ context, type: "insert", entity: entity.table, data: entityToInsert.cells }))
            if (entity.foreignEntity) {
                if (entitiesToInsert[entity.foreignEntity]) {
                    entitiesToInsert[entity.foreignEntity].cells[entity.foreignKey] = entityToInsert.rowId //insertedRow.insertId
                }
    
                if (entitiesToUpdate[entity.foreignEntity]) {
                    entitiesToUpdate[entity.foreignEntity].cells[entity.foreignKey] = entityToInsert.rowId //insertedRow.insertId
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
                //await connection.execute(update(context, table, [entityToUpdate.rowId], entityToUpdate.cells, updateModel))
            }
        }
    }

    await updateColumns(context, columnsToUpdate, model, sql)
}

module.exports = {
    storeEntities
}