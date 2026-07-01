const util = require("util")

const { decrypt } = require("./encrypt")
const { select } = require("../select")
const { sensitiveWhere } = require("./sensitiveWhere")
const { tagWhere } = require("./tagWhere")

const sqlSelect = async ({ entity, columns, where = {}, tags, order, limit = 1000, user, context, debug }, model, connection, logger) =>
{
    if (!user) user = context?.user
    where = await sensitiveWhere({context, model, where}, connection, logger)
    if (tags) {
        const tagFilter = await tagWhere({context, entity, tags}, connection, logger)
        if (where.id) {
            where.id = where.id.filter(id => tagFilter.includes(id))
        } else {
            where.id = tagFilter
        }
    }
    for (const value of Object.values(where)) {
        if (value.length == 0) return [] // No rows matching a rule on sensitive property
    }
    const request = select(entity, columns, where || {}, order, limit, model, user, debug)
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
                data[key] = JSON.parse(value)
            } else {
                data[key] = value
            }
        }
        result.push(data)
    }
    return result
}

module.exports = {
    sqlSelect
}