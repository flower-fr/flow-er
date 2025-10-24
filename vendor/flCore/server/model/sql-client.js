const mysql2 = require("mysql2/promise")
const util = require("util")

const { selectVectors } = require("./sql-client/selectVectors")
const { sqlDelete } = require("./sql-client/sqlDelete")
const { sqlInsert } = require("./sql-client/sqlInsert")
const { sqlUpdate } = require("./sql-client/sqlUpdate")
const { sqlUpdateCase } = require("./sql-client/sqlUpdateCase")
const { sqlSelect } = require("./sql-client/sqlSelect")

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
    closure.connection = await closure.db.getConnection()
    closure.connection.beginTransaction()
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

const sql = async ({ context, type, entity, columns, where, order, limit, vectors, ids, data, column, pairs, debug }, connection, logger) =>
{
    const model = context.config[`${ entity }/model`]

    if (type === "select") {
        
        const result = {}
        result.rows = await sqlSelect({ context, entity, columns, where, order, limit, debug }, model, connection, logger)
        vectors = await selectVectors({context, vectors, debug}, model, connection, logger)
        if (Object.keys(vectors).length !== 0) result.vectors = vectors
        return result
        
    } else if (type === "insert") {

        return sqlInsert({ context, entity, data, debug }, model, connection, logger)

    } else if (type === "update") {

        return sqlUpdate({ context, entity, ids, data, debug }, model, connection, logger)

    } else if (type === "updateCase") {

        return sqlUpdateCase({ context, entity, column, pairs, debug }, model, connection, logger)

    } else if (type === "delete") {

        return sqlDelete({ context, entity, ids, debug }, model, connection, logger)
    }
}

module.exports = {
    createSqlClient
}