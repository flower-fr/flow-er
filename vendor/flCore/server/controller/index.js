const multer = require("multer")

const { postAction, postFormAction } = require("./postAction")
const { transactionAction } = require("./transactionAction")
const { createDbClient } = require("../../../utils/db-client")
const { createMailClient } = require("../../../utils/mail-client")
const { executeService, assert } = require("../../../../core/api-utils")

const registerCore = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const smtp = createMailClient({ config: config.smtp, logger })
    const sms = config.sms

    const executeFile = async (req, res) => {
        const result = await postFormAction({ req }, context, { db })
        return res.status(200).send(result)
    }
    const upload = multer()

    const execute = executeService(context.clone(), config, logger)
    app.post(`${config.prefix}v1/:entity`, execute(postAction, context, { db }))
    app.post(`${config.prefix}file/:entity`, upload.single("logo"), executeFile)
    app.post(`${config.prefix}v1/:entity/:transaction/:id`, execute(transactionAction, context, { db, smtp, sms }))
    app.post(`${config.prefix}v1/:entity/:transaction`, execute(transactionAction, context, { db, smtp, sms }))
}

module.exports = {
    registerCore
}