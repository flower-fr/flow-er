const { assert } = require("../../../core/api-utils")

const navbarAction = async ({ req }, { context }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const tab = assert.notEmpty(req.params, "tab")
    const config = context.config[`viewModel_navbar_${ application }`]
    config.defaultTab = tab
    return [200, config, "application/json"]
}

module.exports = navbarAction