const { insert } = require("../../../flCore/server/model/insert")

const auditCells = async (context, rowsToStore, sql) => {

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
                        value: value,
                        previous_value: null
                    }
                    // await connection.execute(insert(context, auditTable, auditToInsert, auditModel))
                    await sql.execute({ context, type: "insert", entity: auditTable, data: auditToInsert})
                }
            }
        }

        for (const [entity, insertedEntity] of Object.entries(insertedEntities)) {
            const model = context.config[`${insertedEntity.table}/model`]
            await insertAudit(entity, insertedEntity, model)
        }
    
        // for (const [entity, updatedEntity] of Object.entries(updatedEntities)) {
        //     const model = context.config[`${updatedEntity.table}/model`]
        //     await insertAudit(entity, updatedEntity, model)
        // }
    }
}

module.exports = {
    auditCells
}