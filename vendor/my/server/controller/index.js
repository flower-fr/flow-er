const express = require("express")
const bodyParser = require("body-parser");
const multer = require("multer");
const { executeService, assert } = require("../../../../core/api-utils")
const { createDbClient2 } = require("../../../utils/db-client")

const { calendarAction } = require("./calendarAction")
const { changePasswordAction } = require("./changePasswordAction")
const { forgotPasswordAction } = require("./forgotPasswordAction")
const { homeAction } = require("./homeAction")
const { invoiceAction } = require("./invoiceAction")
const { mailAction } = require("./mailAction")
const { profileAction } = require("./profileAction")
const { protectedFormAction } = require("./protectedFormAction")

const registerMy = async ({ context, config, logger, app }) => {

    const db = await createDbClient2(config.db, context.dbName)
    const execute = executeService(config, logger)
    const upload = multer()
    app.use(upload.array())
    app.get("/", execute(homeAction, context, db))
    app.get(`${config.prefix}calendar/:id`, execute(calendarAction, context, db))
    app.get(`${config.prefix}changePassword/:id`, execute(changePasswordAction, context, db))
    app.get(`${config.prefix}forgotPassword/:id`, execute(forgotPasswordAction, context, db))
    app.get(`${config.prefix}home/:id`, execute(homeAction, context, db))
    app.get(`${config.prefix}invoice/:id`, execute(invoiceAction, context, db))
    app.get(`${config.prefix}mail/:id`, execute(mailAction, context, db))
    app.get(`${config.prefix}profile/:id`, execute(profileAction, context, db))
    app.get(`${config.prefix}protectedForm/:entity/:id`, execute(protectedFormAction, context, db))
}

module.exports = {
    registerMy
}