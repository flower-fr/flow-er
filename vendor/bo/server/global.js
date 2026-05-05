const { assert } = require("../../../core/api-utils")

const globalAction = async ({ req }, { context }) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view || "default"

    const config = context.config[`viewModel_global_${ entity }_${ view }`]
    return [200, config, "application/json"]
}

module.exports = globalAction