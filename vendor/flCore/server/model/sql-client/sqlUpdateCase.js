const util = require("util")

const { encrypt } = require("./encrypt")
const { updateCase } = require("../updateCase")

const sqlUpdateCase = async ({ entity, column, pairs, user, context, debug }, model, connection, logger) =>
{
    if (!user) user = context?.user

    // Encryption
    if (model.properties[column].sensitive) {
        for (const [id, value] of Object.entries(pairs)) {
            if (value) {
                pairs[id] = encrypt(context, value)
            }
        }
    }

    const request = updateCase(entity, column, pairs, model, user, context, debug)
    logger && logger.debug(request)
    const result = await connection.execute(request)
    logger && logger.debug(util.inspect(result[0]))
    return
}

module.exports = {
    sqlUpdateCase
}