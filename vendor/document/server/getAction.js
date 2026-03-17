const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const getAction = async ({ req }, context, { sql, logger }) => 
{
    logger

    const identifier = req.params.identifier
    const document_id = assert.notEmpty(req.params, "document_id")
    const entity = assert.notEmpty(req.params, "entity")

    // gestion des paramètres de query
    const query = req.query
    const columns = query.columns ? query.columns.split(",") : ["identifier", "level", "parent", "previous", "content"]
    const where = { document_id }

    req.query?.where?.split("|").forEach(element => {
        const [key, value] = element.split(":")
        where[key] = value
    })

    if (identifier) where.identifier = identifier
    // fin gestion des paramètres de query

    try {
        const documentCells = await sql.execute({ context, type: "select", entity, columns: ["id", "identifier", "is_canceled"], where })
        const ids = {}
        for (const documentCell of documentCells) {
            if (!ids[documentCell.identifier] && documentCell.is_canceled === 0) {
                ids[documentCell.identifier] = documentCell
            }
            else if (ids[documentCell.identifier] && ids[documentCell.identifier].id < documentCell.id && documentCell.is_canceled === 0) {
                ids[documentCell.identifier] = documentCell
            }
        }
        const id = Object.values(ids).map(id => id.id)
        
        const result = await sql.execute({ context, type: "select", entity, columns, where : { id } })
        if (result === null) { // si on a pas trouvé de cellule à renvoyer, on envoie une erreur
            throw throwBadRequestError("Document cell not found")
        }

        return [ 200, result ]

    } catch (err) {
        console.log(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = {
    getAction
}