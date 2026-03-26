const { assert } = require("../../../core/api-utils")
const { renderIndex } = require("./html/renderIndex")

const indexAction = async ({ req }, { context, logger }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const tab = assert.notEmpty(req.params, "tab")
    const entity = req.query["entity"], view = req.query["view"] || "default"
    const applicationConfig = context.config[`viewModel_navbar_${ application }`]
    const { title, menu } = applicationConfig
    applicationConfig.profile = { name: "Démo CRITE", roles: { any: "responsible" } }
    return renderIndex(context, application, tab, entity, view, title, "dark")
}

module.exports = indexAction