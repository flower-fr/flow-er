const mysql2 = require("mysql2/promise")

const { dElete } = require("./delete")
const { insert } = require("./insert")
const { select } = require("./select")
const { update } = require("./update")

const createSqlClient = ({ config, logger, dbName }) => 
{
    const db = mysql2.createPool({
        connectionLimit: 100,
        host: config.host,
        port: config.port, 
        user: config.user, 
        password: config.password, 
        database : (dbName) ? dbName : config.database
    })
    return {
        execute: execute({ logger, db })
    }
}

const execute = ({ logger, db }) => async (options) => 
{
    const connection = await db.getConnection()
    const { context, type, entity } = options
    if (!context) throw new Error("missing context")
    if (!type) throw new Error("missing type")
    if (!entity) throw new Error("missing entity")
    logger && logger.debug(`request ${ type } executed on entity ${ entity }`)
    const result = await sql(options, connection, logger)
    return result
}

const sql = async ({ context, type, entity, columns, where, order, limit, ids, data, debug }, connection, logger) =>
{
    const model = context.config[`${ entity }/model`]
    if (type === "select") {
        const request = select(context, entity, columns, where || {}, order, limit, model, debug)
        logger && logger.debug(request)
        const cursor = (await connection.execute(request))[0]
        const result = []
        for (const row of cursor) {
            const data = {}
            for (const [key, value] of Object.entries(row)) {
                if (model.properties[key].type === "json") {
                    data[key] = JSON.parse(value)
                } else {
                    data[key] = value
                }
            }
            result.push(data)
        }
        logger && logger.debug(result)
        return result
    } else if (type === "insert") {
        const request = insert(context, entity, data, model, debug)
        logger && logger.debug(request)
        const insertedRows = await connection.execute(request)
        logger && logger.debug(insertedRows)
        return insertedRows[0].insertId
    } else if (type === "update") {
        const request = update(context, entity, ids, data, model, debug)
        logger && logger.debug(request)
        const result = await connection.execute(request)
        logger && logger.debug(result[0])
        return
    } else if (type === "delete") {
        const request = dElete(context, entity, ids, model, debug)
        logger && logger.debug(request)
        const result = await connection.execute(request)
        logger && logger.debug(result)
        return
    }
}

module.exports = {
    createSqlClient
}