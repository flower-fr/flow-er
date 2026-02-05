const multer = require("multer")
const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware");

const { getAction } = require("./server/getAction")
const { postAction, postFormAction } = require("./server/postAction")
const { deleteAction } = require("./server/deleteAction")
const { transactionAction } = require("./server/transactionAction")
const { smtpAction } = require("./server/smtpAction")
const { createSqlClient } = require("./server//model/sql-client")
const { createMailClient } = require("../utils/mail-client")
const { executeService } = require("../../core/api-utils")

const { deprecatedTransactionAction } = require("./server/deprecatedTransactionAction")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const smtp = createMailClient({ config: config.smtp, logger })
    const sms = config.sms
 
    const executeFile = async (req, res) => {
        const result = await postFormAction({ req }, context, { sql, smtp, logger })
        return res.status(200).send(result)
    }
    const upload = multer()

    const execute = executeService(context.clone(), config, logger)

    app.get(`${config.prefix}v1/:entity`, execute(getAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/:entity/:id`, execute(getAction, context, { sql, logger }))
    app.post(`${config.prefix}v1/:entity`, execute(postAction, context, { sql, logger }))
    app.post(`${config.prefix}file/:entity`, upload.single("attachment"), executeFile)
    app.post(`${config.prefix}transaction/:id`, execute(transactionAction, context, { sql, smtp, sms, logger }))
    app.post(`${config.prefix}transaction`, execute(transactionAction, context, { sql, smtp, sms, logger }))
    app.post(`${config.prefix}smtp/:id`, execute(smtpAction, context, { sql, smtp, logger }))
    app.delete(`${config.prefix}v1/:entity/:id`, execute(deleteAction, context, { sql, logger }))
    app.delete(`${config.prefix}v1/:entity`, execute(deleteAction, context, { sql, logger }))

    // Deprecated actions
    app.post(`${config.prefix}v1/:entity/:transaction/:id`, execute(deprecatedTransactionAction, context, { sql, smtp, sms }))
    app.post(`${config.prefix}v1/:entity/:transaction`, execute(deprecatedTransactionAction, context, { sql, smtp, sms }))
    app.post(`${config.prefix}file/:entity/:transaction`, upload.single("attachment"), executeFile)

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}