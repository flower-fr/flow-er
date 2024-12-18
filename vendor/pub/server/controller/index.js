const express = require("express")
const { createDbClient } = require("../../../utils/db-client")
const { executeService, assert } = require("../../../../core/api-utils")
const { getModel } = require("../../../flCore/server/model/index")
const { formGet } = require("./formGet")
const { csr } = require("./csr")
const { formPost } = require("./formPost")

const registerPub = async ({ context, config, logger, app }) => {

    const db = await createDbClient(config.db, context.dbName)
    const execute = executeService(context.clone(), config, logger)
    app.get(`${config.prefix}config`, execute(() => { return JSON.stringify(context.config) }))
    app.get(`${config.prefix}language`, execute(() => { return JSON.stringify(context.translations) }))
    app.get(`${config.prefix}user`, execute(() => { return JSON.stringify(context.user) }))
    app.get(`${config.prefix}:entity`, execute(formGet, context, config, db))
    app.get(`${config.prefix}csr/:entity`, execute(csr, context, config, db))
    app.post(`${config.prefix}:entity`, execute(formPost, context, db))
}

module.exports = {
    registerPub
}