const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const patchAction = async ({ req }, context, { sql, logger }) => {

    const document_id = assert.notEmpty(req.params, "document_id"), action = assert.notEmpty(req.params, "action")
    const entity = assert.notEmpty(req.params, "entity")
    let is_canceled

    if (action === "undo") is_canceled = 1
    else if (action === "redo") is_canceled = 0
    else throw throwBadRequestError("Invalid action")

    const where = { document_id }
    const order = { id: "DESC"}
    is_canceled === 0 ? where.is_canceled = 1 : where.is_canceled = 0
    is_canceled === 0 ? order.id = "ASC" : order.id = "DESC"

    try {

        let ids = await sql.execute({ context, type: "select", entity, columns: ["id"], where, order, limit: 1 })
        ids = ids.map(id => id.id)

        logger && logger.debug(`Result of select : ${util.inspect(ids)}`)

        if (ids.length === 0) throw throwBadRequestError(`No cell to ${action}`)

        await sql.execute({ context, type: "update", entity, ids, data: { is_canceled } })
        return JSON.stringify({ response: "cellule insérée avec succès" })

    } catch (err) {
        logger && logger.debug(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = {
    patchAction,
}