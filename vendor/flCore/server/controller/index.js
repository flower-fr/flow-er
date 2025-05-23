const multer = require("multer")
const { sessionCookieMiddleware } = require("../../../user/server/controller/sessionCookieMiddleware");
const { throwBadRequestError } = require("../../../../core/api-utils")

const { postAction, postFormAction } = require("./postAction")
const { deleteAction } = require("./deleteAction")
const { getMails } = require("./getMails")
const { transactionAction } = require("./transactionAction")
const { createDbClient } = require("../../../utils/db-client")
const { createMailClient, createImapClient } = require("../../../utils/mail-client")
const { executeService, assert } = require("../../../../core/api-utils")
const { resendSmtp } = require("../post/sendSmtp")

const registerCore = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const smtp = createMailClient({ config: config.smtp, logger })
    const imap = createImapClient({ config: config.imap, logger })
    const sms = config.sms

    const executeFile = async (req, res) => {
        const result = await postFormAction({ req }, context, { db })
        return res.status(200).send(result)
    }
    const upload = multer()

    const execute = executeService(context.clone(), config, logger)
    
    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))
    app.post(`${config.prefix}v1/:entity`, execute(postAction, context, { db }))
    app.post(`${config.prefix}file/:entity`, upload.single("logo"), executeFile)
    app.post(`${config.prefix}v1/:entity/:transaction/:id`, execute(transactionAction, context, { db, smtp, sms }))
    app.post(`${config.prefix}v1/:entity/:transaction`, execute(transactionAction, context, { db, smtp, sms }))
    app.post(`${config.prefix}resendSmtp`, execute(postSmtpAction, context, { db, smtp }))
    app.get(`${config.prefix}getMails`, execute(getMailsAction, context, { db, imap }))
    app.delete(`${config.prefix}v1/:entity/:id`, execute(deleteAction, context, { db }))
}

const postSmtpAction = async ({ req }, context, { db: connection, smtp }) => 
{
    const ids = ["in"].concat(req.body.ids)
    resendSmtp({ context, connection, smtp, ids })
    return JSON.stringify({ "status": "ok" })
}

const getMailsAction = async ({ req }, context, { db, imap }) => {
    const connection = await db.getConnection()
    try {
        await getMails({ context, connection, imap })
        connection.release()
        return JSON.stringify({ "status": "ok" })
    }
    catch {
        await connection.rollback()
        connection.release()
        throw throwBadRequestError()
    }
}

module.exports = {
    registerCore
}