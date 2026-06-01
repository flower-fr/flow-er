const util = require("util")

const { encrypt } = require("./encrypt")
const { update } = require("../update")

const sqlUpdate = async ({ entity, ids, data, user, context, debug }, model, connection, logger) =>
{
    if (!user) user = context?.user

    // Encryption
    for (const [key, value] of Object.entries(data)) {
        if (model.properties[key].sensitive && value) {
            data[key] = encrypt(context, value)
        }
    }

    const request = update(entity, ids, data, model, user, context, debug)
    logger && logger.debug(request)
    const result = await connection.execute(request)
    logger && logger.debug(util.inspect(result[0]))
    return
}

module.exports = {
    sqlUpdate
}