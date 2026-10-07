const auditCells = async (context, rowsToStore, sql) => {

    for (let row of rowsToStore) {
        const insertedEntities = row.entitiesToInsert = row.entitiesToUpdate

        const insertAudit = async (entity, data, model) => {
            const auditTable = (model.audit) ? model.audit : "audit"
            for (let propertyId of Object.keys(data.cells)) {
                const property = model.properties[propertyId]
                if (property.audit) {
                    let value = data.cells[propertyId]
                    if (property.type === "json") value = JSON.stringify(value)
                    const auditToInsert = {
                        entity: entity,
                        row_id: data.rowId,
                        property: propertyId,
                        value: value,
                        previous_value: null
                    }
                    await sql.execute({ context, type: "insert", entity: auditTable, data: auditToInsert })
                }
            }
        }

        for (const [entity, insertedEntity] of Object.entries(insertedEntities)) {
            const model = context.config[`${insertedEntity.table}/model`]
            await insertAudit(entity, insertedEntity, model)
        }
    }
}

module.exports = {
    auditCells
}