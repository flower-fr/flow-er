const mysql = require("mysql")
const mysql2 = require("mysql2/promise")

const createDbClient = async (config, dbName) => {
    return await mysql2.createPool({
        connectionLimit: 100,
        host: config.host, 
        port: config.port, 
        user: config.user, 
        password: config.password, 
        database : (dbName) ? dbName : config.database,
        dateStrings: [
            "DATE",
            "DATETIME"
        ]
    })
}

const createDbClient2 = async (config, dbName) => {
    return await mysql2.createConnection({
        connectionLimit: 100,
        host: config.host, 
        port: config.port, 
        user: config.user, 
        password: config.password, 
        database : (dbName) ? dbName : config.database,
        dateStrings: [
            "DATE",
            "DATETIME"
        ]
    })
}

module.exports = {
    createDbClient,
    createDbClient2
}