const express = require("express")
const bodyParser = require("body-parser");
const multer = require("multer");
const { executeService, assert } = require("../../../../core/api-utils")
const { createDbClient2 } = require("../../../utils/db-client")

const { renderIndex } = require("../view/renderIndex")

const registerDoc = async ({ context, config, logger, app }) => {

    const db = await createDbClient2(config.db, context.dbName)
    const execute = executeService(context.clone(), config, logger)
    const upload = multer()
    app.use(upload.array())
    app.get("/", execute(index, context, db))
    app.get(`${config.prefix}index/:entity/:view`, execute(index, context, db))
}

const index = async ({ req }, context, db) => {
    const entity = (req.params.entity) ? req.params.entity : "flow-er"
    const view = (req.params.view) ? req.params.view : "fr10Settings"
    
    return renderIndex({ context, entity, view })
}

module.exports = {
    registerDoc
}