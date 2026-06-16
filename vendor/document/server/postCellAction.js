const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const postCellAction = async ({ req }, context, { sql, logger }) =>
{
    const document_id = assert.notEmpty(req.params, "document_id")

    logger && logger.debug(`postAction called with body: ${util.inspect(req.body)}`)
    
    const items = Array.isArray(req.body) ? req.body : [req.body]
    for (const item of items) {
        checkParams({ body: item }, context) // we check that the params are valid
    }

    // we set the state param at active
    for (const data of items) {
        data.is_canceled = 0
        data.document_id = parseInt(document_id)
        if (!data.identifier) {
            data.identifier = null
        }
    }

    try {
        await sql.beginTransaction()

        for (const data of items) {
            const id = await sql.execute({ context, type: "insert", entity: "document_cell", data })
            if (!data.identifier) {
                await sql.execute({ context, type: "update", entity: "document_cell", ids: [id], data: { identifier: id } })
            }
        }
        await sql.commit()
        return JSON.stringify({ response: `${items.length} cellule insérée avec succès` })

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
    postCellAction,
}