const { assert } = require("../../../core/api-utils")

const tabbarAction = async ({ req }, { context }) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const level = assert.notEmpty(req.params, "level")
    const view = req.query.view || "default"

    const config = context.config[`viewModel_tabbar_${ entity }_${ level }_${ view }`]
    return [200, config, "application/json"]
}

module.exports = tabbarAction