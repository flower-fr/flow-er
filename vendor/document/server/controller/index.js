const bodyParser = require("body-parser");
const { executeService, assert } = require("../../../../core/api-utils")
const { createDbClient } = require("../../../utils/db-client")
const { getAction } = require("./getAction")
const { postJsonAction } = require("./postJsonAction")

const registerDocument = async ({ context, config, logger, app, renderer }) => {
    const db = await createDbClient(config.db, context.dbName)
    const execute = executeService(config, logger)
    app.get(`${config.prefix}json/:entity/:name/:version`, execute(getAction, context, db))
    //app.get(`${config.prefix}json/:entity/:name`, execute(getAction, context, db))
    app.get(`${config.prefix}json/:entity/:id`, execute(getAction, context, db))
    app.get(`${config.prefix}json/:entity`, execute(getAction, context, db))
    app.get(`${config.prefix}json`, execute(getAction, context, db))
    app.post(`${config.prefix}json/:entity/:name`, execute(postJsonAction, context, db))
}

module.exports = {
    registerDocument
}