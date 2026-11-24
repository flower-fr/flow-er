const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")

const getDocument = async ({ req }, context, { sql, logger }) => 
{
    const document_id = assert.notEmpty(req.params, "document_id")

    const document = await sql.execute({ context, type: "select", entity: "document_binary", columns: ["mime", "data"], where: { id: [document_id] } })

    if (!document || document.length === 0) {
        throwBadRequestError(`Document with id ${document_id} not found`)
    }

    const doc = document[0]
    return [200, doc.data, doc.mime]
}

module.exports = {
    getDocument
}