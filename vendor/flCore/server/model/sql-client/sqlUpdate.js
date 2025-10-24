const util = require("util")

const { encrypt } = require("./encrypt")
const { update } = require("../update")

const sqlUpdate = async ({ context, entity, ids, data, debug }, model, connection, logger) =>
{
    // Encryption
    for (const [key, value] of Object.entries(data)) {
        if (model.properties[key].sensitive && value) {
            data[key] = encrypt(context, value)
        }
    }

    const request = update(context, entity, ids, data, model, debug)
    logger && logger.debug(request)
    const result = await connection.execute(request)
    logger && logger.debug(util.inspect(result[0]))
    return
}

module.exports = {
    sqlUpdate
}