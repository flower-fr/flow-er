const { createSqlClient } = require("../flCore/server//model/sql-client")
const { executeService } = require("../../core/api-utils")
const { noCacheMiddleware, notFoundMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { sessionCookieMiddleware } = require("../user/server/controller/sessionCookieMiddleware")

const { registerDocument } = require("./server/controller/index")

const { getCellAction } = require("./server/getCellAction")
const { postCellAction } = require("./server/postCellAction")
const { patchCellAction } = require("./server/patchCellAction")

// const indexAction = require("./server/controller/indexAction")

// test
// const { loadTestDataset } = require("./server/test/loadTestDataset")
const { testPostAction } = require("./server/test/testPostAction")
const { testGetAction } = require("./server/test/testGetAction")
const { testPatchAction } = require("./server/test/testPatchAction")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)

    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })

    const execute = executeService(context.clone(), config, logger)

    app.get(`${config.prefix}v1/document_cell/:document_id`, execute(getCellAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/document_cell/:document_id/:identifier`, execute(getCellAction, context, { sql, logger }))
    app.post(`${config.prefix}v1/document_cell/:document_id`, execute(postCellAction, context, { sql, logger }))
    app.patch(`${config.prefix}v1/document_cell/:document_id/:action`, execute(patchCellAction, context, { sql, logger })) // action = undo ou redo

    // app.get(`${config.prefix}index`, execute(indexAction, { context, logger }))

    // for testing purposes
    app.post(`${config.prefix}v1/test`, execute(testPostAction, context, { sql, logger }))
    app.get(`${config.prefix}v1/test`, execute(testGetAction, context, { sql, logger }))
    app.patch(`${config.prefix}v1/test`, execute(testPatchAction, context, { sql, logger }))

    // Deprecated
    registerDocument({ context, config, logger, app })

    // fallback : send 404
    app.use(`${config.prefix}/`, notFoundMiddleware)
}

module.exports = {
    register
}