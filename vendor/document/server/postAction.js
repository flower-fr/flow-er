const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const postAction = async ({ req }, context, { sql, logger }) => {

    const document_id = assert.notEmpty(req.params, "document_id")

    logger && logger.debug(`postAction called with body: ${util.inspect(req.body)}`)
    
    checkParams(req, context) // we check that the params are valid

    const entity = assert.notEmpty(req.params, "entity")
    const data = req.body

    // we set the state param at active
    data.is_canceled = 0
    data.document_id = parseInt(document_id)
    if (!data.identifier) {
        data.identifier = null
    }

    try {
        await sql.beginTransaction()

        const id = await sql.execute({ context, type: "insert", entity, data })
        if (!data.identifier) {
            await sql.execute({ context, type: "update", entity, ids: [id], data: { identifier: id } })
        }
        await sql.commit()
        return JSON.stringify({ response: "cellule insérée avec succès" })

    } catch (err) {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }
}

const checkParams = (req, context) => {

    // we check that the body is not empty
    assert.notEmpty(req.body, "content")

    // we check that the body does not contain any field that is not in the model
    const properties = Object.keys(context.config["document_cell/model"].properties)
    for (const key in req.body) {
        if (!properties.includes(key)) {
            throw throwBadRequestError(`Invalid field: ${key}`)
        }
    }
}

module.exports = {
    postAction,
}