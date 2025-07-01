const { noCacheMiddleware, handleCorsMiddleware } = require("../../core/api-utils")
const { registerWww } = require("./server/controller/index")

const register = async ({ context, config, logger, app }) => {

    app.use(`${config.prefix}/*`, noCacheMiddleware)
    app.use(`${config.prefix}/*`, handleCorsMiddleware)

    registerWww({ context, config, logger, app })
}

module.exports = {
    register
}