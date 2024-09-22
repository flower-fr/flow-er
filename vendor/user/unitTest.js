const fetch = require("node-fetch");
const { executeService } = require("../../core/api-utils")

const registerUserUnitTest = async ({ context, config, logger, app }) => {
    const execute = executeService(config, logger)
    app.get(`${config.prefix}unit-test`, execute(test, context))
}

const test = async (context) => {
}

module.exports = {
    registerUserUnitTest
}