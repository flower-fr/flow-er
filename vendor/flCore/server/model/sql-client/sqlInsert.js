const util = require("util")

const { encrypt } = require("./encrypt")
const { insert } = require("../insert")

const sqlInsert = async ({ context, entity, data, params, debug }, model, connection, logger) =>
{
    logger && logger.debug(util.inspect({ entity, data, params }))
    
    // Encryption
    for (const [key, value] of Object.entries(data)) {
        if (model.properties[key].sensitive && value) {
            data[key] = encrypt(context, value)
        }
    }
    
    const request = insert(context, entity, data, model, debug)
    logger && logger.debug(request)
    const insertedRows = await connection.execute(request, params)
    logger && logger.debug(util.inspect(insertedRows))
    return insertedRows[0].insertId
}

module.exports = {
    sqlInsert
}