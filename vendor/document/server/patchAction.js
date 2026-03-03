const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const patchAction = async ({ req }, context, { sql, logger }) => {

    const ids = [ assert.notEmpty(req.params, "id") ], action = assert.notEmpty(req.params, "action")
    const entity = "document_cell"
    let state

    if (action === "undo") state = "cancelled"
    else if (action === "redo") state = "active"
    else throw throwBadRequestError("Invalid action")

    try {

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