const util = require("util")

const { sqlSelect } = require("./sqlSelect")

const selectVectors = async ({context, vectors, args, debug}, model, connection, logger) =>
{
    const result = {}
    for (const vectorId of (vectors) ? vectors : []) {
        const vectorDef = model.vectors[vectorId]
        const vectorModel = context.config[`${ vectorDef.entity }/model`]
        const where = {}
        for (const [key, param] of Object.entries(vectorDef.where)) {
            where[key] = (param == "?") ? args[key] : param
        }
        result[vectorId] = await sqlSelect({ context, entity: vectorDef.entity, columns: vectorDef.columns, where, order: vectorDef.order, debug }, vectorModel, connection, logger)
    }
    logger && logger.debug(util.inspect(vectors))
    return result
}

module.exports = {
    selectVectors
}