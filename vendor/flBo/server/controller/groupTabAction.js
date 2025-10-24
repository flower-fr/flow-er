const { assert, throwConflictError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { insert } = require("../../../flCore/server/model/insert")
const { updateCase } = require("../../../flCore/server/model/updateCase")
const { getProperties } = require("./getProperties")

const groupTabAction = async ({ req }, context, sql) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let where = (req.query.where) ? req.query.where : null
    const whereParam = (where != null) ? where.split("|") : []
    where = {}
    for (let param of whereParam) {
        const keyValue = param.split(":")
        const key = keyValue[0]
        let value = keyValue[1].split(",")
        where[key] = value
    }

    let groupTabConfig = context.config[`${entity}/groupTab/${view}`]
    if (!groupTabConfig) groupTabConfig = context.config[`${entity}/groupTab/default`]
 
    // Initialize a row pattern
    const row = {}

    const propertyDefs = groupTabConfig.properties
    console.log(entity, propertyDefs)
    const properties = await getProperties(sql, context, entity, view, propertyDefs, [])
    
    /**
     * Data source
     */
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        let redef = false
        if (propertyDefs[propertyId]) {
            redef = propertyDefs[propertyId]
            if (redef.value) {
                //row[propertyId] = redef.value
                if (redef.value[0] === "?") { // Value set in query
                    const key = redef.value.substr(1)
                    if (where[key] && where[key].length === 1) row[propertyId] = where[key][0]
                }
            }
            if (redef.columns) property.columns = redef.columns
        }
        if (property.type === "source") {
            let filters = property.where
            filters = (filters) ? filters.split("|") : []
            filters = filters.map((x) => { return x.split(":") })
            const sourceEntity = property.entity
            const sourceWhere = {}
            for (let filter of filters) {
                let value = context.config[filter[1]] // Value set in config
                if (!value) {
                    if (filter[1][0] === "?") { // Value set in query
                        const key = filter[1].substr(1)
                        if (where[key]) value = where[key]
                        else value = []
                    }
                    else {
                        value = filter[1]
                        value = (value) ? value.split(",") : []
                    }
                }
                if (value.length !== 0) sourceWhere[filter[0]] = value
            }
            const sourceColumns = ["id"]
            property.columns = (redef.columns) ? Object.keys(redef.columns) : property.format[1].split(",")
            for (let columnId of property.columns) sourceColumns.push(columnId)
            // const modalities = (await db.execute(select(context, sourceEntity, sourceColumns, sourceWhere, null, null, context.config[`${property.entity}/model`])))[0]
            const modalities = await sql.execute({ context, type: "select", entity: sourceEntity, columns: sourceColumns, where: sourceWhere })
            property.modalities = {}
            property.rows = {}
            for (let modality of modalities) {
                if (row[propertyId] == modality.id && redef.columns) {
                    for (let columnId of Object.keys(redef.columns)) {
                        if (modality[columnId]) row[redef.columns[columnId]] = modality[columnId]
                    }
                }
                property.rows[modality.id] = modality

                // Deprecated
                const args = []
                for (let param of property.format[1].split(",")) {
                    args.push(modality[param])
                }
                const label = []
                const format = property.format[0].split("%s")
                for (let i = 0; i < format.length; i++) {
                    label.push(format[i])
                    if (args[i]) label.push(args[i])                    
                }
                property.modalities[modality.id] = label.join("")
            }
        }
    }
    
    const data = { groupTabConfig, properties, row, where, formJwt: "formJwt à construire" }
    return JSON.stringify(data)
}

const postGroupTabAction = async ({ req }, context, sql) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let updateConfig = context.config[`${entity}/update/${view}`]
    if (!updateConfig) updateConfig = context.config[`${entity}/update`]
    const propertyDefs = updateConfig.properties
    const properties = await getProperties(sql, context, entity, view, propertyDefs, [])

    // Retrieve the existing row

    const model = context.config[`${entity}/model`]
    const payload = {}, columns = Object.keys(model.properties)
    const fks = foreignKeys({ entity }, model, Object.keys(updateConfig.properties))
    columns.concat(fks)
    // const row = (await db.execute(select(context, entity, columns, { "id": id }, null, null, model)))[0][0]
    const [row] = await sql.execute({ context, type: "select", entity, columns, where: {id} })

    for (let foreignKey of fks) payload[foreignKey] = row[foreignKey]
    for (let propertyId of Object.keys(updateConfig.properties)) {
        payload[propertyId] = req.body[propertyId]
    }

    // Check authorization
    /*$formJwt = $this->request->getPost('formJwt');
    if (!Authorization::verifyJwt($formJwt)) {
        $this->response->setStatusCode('401');
    }*/

    /**
     * Consistency: Data updated by someone else in the meantime
     */
    if (dataHasEvolved(properties, payload, row)) {
        return await throwConflictError("Consistency")
    }

    /**
     * Find out the data to actually update in the database 
     */
    const { cellsToStore, tagsToUpdate } = dataToStore( properties, payload, row)
    let { entitiesToInsert, entitiesToUpdate  } = entitiesToStore(entity, model, cellsToStore, payload, row)
    await sql.beginTransaction()

    await storeEntities(context, entity, { entitiesToInsert, entitiesToUpdate }, model, sql)
    await auditCells(context, { insertedEntities: entitiesToInsert, updatedEntities: entitiesToUpdate }, sql)

    /**
     * Tags
     */
    
    if (Object.keys(tagsToUpdate).length > 0) {
        for (let key of Object.keys(tagsToUpdate)) {
            const vector = tagsToUpdate[key]
            key = key.split("|")
            const tagEntity = key[0]
            const vectorId = key[1]
            const dict = {}
            for (let tag_id of Object.keys(vector)) {
                const ids = vector[tag_id]
                dict[tag_id] = ids.join(",")
            }
            await sql.execute(updateCase({context, type: "updateCase", entity: tagEntity, column: vectorId, pairs: dict}))
        }
    }

    await sql.commit()
}

const foreignKeys = ({ entity }, model, propertyIds) => {
    const result = []
    for (let propertyId of propertyIds) {
        if (model.properties[propertyId]) {
            const entityId = model.properties[propertyId].entity
            if (entityId != entity) {
                const foreignKey = model.entities[entityId].foreignKey
                if (!result.includes(foreignKey)) result.push(foreignKey)
            }    
        }
    }
    return result
}

const dataHasEvolved = (properties, payload, data) => {
    for (let propertyId of Object.keys(payload)) {
        let value = payload[propertyId]
        if (properties[propertyId]) {
            const property = properties[propertyId]
            if (property.options.consistency) {
                if (value < data[propertyId]) {
                    return true
                }
            }
        }
    }
    return false
}

const dataToStore = (properties, payload, data) => {

    let cellsToStore = {}, tagsToUpdate = {}
    for (let propertyId of Object.keys(payload)) {
        let value = payload[propertyId]
        if (properties[propertyId]) {
            const property = properties[propertyId]
            
            /**
             * Tags
             */
            if (property.type == "tag") {
                value = (value) ? value.split(",") : []
                value = value.map((x) => { return parseInt(x) })
                const tagEntity = property.entity
                const tagKey = (property.key) ? property.key : "id"
                const vectorId = property.vector
                for (let tag of property.tags) {
                    const vector = tag[vectorId]
                    if (value.includes(tag[tagKey])) {
                        if (vector.length == 0 || !vector.includes(data.id)) {
                            vector.push(data.id)
                            if (!tagsToUpdate[`${tagEntity}|${vectorId}`]) tagsToUpdate[`${tagEntity}|${vectorId}`] = {}
                            tagsToUpdate[`${tagEntity}|${vectorId}`][tag[tagKey]] = vector
                        }
                    }
                    else if (vector.includes(data.id)) {
                        const newVector = []
                        for (let newId of vector) if (newId !== data.id) newVector.push(newId)
                        if (!tagsToUpdate[`${tagEntity}|${vectorId}`]) tagsToUpdate[`${tagEntity}|${vectorId}`] = {}
                        tagsToUpdate[`${tagEntity}|${vectorId}`][tag.id] = newVector
                    }
                }
            }

            else  {
                const current = (data[propertyId] === null) ? "" : data[propertyId]
                if (value && !current || value != current) {
                    cellsToStore[propertyId] = value
                }
            }
        }
    }
    
    return { cellsToStore, tagsToUpdate }
}

const entitiesToStore = (mainEntity, model, cellsToStore, payload, row) => {

    const data = {}

    /**
     * Retrieve foreign keys on already existing joined entities
     */
    for (let entityId of Object.keys(model.entities)) {
        const entity = model.entities[entityId]
        if (payload[entity.foreignKey]) data[entity.foreignKey] = payload[entity.foreignKey]
    }

    const entitiesToInsert = {}, entitiesToUpdate = {}
    for (let propertyId of Object.keys(cellsToStore)) {
        if (model.properties[propertyId]) {
            const value = cellsToStore[propertyId], property = model.properties[propertyId], entityId = property.entity

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

const storeEntities = async (context, mainEntity, { entitiesToInsert, entitiesToUpdate }, model, connection) => {

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
    }
    if (entitiesToInsert[mainEntity]) await insertEntity(mainEntity, { table: mainEntity })

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
    groupTabAction,
    dataHasEvolved,
    dataToStore,
    postGroupTabAction
}