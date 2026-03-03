const { assert } = require("../../../core/api-utils")

const action = async ({ req }, { context, logger }) => 
{
    const action = assert.notEmpty(req.params, "action")
    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view || "default"
    const config = context.config[`viewModel_${ action }_${ entity }_${ view }`]
    return [200, config, "application/json"]
}

module.exports = action