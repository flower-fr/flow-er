const multer = require("multer")
const moment = require("moment")

const { sessionCookieMiddleware } = require("../../../user/server/controller/sessionCookieMiddleware")
const { createDbClient } = require("../../../utils/db-client")
const { createSqlClient } = require("../../../flCore/server/model/sql-client")
const { createMailClient } = require("../../../utils/mail-client")
const { executeService, assert } = require("../../../../core/api-utils")

const { getImportXlsxAction, postImportXlsxAction } = require("./importXlsxAction")
const { getImportCsvAction, postImportCsvAction } = require("./importCsvAction")
const { getPdfAction, postPdfAction } = require("./pdfAction")
const { notificationAction } = require("./notificationAction")
const { registerReminders, sendReminders } = require("../post/remind")
const { sendSms } = require("../post/sendSms")

const { select } = require("../../../flCore/server/model/select")
const { update } = require("../../../flCore/server/model/update")

const registerHub = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const smsClient = config.sms
    const mailClient = createMailClient({ config: config.smtp, logger })

    const execute = executeService(context.clone(), config, logger)
    const executeImportXlsx = async (req, res) => {
        if (!context.isAllowed("interaction")) return res.status(403).send({message: "unauthorized"})
        const result = await postImportXlsxAction({ req }, context, sql, logger)
        return res.status(200).send(result)
    }
    const executeImportCsv = async (req, res) => {
        if (!context.isAllowed("interaction")) return res.status(403).send({message: "unauthorized"})
        const result = await postImportCsvAction({ req }, context, db)
        return res.status(200).send(result)
    }
    const upload = multer()

    // Routes bypassing standard authentication should check a query token !!!
    app.get(`${config.prefix}pdf/:entity/:id`, execute(getPdfAction, context, db))
    app.post(`${config.prefix}pdf/:entity/:type/:owner_entity/:owner_id`, execute(postPdfAction, context, db))

    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))
    // app.get(`${config.prefix}send`, execute(getAction, context, db))
    // app.post(`${config.prefix}send`, execute(postAction, context, db))
    app.get(`${config.prefix}send-mail`, execute(sendMailAction, context, mailClient))
    app.get(`${config.prefix}import-xlsx/:entity`, execute(getImportXlsxAction, context, sql))
    app.post(`${config.prefix}import-xlsx/:entity/:id`, upload.single("global-xlsxFile"), executeImportXlsx)
    app.get(`${config.prefix}import-csv/:entity`, execute(getImportCsvAction, context, db))
    app.post(`${config.prefix}import-csv/:entity/:id`, upload.single("global-csvFile"), executeImportCsv)
    app.post(`${config.prefix}remind/:entity`, execute(postReminder, context, db, mailClient))
    app.post(`${config.prefix}send-sms`, execute(postSmsAction, context, db, smsClient))
    app.get(`${config.prefix}notification/:entity`, execute(notificationAction, context, db, mailClient))
}

// const getAction = async ({ req }, context, db) => {
//     const endpoint = assert.notEmpty(req.params, "endpoint")
//     const endpointConfig = context.config[`interaction/${endpoint}/get`]
// }

// const postAction = async ({ req }, context, db) => {
//     const endpoint = assert.notEmpty(req.params, "endpoint")
//     const endpointConfig = context.config[`interaction/${endpoint}/post`]
// }

const postReminder = async ({ req, res }, context, db, mailClient) => {

    if (!context.isAllowed("interaction")) return res.status(403).send({message: "unauthorized"})
    
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const date = (req.query.date) ? req.query.date : moment().format("YYYY-MM-DD")
    const viewModel = context.config[`${entity}/reminder/${view}`]

    const connection = await db.getConnection()
    try {
 
        /**
         * Synchronously register as interaction the reminders to send
         */
        const reminders = await registerReminders(context, entity, date, viewModel, connection)
        await connection.commit()
        await connection.release()

        /**
         * Asynchronously send the reminders
         */
        sendReminders(context, reminders, connection, mailClient)

        return JSON.stringify({ "status": "ok" })
    }
    catch {
        await connection.rollback()
        await connection.release()
        return JSON.stringify({ "status": "ko", "errors": "Bad request" })
    }
}

const postSmsAction = async ({ req, res }, context, db, smsClient) => {

    if (!context.isAllowed("interaction")) return res.status(403).send({message: "unauthorized"})

    /**
     * Retrieve the interactions as sms to send
     */

    const connection = await db.getConnection()

    const model = context.config["interaction/model"]
    const where = { "status": "current", "provider": "api.smspartner.fr" }
    const body = req.body
    let ids = body && body.ids
    if (ids) where.id = ids
    const rows = (await connection.execute(select(context, "interaction", ["id", "scheduled_at", "body"], where, null, 500, model)))[0]
    ids = []
    for (let row of rows) ids.push(row.id)

    try {
        await sendSms({ context, rows, smsClient })
        await connection.execute(update(context, "interaction", [ids], { status: "ok" }, model))
        await connection.commit()
        await connection.release()
        return JSON.stringify({ "status": "ok" })
    }
    catch {
        await connection.execute(update(context, "interaction", [ids], { status: "ko" }, model))
        await connection.rollback()
        await connection.release()
        return JSON.stringify({ "status": "ko", "errors": "Bad request" })
    }
}

const sendMailAction = async ({ req }, context, mailClient) => {
    await mailClient.sendMail({
        type: "html",
        to: "bruno@lartillot.net",
        subject: "Test emailing",
        content: `Bonjour,
        Contenu du message...`
    })
}

module.exports = {
    registerHub
}