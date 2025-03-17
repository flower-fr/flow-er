const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")

const { dataToStore } = require("../post/dataToStore")
const { entitiesToStore } = require("../post/entitiesToStore")
const { storeEntities } = require("../post/storeEntities")
const { updateColumns } = require("../post/updateColumns")
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

        let { rowsToStore, rowsToReject } = dataToStore(entity, model, form)

        if (rowsToReject.length > 0) {
            return JSON.stringify({ "status": "ko", "errors": rowsToReject })
        }
        
        /**
         * Find out the entities to insert vs update in the database 
         */

        rowsToStore = entitiesToStore(entity, model, rowsToStore)
        const columnsToUpdate = await storeEntities(context, entity, rowsToStore, model, connection)
        await updateColumns(context, columnsToUpdate, model, connection)
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
    postAction
}