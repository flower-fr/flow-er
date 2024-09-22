const express = require("express")
const multer = require("multer");
const { executeService, assert } = require("../../../../core/api-utils")
const { getModel } = require("../../../flCore/server/model/index")
const { formGet } = require("./formGet")
const { formPost } = require("./formPost")

const registerPub = async ({ context, config, logger, app }) => {

    const model = await getModel(config, context)
    const db = model.db
    const execute = executeService(config, logger)
    const upload = multer()
    app.use(upload.array())
    app.get(`${config.prefix}config`, execute(() => { return JSON.stringify(context.config) }))
    app.get(`${config.prefix}language`, execute(() => { return JSON.stringify(context.translations) }))
    app.get(`${config.prefix}user`, execute(() => { return JSON.stringify(context.user) }))
    app.get(`${config.prefix}:entity`, execute(formGet, context, config, db))
    app.post(`${config.prefix}:entity`, execute(formPost, context, db))
}

module.exports = {
    registerPub
}