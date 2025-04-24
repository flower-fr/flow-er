const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")

const { dataToStore } = require("../model/dataToStore")
const { entitiesToStore } = require("../model/entitiesToStore")
const { storeEntities } = require("../post/storeEntities")
const { auditCells } = require("../post/auditCells")

const postAction = async ({ req }, context, { db }) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = (req.query.id) ? req.query.id : 0

    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        const model = context.config[`${entity}/model`]
        const form = req.body

        /**
         * Find out the data to actually store in the database 
         */

        let { rowsToStore, rowsToReject } = dataToStore(model, form)

        if (rowsToReject.length > 0) {
            return JSON.stringify({ "status": "ko", "errors": rowsToReject })
        }
        
        /**
         * Find out the entities to insert vs update in the database 
         */

        rowsToStore = entitiesToStore(entity, model, rowsToStore)

        /**
         * Apply and audit the changes in the database
         */
        await storeEntities(context, entity, rowsToStore, model, connection)
        await auditCells(context, rowsToStore, connection)

        await connection.commit()
        connection.release()
        return JSON.stringify({ "status": "ok", "stored": rowsToStore })
    }
    catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

const postFormAction = async ({ req }, context, { db }) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = (req.query.id) ? req.query.id : 0

    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        const model = context.config[`${entity}/model`]
        const form = [req.body]

        const file = req.file && req.file.buffer
        if (file) form[0].logo = file

        /**
         * Find out the data to actually store in the database 
         */

        let { rowsToStore, rowsToReject } = dataToStore(model, form)

        if (rowsToReject.length > 0) {
            return JSON.stringify({ "status": "ko", "errors": rowsToReject })
        }
        
        /**
         * Find out the entities to insert vs update in the database 
         */

        rowsToStore = entitiesToStore(entity, model, rowsToStore)

        /**
         * Apply and audit the changes in the database
         */
        await storeEntities(context, entity, rowsToStore, model, connection)
        await auditCells(context, rowsToStore, connection)

        await connection.commit()
        connection.release()
        return JSON.stringify({ "status": "ok", "stored": rowsToStore })
    }
    catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    postAction,
    postFormAction
}