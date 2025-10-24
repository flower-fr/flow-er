const util = require("util")

const { dElete } = require("../delete")

const sqlDelete = async ({ context, entity, ids, debug }, model, connection, logger) =>
{
    const request = dElete(context, entity, ids, model, debug)
    logger && logger.debug(request)
    const result = await connection.execute(request)
    logger && logger.debug(util.inspect(result))
    return
}

module.exports = {
    sqlDelete
}