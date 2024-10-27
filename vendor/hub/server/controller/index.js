const multer = require("multer");
const { createDbClient2 } = require("../../../utils/db-client")
const { createMailClient } = require("../../../utils/mail-client")
const { executeService, assert } = require("../../../../core/api-utils")

const registerHub = async ({ context, config, logger, app }) => {
    const db = await createDbClient2(config.db)
    const mailClient = createMailClient({ config: config.smtp, logger })

    const execute = executeService(context.clone(), config, logger)
    const upload = multer()
    app.use(upload.array())
    app.get(`${config.prefix}send`, execute(getAction, context, db))
    app.post(`${config.prefix}send`, execute(postAction, context, db))
    app.get(`${config.prefix}send-mail`, execute(sendMailAction, context, mailClient))
}

const getAction = async ({ req }, context, db) => {
    const endpoint = assert.notEmpty(req.params, "endpoint")
    const endpointConfig = context.config[`interaction/${endpoint}/get`]
}

const postAction = async ({ req }, context, db) => {
    const endpoint = assert.notEmpty(req.params, "endpoint")
    const endpointConfig = context.config[`interaction/${endpoint}/post`]
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