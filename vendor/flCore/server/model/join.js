const { qi, qv } = require("./quote")

const join = (table, columns, where, order, model) => {
    let involvedProperties = {}
    for (let column of columns) {
        const propertyId = (Array.isArray(column)) ? column[1] : column
        const property = model.properties[propertyId]
        if (!property) continue
        if (property.type == "CONCAT") {
            const components = []
            for (let component of property.components) {
                if (model.properties[component]) {
                    involvedProperties[model.properties[component].column] = null
                }
            }
        }
        involvedProperties[propertyId] = null
    }
    for (let propertyId of Object.keys(where)) involvedProperties[propertyId] = null
    if (order != null) for (let propertyId of Object.keys(order)) involvedProperties[propertyId] = null
    involvedProperties = Object.keys(involvedProperties)

    const entitiesToJoin = {}
    for (let propertyId of involvedProperties) {
        if (model.properties[propertyId]) {
            const entityId = model.properties[propertyId].entity
            if (model.properties[propertyId].entity != table) entitiesToJoin[entityId] = []
        }
    }

    // Refine entities to join depending on other entities to join. Ex vcard to join with commitment needs account for contact_1_id as foreign key
    for (let entityId of Object.keys(entitiesToJoin)) {
        while (true) {
            if (!model.entities[entityId].foreignEntity) break
            const foreignEntityId = model.entities[entityId].foreignEntity
            if (foreignEntityId == table) break
            if (!model.entities[foreignEntityId]) break;
            entitiesToJoin[foreignEntityId] = []
            entityId = foreignEntityId
        }
    }

    let joins = {}
    for (let entityId of Object.keys(model.entities)) {
        if (entitiesToJoin[entityId]) {
            const entity = model.entities[entityId]
            if (entitiesToJoin[entityId]) {
                const primary = "id"
                if (entity.key) primary = entity.key
                joins[entityId] = `LEFT JOIN ${qi(entity.table)} AS ${qi(entityId)}`
                if (entity.join) {
                    const on = []
                    for (let matching of entity.join) {
                        const primary = "id"
                        if (matching.key) primary = matching.key
                        on.push(`${qi(entityId)}.${primary} = ${qi(entity.foreign_entity)}.${qi(matching.foreign_key)}`)
                    }
                    joins[entityId] += ` ON ${on.join(" AND ")}`
                }
                else {
                    let primary = "id"
                    if (entity.key) primary = entity.key
                    joins[entityId] += ` ON ${qi(entityId)}.${qi(primary)} = ${qi(entity.foreignEntity)}.${qi(entity.foreignKey)}`
                }
            }
        }
    }

    return joins
}

module.exports = {
    join
}