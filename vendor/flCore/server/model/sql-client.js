const mysql2 = require("mysql2/promise")
const util = require("util")

const { dElete } = require("./delete")
const { decrypt, encrypt } = require("./encrypt")
const { insert } = require("./insert")
const { select } = require("./select")
const { sensitiveWhere } = require("./sensitiveWhere")
const { update } = require("./update")
const { updateCase } = require("./updateCase")

const createSqlClient = async ({ config, logger, dbName }) => 
{
    const db = mysql2.createPool({
        connectionLimit: 100,
        host: config.host,
        port: config.port, 
        user: config.user, 
        password: config.password, 
        database : (dbName) ? dbName : config.database
    })
    const closure = {
        db,
        connection: db
    } 
    return {
        getConnection: getConnection({ logger, closure }),
        beginTransaction: beginTransaction({ logger, closure }),
        execute: execute({ logger, closure }),
        commit: commit({ logger, closure }),
        rollback: rollback({ logger, closure }),
        releaseConnection: releaseConnection({ logger, closure })
    }
}

const beginTransaction = ({ logger, closure }) => async () => 
{
    await closure.connection.beginTransaction()
    logger && logger.debug("Transaction initiated")
}

const commit = ({ logger, closure }) => async () => 
{
    await closure.connection.commit()
    logger && logger.debug("Transaction committed")
}

const getConnection = ({ logger, closure }) => async () => 
{
    closure.connection = await closure.connection.getConnection()
    logger && logger.debug("Connection to db obtained")
}
            
const execute = ({ logger, closure }) => async (options) => 
{
    const { context, type, entity } = options
    if (!context) throw new Error("missing context")
    if (!type) throw new Error("missing type")
    if (!entity) throw new Error("missing entity")
    logger && logger.debug(`request ${ type } executed on entity ${ entity }`)
    const result = await sql(options, closure.connection, logger)
    return result
}

const releaseConnection = ({ logger, closure }) => async () => 
{
    await closure.connection.release()
    closure.connection = closure.db
    logger && logger.debug("Connection released")
}
    
const rollback = ({ logger, closure }) => async () => 
{
    await closure.connection.rollback()
    logger && logger.debug("Transaction rolled back")
}

const sql = async ({ context, type, entity, columns, where, order, limit, ids, data, column, pairs, debug }, connection, logger) =>
{
    const model = context.config[`${ entity }/model`]
    if (type === "select") {
        where = await sensitiveWhere({context, model, where}, connection, logger)
        for (const value of Object.values(where)) {
            if (value.length == 1) return [] // No rows matching a rule on sensitive property
        }
        const request = select(context, entity, columns, where || {}, order, limit, model, debug)
        logger && logger.debug(request)
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
        logger && logger.debug(util.inspect(result))
        return result
        
    } else if (type === "insert") {

        // Encryption
        for (const [key, value] of Object.entries(data)) {
            if (model.properties[key].sensitive && value) {
                data[key] = encrypt(context, value)
            }
        }
        
        const request = insert(context, entity, data, model, debug)
        logger && logger.debug(request)
        const insertedRows = await connection.execute(request)
        logger && logger.debug(util.inspect(insertedRows))
        return insertedRows[0].insertId

    } else if (type === "update") {
        const request = update(context, entity, ids, data, model, debug)
        logger && logger.debug(request)
        const result = await connection.execute(request)
        logger && logger.debug(util.inspect(result[0]))
        return
    } else if (type === "updateCase") {
        const request = updateCase(context, entity, column, pairs, model, debug)
        logger && logger.debug(request)
        const result = await connection.execute(request)
        logger && logger.debug(util.inspect(result[0]))
        return
    } else if (type === "delete") {
        const request = dElete(context, entity, ids, model, debug)
        logger && logger.debug(request)
        const result = await connection.execute(request)
        logger && logger.debug(util.inspect(result))
        return
    }
}

module.exports = {
    createSqlClient
}