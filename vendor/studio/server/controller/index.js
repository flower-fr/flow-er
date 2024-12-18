const { createDbClient } = require("../../../utils/db-client")
const { executeService, assert } = require("../../../../core/api-utils")
const { ddl } = require("./ddl")

const registerStudio = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const execute = executeService(context.clone(), config, logger)
    app.get(`${config.prefix}ddl/:entity`, execute(ddl, context, db))
    app.get(`${config.prefix}ddl/:entity/:property`, execute(ddl, context, db))
}

module.exports = {
    registerStudio
}