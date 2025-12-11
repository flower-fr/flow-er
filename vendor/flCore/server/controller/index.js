const multer = require("multer")
const { sessionCookieMiddleware } = require("../../../user/server/controller/sessionCookieMiddleware");
const { throwBadRequestError } = require("../../../../core/api-utils")

const { getAction } = require("./getAction")
const { postAction, postFormAction } = require("./postAction")
const { deleteAction } = require("./deleteAction")
const { getMails } = require("./getMails")
const { transactionAction } = require("./transactionAction")
// const { createDbClient } = require("../../../utils/db-client") // Deprecated
const { createSqlClient } = require("../../../../vendor/flCore/server/model/sql-client")
const { createMailClient, createImapClient } = require("../../../utils/mail-client")
const { executeService, assert } = require("../../../../core/api-utils")
const { resendSmtp } = require("../post/sendSmtp")

//const { encrypt, decrypt } = require("../model/encrypt")

const { addEvent } = require("../post/addEvent")
const { registerHistory } = require("../post/registerHistory")
const { registerSmtp } = require("../post/registerSmtp")
const { registerSms } = require("../post/registerSms")
const { save } = require("../post/save")
const { sendSmtp } = require("../post/sendSmtp")
const { sendSms } = require("../post/sendSms")

const registerCore = async ({ context, config, logger, app }) => {
    // const db = await createDbClient(config.db, context.dbName) // Deprecated
    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const smtp = createMailClient({ config: config.smtp, logger })
    const imap = createImapClient({ config: config.imap, logger })
    const sms = config.sms

    context.encrypt_secret = config.encrypt.secret
    context.encrypt_iv = config.encrypt.iv

    // // Encrypt
    // const encryptedData = encrypt(context, "This is a secret message")
    // console.log("Encrypted:", encryptedData)

    // // Decrypt
    // const decrypted = decrypt(context, encryptedData)
    // console.log("Decrypted:", decrypted)

    context.config.postSteps.addEvent = addEvent
    context.config.postSteps.registerHistory = registerHistory
    context.config.postSteps.registerSmtp = registerSmtp
    context.config.postSteps.registerSms = registerSms
    context.config.postSteps.save = save
    context.config.postSteps.sendSmtp = sendSmtp
    context.config.postSteps.sendSms = sendSms
 
    const executeFile = async (req, res) => {
        const result = await postFormAction({ req }, context, { sql, logger })
        return res.status(200).send(result)
    }
    const upload = multer()

    const execute = executeService(context.clone(), config, logger)
    
    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    app.get(`${config.prefix}v1/:entity`, execute(getAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/:entity/:id`, execute(getAction, context, { sql, logger }))
    app.post(`${config.prefix}v1/:entity`, execute(postAction, context, { sql, logger }))
    app.post(`${config.prefix}file/:entity`, upload.single("attachment"), executeFile)
    app.post(`${config.prefix}v1/:entity/:transaction/:id`, execute(transactionAction, context, { sql, smtp, sms }))
    app.post(`${config.prefix}v1/:entity/:transaction`, execute(transactionAction, context, { sql, smtp, sms }))
    //app.post(`${config.prefix}resendSmtp`, execute(postSmtpAction, context, { db, smtp }))
    //app.get(`${config.prefix}getMails`, execute(getMailsAction, context, { db, imap }))
    app.delete(`${config.prefix}v1/:entity/:id`, execute(deleteAction, context, { sql, logger }))
    app.delete(`${config.prefix}v1/:entity`, execute(deleteAction, context, { sql, logger }))
}

// const postSmtpAction = async ({ req }, context, { db: connection, smtp }) => 
// {
//     const ids = ["in"].concat(req.body.ids)
//     resendSmtp({ context, connection, smtp, ids })
//     return JSON.stringify({ "status": "ok" })
// }

// const getMailsAction = async ({ req }, context, { db, imap }) => {
//     const connection = await db.getConnection()
//     try {
//         await getMails({ context, connection, imap })
//         connection.release()
//         return JSON.stringify({ "status": "ok" })
//     }
//     catch {
//         await connection.rollback()
//         connection.release()
//         throw throwBadRequestError()
//     }
//}

module.exports = {
    registerCore
}