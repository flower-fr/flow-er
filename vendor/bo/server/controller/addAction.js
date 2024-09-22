const { assert, throwConflictError } = require("../../../../core/api-utils")
const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")
const { insert } = require("../../../flCore/server/model/insert")
const { updateCase } = require("../../../flCore/server/model/updateCase")
const { getProperties } = require("./getProperties")
const { renderAdd } = require("../view/renderAdd")

const addAction = async ({ req }, context, db) => {
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

    let addConfig = context.config[`${entity}/add/${view}`]
    const propertyDefs = addConfig.properties
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
    
    return renderAdd(context, entity, view, properties, where, "formJwt à construire")
}

const dataToStore = async (properties, form) => {

    const cellsToInsert = {}
    for (let propertyId of Object.keys(form)) {
        let value = form[propertyId]
        if (properties[propertyId]) {
            if (value) {
                cellsToInsert[propertyId] = value
            }
        }
    }

    return { cellsToInsert }
}

const postAddAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    // Check authorization
    /*$formJwt = $this->request->getPost('formJwt');
    if (!Authorization::verifyJwt($formJwt)) {
        $this->response->setStatusCode('401');
    }*/

    let addConfig = context.config[`${entity}/add/${view}`]
    if (!addConfig) addConfig = context.config[`${entity}/add`]
    const propertyDefs = addConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, [])
    const model = context.config[`${entity}/model`]

    await db.beginTransaction()

    const form = req.body
    
    /**
     * Find out the data to actually update in the database 
     */
    let { cellsToInsert } = await dataToStore(properties, form)

    /**
     * Insert
     */
    const [insertedRow] = (await db.execute(insert(context, entity, cellsToInsert, model)))

    /**
     * Audit
     */
    for (let propertyId of Object.keys(cellsToInsert)) {
        if (model.properties[propertyId].audit) {
            const value = cellsToInsert[propertyId]
            const auditToInsert = {
                entity: entity,
                row_id: insertedRow.insertId,
                property: propertyId,
                value: value
            }
            await db.execute(insert(context, "audit", auditToInsert, context.config["audit/audit"]))
        }
    }

    await db.commit()
}

module.exports = {
    addAction,
    postAddAction
}