const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const patchAction = async ({ req }, context, { sql, logger }) => {

    const document_id = assert.notEmpty(req.params, "document_id"), action = assert.notEmpty(req.params, "action")
    const entity = "document_cell"
    let state

    if (action === "undo") state = "cancelled"
    else if (action === "redo") state = "active"
    else throw throwBadRequestError("Invalid action")

    const where = { document_id }
    const order = { id: "DESC"}
    state === "active" ? where.state = "cancelled" : where.state = "active"
    state === "active" ? order.id = "ASC" : order.id = "DESC"

    try {

        let ids = await sql.execute({ context, type: "select", entity, columns: ["id"], where, order, limit: 1 })
        ids = ids.map(id => id.id)

        logger && logger.debug(`Result of select : ${util.inspect(ids)}`)

        if (ids.length === 0) throw throwBadRequestError(`No cell to ${action}`)

        await sql.execute({ context, type: "update", entity, ids, data: { state } })
        return JSON.stringify({ response: "cellule insérée avec succès" })

    } catch (err) {
        logger && logger.debug(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = {
    patchAction,
}