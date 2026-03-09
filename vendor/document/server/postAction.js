const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const postAction = async ({ req }, context, { sql, logger }) => {

    const document_id = assert.notEmpty(req.params, "document_id")

    logger && logger.debug(`postAction called with body: ${util.inspect(req.body)}`)
    
    checkParams(req, context) // we check that the params are valid

    const entity = "document_cell", data = req.body

    // we set the state param at active
    data.state = "active"
    data.document_id = document_id

    try {

        await sql.execute({ context, type: "insert", entity, data })
        return JSON.stringify({ response: "cellule insérée avec succès" })

    } catch (err) {
        logger && logger.debug(util.inspect(err))
        throw throwBadRequestError()
    }
}

const checkParams = (req, context) => {

    // we check that the body is not empty
    assert.notEmpty(req.body, "identifier", "content")

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