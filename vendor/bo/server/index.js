const { assert } = require("../../../core/api-utils")
const { renderIndex } = require("./html/renderIndex")

const indexAction = async ({ req }, { context, logger }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const tab = assert.notEmpty(req.params, "tab")
    const applicationConfig = context.config[`viewModel_navbar_${ application }`]
    const { title, menu } = applicationConfig
    const tabConfig = menu[tab]
    applicationConfig.profile = { name: "Démo CRITE", roles: { any: "responsible" } }
    return renderIndex(context, application, tab, tabConfig, title, "dark")
}

module.exports = indexAction