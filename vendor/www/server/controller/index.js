const express = require("express")
const { executeService, assert } = require("../../../../core/api-utils")
const { createSqlClient } = require("../../../flCore/server/model/sql-client")

const { notFoundAction } = require("./404")

const { postForm } = require("./postForm")

const { renderIndex } = require("../rendering/renderIndex")

const registerWww = async ({ context, config, logger, app }) => {
    
    app.use("/", express.static("vendor/www/client/public/"))
    
    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const execute = executeService(context, config, logger)

    app.get(`${config.prefix}:entity`, execute(index, context, config))
    app.post(`${config.prefix}:entity`, execute(postForm, context, config, sql, logger))
    app.get(`${config.prefix}404`, execute(notFoundAction, context, config))

    // fallback : send 404
    app.use(`${config.prefix}`, notFoundMiddleware)
}

const index = async ({}, context, config) => {
    return renderIndex(context, config)
}

const notFoundMiddleware = (_req, res) => {
    return res.redirect("/404")
}

module.exports = {
    registerWww
}