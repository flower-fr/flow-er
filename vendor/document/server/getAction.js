// const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const getAction = async ({ req }, context, { sql, logger }) => 
{
    logger

    const identifier = req.params.identifier, entity = "document_cell"

    // gestion des paramètres de query
    const query = req.query
    const columns = query.columns ? query.columns.split(",") : ["identifier", "document_id", "content", "row", "column"]
    // fin gestion des paramètres de query

    try {
        const documentCells = await sql.execute({ context, type: "select", entity, columns: ["id", "identifier", "state", "touched_at"], where : (identifier) ? { identifier } : {} })
        const ids = {}
        for (const documentCell of documentCells) {
            if (!ids[documentCell.identifier] && documentCell.state === "active") {
                ids[documentCell.identifier] = documentCell
            }
            else if (ids[documentCell.identifier] && ids[documentCell.identifier].touched_at < documentCell.touched_at && documentCell.state === "active") {
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