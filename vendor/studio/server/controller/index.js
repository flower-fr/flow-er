const multer = require("multer");
const { createDbClient2 } = require("../../../utils/db-client")
const { executeService, assert } = require("../../../../core/api-utils")
const { ddl } = require("./ddl")

const registerStudio = async ({ context, config, logger, app }) => {
    const db = await createDbClient2(config.db, context.dbName)
    const execute = executeService(config, logger)
    const upload = multer()
    app.use(upload.array())
    app.get(`${config.prefix}ddl/:entity`, execute(ddl, context, db))
}

module.exports = {
    registerStudio
}