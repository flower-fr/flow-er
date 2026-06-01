const util = require("util")

const { dElete } = require("../delete")

const sqlDelete = async ({ entity, ids, user, context, debug }, model, connection, logger) =>
{
    if (!user) user = context?.user
    const request = dElete(entity, ids, model, user, context, debug)
    logger && logger.debug(request)
    const result = await connection.execute(request)
    logger && logger.debug(util.inspect(result))
    return
}

module.exports = {
    sqlDelete
}