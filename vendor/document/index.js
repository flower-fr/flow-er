const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { executeService } = require("../../core/api-utils")
// const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware")
const { registerDocument } = require("./server/controller/index")
const { createSqlClient } = require("../flCore/server//model/sql-client")

const { getAction } = require("./server/getAction")
const { postAction } = require("./server/postAction")
const { patchAction } = require("./server/patchAction")
// const { deleteAction } = require("./server/deleteAction")

const indexAction = require("./server/controller/indexAction")

// test
// const { loadTestDataset } = require("./server/test/loadTestDataset")
const { testPostAction } = require("./server/test/testPostAction")
const { testGetAction } = require("./server/test/testGetAction")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)
    // app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })

    const execute = executeService(context.clone(), config, logger)

    app.get(`${config.prefix}v1/document-cell/:document_id`, execute(getAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/document-cell/:document_id/:identifier`, execute(getAction, context, { sql, logger }))
    app.post(`${config.prefix}v1/document-cell/:document_id`, execute(postAction, context, { sql, logger }))
    app.patch(`${config.prefix}v1/document-cell/:document_id/:action`, execute(patchAction, context, { sql, logger })) // action = undo ou redo
    // app.delete(`${config.prefix}v1/document-cell/:document_id/:identifier`, execute(deleteAction, context, { sql, logger }))
    // app.delete(`${config.prefix}v1/document-cell`, execute(deleteAction, context, { sql, logger }))

    app.get(`${config.prefix}index`, execute(indexAction, { context, logger }))

    // for testing purposes
    app.post(`${config.prefix}v1/test`, execute(testPostAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/test`, execute(testGetAction, context, { sql, logger }))

    // Deprecated
    registerDocument({ context, config, logger, app })

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}