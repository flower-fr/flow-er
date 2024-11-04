const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("../../../bo/server/controller/getProperties")
const { getList } = require("../../../bo/server/controller/getList")
const { select } = require("../../../flCore/server/model/select")

const util = require('util')

const getAction = async ({ req }, context, db) => {

    const entity = assert.notEmpty(req.params, "entity")
    //const name = req.params.name
    const id = req.params.id
    const version = req.params.version

    const where = (req.query.where) ? req.query.where : null
    const order = (req.query.order) ? req.query.order : "name"
    const limit = (req.query.limit) ? req.query.limit : 1000

    const whereParam = (where != null) ? where.split("|") : []
    //if (name) whereParam.push(`name:${name}`)
    if (id) whereParam.push(`id:${id}`)
    if (version) whereParam.push(`version:${version}`)

    /**
     * Properties definition
     */
    let viewConfig = context.config[`${entity}/update/default`]
    const propertyDefs = viewConfig.properties
    const properties = await getProperties(db, context, entity, "default", propertyDefs, whereParam)
        
    /**
     * List of DB columns to retrieve
     */
    let columns
    // if (version) {
    columns = null
    // }
    // else {
    //     columns = Object.keys(context.config[`${entity}/view/default`].properties)
    //     columns = columns.concat(["id"])    
    // }

    /**
     * List of DB columns to retrieve
     */
    const data = await getList(db, context, entity, "default", columns, properties, whereParam, order, limit)

    const result = {}
    for (let row of data) {
        const obj = {}
        for (let key of Object.keys(row)) {
            if (row[key] != null) obj[key] = row[key]
        }

        /**
         * Retrieve single document parts
         */
        //if (version) {
        const partModel = context.config[`document_text/model`]
        const parts = (await db.execute(select(context, "document_text", null, { "id": row.content_vector.split(",") }, null, null, partModel)))[0]
        obj.parts = parts
        //}

        if (!result[row.name] || result[row.name].version < obj.version) result[row.name] = obj
    }
    return { 
        "status": "ok", 
        "rows": Object.values(result), 
        "properties": properties,

        /**
         * Transient
         */
        "id": id,
        "updateConfig": context.config[`${entity}/update/default`],
        "row": Object.values(result)[0],
    }
}

module.exports = {
    getAction
}