const { assert } = require("../../../../core/api-utils")
const { updateColumns } = require("../../../flCore/server/post/updateColumns")

const { throwBadRequestError } = require("../../../../core/api-utils")

const deleteAction = async ({ req }, context, { db }) => {
    const entity = assert.notEmpty(req.params, "entity")
    const id = assert.notEmpty(req.params, "id")

    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()
        const model = context.config[`${entity}/model`], table = model.entities[entity].table
        const columnsToUpdate = {}, pair = {}
        pair[id] = "deleted"
        columnsToUpdate[table] = { visibility: pair }
        updateColumns(context, columnsToUpdate, null, connection)
        await connection.commit()
        connection.release()
        return JSON.stringify({ "status": "ok" })
    }
    catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    deleteAction
}