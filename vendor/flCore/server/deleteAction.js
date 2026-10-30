const { assert } = require("../../../core/api-utils")
const { updateColumns } = require("./post/updateColumns")
const util = require("util")

const { throwBadRequestError, throwUnauthorized } = require("../../../core/api-utils")
const { isDeleteAllowed } = require("./aclHandler")

const deleteAction = async ({ req }, context, { sql, logger }) => {
    const entity = assert.notEmpty(req.params, "entity")
    if (!isDeleteAllowed(entity, context)) return throwUnauthorized()

    let id = req.params.id

    try {
        await sql.beginTransaction()
        const model = context.config[`${entity}/model`], table = model.entities[entity].table
        const columnsToUpdate = {}, pairs = {}
        if (id) {
            pairs[id] = "deleted"
        }
        else {
            for (const row of req.body) {
                pairs[row.id] = "deleted"
            }
        }
        columnsToUpdate[table] = { visibility: pairs }
        await updateColumns(context, columnsToUpdate, null, sql)
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