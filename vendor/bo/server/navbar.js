const { assert } = require("../../../core/api-utils")

const navbarAction = async ({ req }, { context }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const tab = assert.notEmpty(req.params, "tab")
    const locale = req.query.locale || "default"
    const config = context.config[`viewModel_navbar_${ application }`]
    if (config.title[locale]) config.title = config.title[locale]
    config.defaultTab = tab
    config.user = context.user
    Object.values(config.menu).forEach(entry => { 
        if (entry.label[locale]) entry.label = entry.label[locale]
        else if (entry.label["default"]) entry.label = entry.label["default"]
    })
    return [200, config, "application/json"]
}

module.exports = navbarAction