const express = require("express")
const bodyParser = require("body-parser");
const multer = require("multer");
const { executeService, assert } = require("../../../../core/api-utils")
const { createDbClient2 } = require("../../../utils/db-client")

const { renderIndex } = require("../view/renderIndex")

const registerDoc = async ({ context, config, logger, app }) => {

    const db = await createDbClient2(config.db, context.dbName)
    const execute = executeService(config, logger)
    const upload = multer()
    app.use(upload.array())
    app.get(`${config.prefix}index/:entity/:view`, execute(index, context, db))
}

const index = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = assert.notEmpty(req.params, "view")
    
    return renderIndex({ context, entity, view })
}

module.exports = {
    registerDoc
}