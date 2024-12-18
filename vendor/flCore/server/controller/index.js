const { postAction } = require("./postAction")
const { createDbClient } = require("../../../utils/db-client")
const { createMailClient } = require("../../../utils/mail-client")
const { executeService, assert } = require("../../../../core/api-utils")

const registerCore = async ({ context, config, logger, app }) => {
    const db = await createDbClient(config.db, context.dbName)
    const smtp = createMailClient({ config: config.smtp, logger })

    const execute = executeService(context.clone(), config, logger)
    app.post(`${config.prefix}v1/:entity/:transaction`, execute(postAction, context, { db, smtp }))
}

module.exports = {
    registerCore
}