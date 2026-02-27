const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware");
const { executeService } = require("../../core/api-utils")

const { formAction } = require("./server/formAction")
const { indexAction } = require("./server/indexAction")
const { navbarAction } = require("./server/navbarAction")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    // app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const execute = executeService(context, config, logger)

    app.get(`${config.prefix}form/:entity/:view`, execute(formAction, { context, logger }))
    app.get(`${config.prefix}index/:entity`, execute(indexAction, { context, logger }))
    app.get(`${config.prefix}navbar/:entity`, execute(navbarAction, { context, logger }))

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}