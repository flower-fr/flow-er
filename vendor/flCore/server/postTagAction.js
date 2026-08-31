const { assert } = require("../../../core/api-utils")
const { throwBadRequestError } = require("../../../core/api-utils")
const util = require("util")

const postTagAction = async ({ req }, context, { sql, logger }) =>
{
    try {
        await sql.beginTransaction()

        const { entity, name, rowIds } = req.body
        logger && logger.debug(util.inspect(req.body, { depth: null, colors: true }))

        const tags = await sql.execute({ context, type: "select", entity: "tag", columns: ["id", "row_id"], where: { entity, name }, order: { name: "asc" }, limit: null })
        const alreadyTagged = tags.map(x => x.row_id)
        const tagsToInsert = rowIds.reduce((acc, rowId) => {
            if (!alreadyTagged.find(x => x === rowId)) acc.push(rowId)
            return acc
        }, [])
        logger && logger.debug(util.inspect({tagsToInsert}, { depth: null, colors: true }))

        for (const row_id of tagsToInsert) {
            await sql.execute({ context, type: "insert", entity: "tag", data: { entity, name, row_id } })
        }

        await sql.commit()
        return JSON.stringify({ "status": "ok", "stored": tagsToInsert })
    }
    catch (err) {
        logger && logger.debug(util.inspect(err))
        await sql.rollback()
        throw throwBadRequestError()
    }
}

module.exports = postTagAction