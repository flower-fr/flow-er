const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")

const { apiTokenMiddleware } = require("./server/apiTokenMiddleware")

const { getAction } = require("./server/getAction")
const { tokenAction } = require("./server/tokenAction")
const { createSqlClient } = require("../flCore/server/model/sql-client")
const { executeService } = require("../../core/api-utils")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const execute = executeService(context.clone(), config, logger)

    app.get(`${config.prefix}token`, execute(tokenAction, context, config, { sql, logger }))

    // Routes protected by JWT authentication

    app.use(`${config.prefix}`, apiTokenMiddleware(config, context, sql, logger))
    app.get(`${config.prefix}v1/:entity`, execute(getAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/:entity/:id`, execute(getAction, context, { sql, logger }))

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}