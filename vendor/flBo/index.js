const { noCacheMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware");
const { registerFlBo } = require("./server/controller/index")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)

    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    registerFlBo({ context, config, logger, app })
}

module.exports = {
    register
}