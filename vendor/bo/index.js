const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware");
const { executeService } = require("../../core/api-utils")
const { createSqlClient } = require("../flCore/server/model/sql-client")

const action = require("./server/action")
const indexAction = require("./server")
const navbarAction = require("./server/navbar")
const tabbarAction = require("./server/tabbar")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })

    const execute = executeService(context, config, logger)

    app.get(`${config.prefix}index/:application/:tab`, execute(indexAction, { context, logger }))
    app.get(`${config.prefix}navbar/:application/:tab`, execute(navbarAction, { context, logger }))
    app.get(`${config.prefix}tabbar/:entity/:level`, execute(tabbarAction, { context, logger }))
    app.get(`${config.prefix}:action/:entity`, execute(action, { context, sql, logger }))

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}