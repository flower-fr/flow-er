const mysql = require("mysql")
const mysql2 = require("mysql2/promise")

var pool = {}

const createDbClient = async (config, dbName) => {
    if (!pool[dbName]) pool[dbName] = await mysql2.createPool({
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
    return await pool[dbName].getConnection()
}

module.exports = {
    createDbClient
}