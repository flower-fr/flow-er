const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { executeService } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware")
const { registerDocument } = require("./server/controller/index")
const { createSqlClient } = require("../flCore/server//model/sql-client")

const { getAction } = require("./server/getAction")
const { postAction } = require("./server/postAction")
const { deleteAction } = require("./server/deleteAction")

// test
const { loadTestDataset } = require("./server/test/loadTestDataset")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    // app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })

    const execute = executeService(context.clone(), config, logger)

    app.get(`${config.prefix}v1/document`, execute(getAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/document/:identifier`, execute(getAction, context, { sql, logger }))
    app.post(`${config.prefix}v1/document`, execute(postAction, context, { sql, logger }))
    app.delete(`${config.prefix}v1/document/:id`, execute(deleteAction, context, { sql, logger }))
    app.delete(`${config.prefix}v1/document`, execute(deleteAction, context, { sql, logger }))

    // for testing purposes
    app.post(`${config.prefix}v1/test`, execute(loadTestDataset, context, { sql, logger }))

    // Deprecated
    registerDocument({ context, config, logger, app })

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}