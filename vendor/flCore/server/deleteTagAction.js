const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const deleteTagAction = async ({ req }, context, { sql, logger }) =>
{
    try {
        const { entity, name, rowIds } = req.body
        logger && logger.debug(util.inspect(req.body, { depth: null, colors: true }))

        const tags = await sql.execute({ context, type: "select", entity: "tag", columns: ["id", "row_id"], where: { entity, name }, order: { name: "asc" }, limit: null })
        const alreadyTagged = tags.map(x => x)
        const tagsToDelete = rowIds.reduce((acc, row_id) => {
            const alreadyTaggedId = alreadyTagged.find(x => x.row_id === row_id)
            if (alreadyTaggedId) acc.push(alreadyTaggedId.id)
            return acc
        }, [])
        logger && logger.debug(util.inspect({tagsToDelete}, { depth: null, colors: true }))

        await sql.execute({ context, type: "delete", entity: "tag", ids: tagsToDelete })

        return JSON.stringify({ "status": "ok", "deleted": tagsToDelete })
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        throw throwBadRequestError()
    }
}

module.exports = deleteTagAction