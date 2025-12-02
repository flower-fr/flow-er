const util = require("util")

const { decrypt } = require("./encrypt")
const { select } = require("../select")
const { sensitiveWhere } = require("./sensitiveWhere")

const sqlSelect = async ({ context, entity, columns, where, order, limit = 1000, debug }, model, connection, logger) =>
{
    where = await sensitiveWhere({context, model, where}, connection, logger)
    for (const value of Object.values(where)) {
        if (value.length == 0) return [] // No rows matching a rule on sensitive property
    }
    const request = select(context, entity, columns, where || {}, order, limit, model, debug)
    logger && logger.debug(`SELECT request: ${request}`)
    const cursor = (await connection.execute(request))[0]
    const result = []
    for (const row of cursor) {
        const data = {}
        for (let [key, value] of Object.entries(row)) {

            // Decryption
            if (model.properties[key].sensitive && value) {
                value = decrypt(context, value)
            }

            if (model.properties[key].type === "json") {
                console.log("unparsed json : ", value)
                data[key] = JSON.parse(value)
            } else {
                data[key] = value
            }
        }
        result.push(data)
    }
    logger && logger.debug(`SELECT result: ${util.inspect(result)}`)
    return result
}

module.exports = {
    sqlSelect
}