const { assert, throwConflictError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { insert } = require("../../../flCore/server/model/insert")
const { updateCase } = require("../../../flCore/server/model/updateCase")
const { getProperties } = require("./getProperties")

const updateAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
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

    let updateConfig = context.config[`${entity}/update/${view}`]
    const propertyDefs = updateConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, [])
    
    /**
     * Data source
     */
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
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
            for (let columnId of property.format[1].split(",")) sourceColumns.push(columnId)
            
            const modalities = (await db.execute(select(context, sourceEntity, sourceColumns, sourceWhere, null, null, context.config[`${property.entity}/model`])))[0]
            property.modalities = {}
            for (let modality of modalities) {
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

    // Retrieve the existing row

    const model = context.config[`${entity}/model`]
    let row
    if (id) {
        const columns = Object.keys(propertyDefs).concat(["id"])
        row = (await db.execute(select(context, entity, columns, { "id": id }, null, null, model)))[0][0]
    }
    
    const data = { id, updateConfig, properties, row, isDeletable: false, where, formJwt: "formJwt à construire" }
    return JSON.stringify(data)
}

const dataHasEvolved = (properties, form, data) => {
    for (let propertyId of Object.keys(form)) {
        let value = form[propertyId]
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

const dataToStore = async (mainEntity, properties, form, data, model) => {

    var cellsToUpdate = {}, tagsToUpdate = {}
    for (let propertyId of Object.keys(form)) {
        let value = form[propertyId]
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
                    cellsToUpdate[propertyId] = value
                }
            }
        }
    }

    const entitiesToInsert = {}, entitiesToUpdate = {}
    for (let propertyId of Object.keys(cellsToUpdate)) {
        if (model.properties[propertyId]) {
            const value = cellsToUpdate[propertyId]
            const property = model.properties[propertyId]

            const { table, foreignEntity, foreignKey } = 
                (model.entities[property.entity])
                ? { 
                    table: model.entities[property.entity].table,
                    foreignEntity: model.entities[property.entity].foreignEntity,
                    foreignKey: model.entities[property.entity].foreignKey
                }
                : { table: mainEntity, foreignKey: "id" }

            let idToUpdate = data[foreignKey]
            if (idToUpdate === null) idToUpdate = 0
            if (idToUpdate == 0) {
                if (!entitiesToInsert[table]) entitiesToInsert[table] = {
                    cells: {},
                    foreignEntity: foreignEntity,
                    foreignKey: foreignKey,
                }
                entitiesToInsert[table].cells[property.column] = value
            }
            else {
                if (!entitiesToUpdate[table]) entitiesToUpdate[table] = { 
                    rowId: idToUpdate,
                    cells: {}
                }
                entitiesToUpdate[table].cells[property.column] = value
            }
        }
    }

    return { entitiesToInsert, entitiesToUpdate, tagsToUpdate }
}

const postUpdateAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")
    const view = (req.query.view) ? req.query.view : "default"

    let updateConfig = context.config[`${entity}/update/${view}`]
    if (!updateConfig) updateConfig = context.config[`${entity}/update`]
    const propertyDefs = updateConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, [])

    // Retrieve the existing row

    const model = context.config[`${entity}/model`]
    const columns = Object.keys(model.properties)
    const row = (await db.execute(select(context, entity, columns, { "id": id }, null, null, model)))[0][0]

    await db.beginTransaction()

    // Check authorization
    /*$formJwt = $this->request->getPost('formJwt');
    if (!Authorization::verifyJwt($formJwt)) {
        $this->response->setStatusCode('401');
    }*/

    const form = req.body

    /**
     * Consistency: Data updated by someone else in the meantime
     */
    if (dataHasEvolved(properties, form, row)) {
        return await throwConflictError("Consistency")
    }

    /**
     * Find out the data to actually update in the database 
     */
    let { entitiesToInsert, entitiesToUpdate, tagsToUpdate  } = await dataToStore(entity, properties, form, row, model)

    /**
     * Insert
     */
    for (let entityToInsert of Object.keys(entitiesToInsert)) {
        const cellsToInsert = entitiesToInsert[entityToInsert].cells
        const foreignEntity = entitiesToInsert[entityToInsert].foreignEntity
        const foreignKey = entitiesToInsert[entityToInsert].foreignKey
        const insertingModel = context.config[`${entityToInsert}/model`]
        const [insertedRow] = (await db.execute(insert(context, entityToInsert, cellsToInsert, insertingModel)))
        if (foreignEntity) {
            if (!entitiesToUpdate[foreignEntity]) {
                entitiesToUpdate[foreignEntity] = { 
                    rowId: row[foreignKey],
                    cells: {}
                }
            }
            entitiesToUpdate[foreignEntity].cells[foreignKey] = insertedRow.insertId
        }

        /**
         * Audit
         */
        for (let propertyId of Object.keys(cellsToInsert)) {
            if (model.properties[propertyId].audit) {
                const value = cellsToInsert[propertyId]
                const auditToInsert = {
                    entity: entityToInsert,
                    row_id: insertedRow.insertId,
                    property: propertyId,
                    value: value
                }
                await db.execute(insert(context, "audit", auditToInsert, context.config["audit/audit"]))
            }
        }
    }

    /**
     * Update
     */
    for (let entityToUpdate of Object.keys(entitiesToUpdate)) {
        const rowId = entitiesToUpdate[entityToUpdate].rowId 
        const cellsToUpdate = entitiesToUpdate[entityToUpdate].cells 
        const updatingModel = context.config[`${entityToUpdate}/model`]
        await db.execute(update(context, entityToUpdate, [rowId], cellsToUpdate, updatingModel))

        /**
         * Audit
         */
        for (let propertyId of Object.keys(cellsToUpdate)) {
            if (model.properties[propertyId].audit) {
                const value = cellsToUpdate[propertyId]
                const auditToInsert = {
                    entity: entityToUpdate,
                    row_id: rowId,
                    property: propertyId,
                    value: value
                }
                await db.execute(insert(context, "audit", auditToInsert, context.config["audit/model"]))
            }
        }
    }

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
            await db.execute(updateCase(context, tagEntity, vectorId, dict))
        }
    }

    await db.commit()
}

module.exports = {
    updateAction,
    dataHasEvolved,
    dataToStore,
    postUpdateAction
}