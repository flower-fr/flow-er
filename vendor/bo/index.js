const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware");
const { executeService } = require("../../core/api-utils")
const { createSqlClient } = require("../flCore/server/model/sql-client")

const action = require("./server/action")
const indexAction = require("./server")
const navbarAction = require("./server/navbar")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })

    const execute = executeService(context, config, logger)

    // Default tab
    // app.get("/", execute(defaultTab, { config, context }))

    app.get(`${config.prefix}index/:application/:tab`, execute(indexAction, { context, logger }))
    app.get(`${config.prefix}navbar/:application/:tab`, execute(navbarAction, { context, logger }))
    app.get(`${config.prefix}:action/:entity`, execute(action, { context, sql, logger }))

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

const defaultTab = async ({ res }, { config, context }) =>
{
    const defaultApp = config.defaultApp, defaultAppConfig = context.config[defaultApp]
    const tab = defaultAppConfig.menu[config.defaultTab]
    let route = [tab.controller, tab.action]
    Object.values(tab.params).forEach(param => route.push(param))
    const query = Object.entries(tab.query || {}).map(([key, value]) => `${ key }=${ value }`)
    route = `/${ route.join("/") }?${ query.join("&") }`
    return res.redirect(route)
}

module.exports = {
    register
}