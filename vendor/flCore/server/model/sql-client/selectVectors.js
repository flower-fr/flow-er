const util = require("util")

const { sqlSelect } = require("./sqlSelect")

const selectVectors = async ({context, vectors, debug}, model, connection, logger) =>
{
    const result = {}
    for (const vectorId of (vectors) ? vectors : []) {
        const vectorDef = model.vectors[vectorId]
        const vectorModel = context.config[`${ vectorDef.entity }/model`]
        result[vectorId] = await sqlSelect({ context, entity: vectorDef.entity, columns: vectorDef.columns, where: vectorDef.where, order: vectorDef.order, debug }, vectorModel, connection, logger)
    }
    logger && logger.debug(util.inspect(vectors))
    return result
}

module.exports = {
    selectVectors
}