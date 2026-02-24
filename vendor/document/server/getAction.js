const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const getAction = async ({ req }, context, { sql, logger }) => 
{
    const identifier = req.params.identifier
    assert(identifier, "Identifier is required")

    const entity = "document_cell"

    // gestion des paramètres de query
    const query = req.query

    const columns = query.columns ? query.columns.split(",") : ["identifier", "document_id", "content", "row", "column"]
    const where = { identifier } // pas de paramètre de query pour le where, on se base uniquement sur l'identifiant passé en paramètre de route
    const order = { "touched_at": "desc" } // pas de paramètre de query pour l'ordre, on se base sur la date de modification

    // fin gestion des paramètres de query

    try {

        const documentCells = await sql.execute({ context, type: "select", entity, columns, where, order })
        let result = null, i = 0

        logger && logger.debug(`Found the cells : ${util.inspect(documentCells, { color: true, depth: null })}`)

        while (result === null && i < documentCells.length) {
            const documentCell = documentCells[i]
            if (true) { // remplacer par une vérification du paramètre d'état afin de savoir si la cellule a été annulée
                result = documentCell
            }
            i++
        }

        if (result === null) { // si on a pas trouvé de cellule à renvoyer, on envoie une erreur
            throw throwBadRequestError("Document cell not found")
        }

        return result

    } catch (err) {
        console.log(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = {
    getAction
}