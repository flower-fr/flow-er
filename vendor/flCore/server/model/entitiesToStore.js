const entitiesToStore = (mainEntity, model, rowsToStore) => {

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

module.exports = {
    entitiesToStore
}