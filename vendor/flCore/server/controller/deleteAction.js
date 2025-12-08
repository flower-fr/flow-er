const { assert } = require("../../../../core/api-utils")
const { updateColumns } = require("../../../flCore/server/post/updateColumns")
const util = require("util")

const { throwBadRequestError } = require("../../../../core/api-utils")

const deleteAction = async ({ req }, context, { sql, logger }) => {
    const entity = assert.notEmpty(req.params, "entity")
    let id = req.params.id
    if (!id) id = req.body[0] && req.body[0].id

    try {
        await sql.beginTransaction()
        const model = context.config[`${entity}/model`], table = model.entities[entity].table
        const columnsToUpdate = {}, pair = {}
        pair[id] = "deleted"
        columnsToUpdate[table] = { visibility: pair }
        updateColumns(context, columnsToUpdate, null, sql)
        await sql.commit()
        return JSON.stringify({ "status": "ok" })
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }
}

module.exports = {
    deleteAction
}