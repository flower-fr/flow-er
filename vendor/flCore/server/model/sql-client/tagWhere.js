const util = require("util")

const { select } = require("../select")

const tagWhere = async ({context, entity, tags}, connection, logger) =>
{
    /**
     * Retrieve vector of tagged ids
     */
    let idsToKeep = []
    for (const name of tags) {
        const vector = (await connection.execute(select("tag", ["row_id", "name"], { entity, name }, null, null, context.config["tag/model"])))[0]
        idsToKeep = idsToKeep.length === 0 ? vector.map(r => r.row_id) : idsToKeep.filter(id => vector.some(r => r.row_id === id))
        for (const row of vector) {
            idsToKeep.push(row.row_id)
        }
    }

    logger && logger.debug(util.inspect({ idsToKeep }, { depth: null, colors: true }))
    
    return idsToKeep
}

module.exports = {
    tagWhere
}