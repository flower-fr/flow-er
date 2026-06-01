const { assert } = require("../../../core/api-utils")
const util = require("util")

const { renderIndex } = require("./html/renderIndex")

const indexAction = async ({ req }, { context, logger }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const tab = assert.notEmpty(req.params, "tab")
    const entity = req.query["entity"], view = req.query["view"] || "default", theme = context.user.theme || "light"
    logger && logger.debug(util.inspect({ application, tab, entity }, { depth: null, colors: true }))
    const applicationConfig = context.config[`viewModel_navbar_${ application }`]
    const { title } = applicationConfig
    const locale = context.user.locale || "default"

    applicationConfig.profile = { name: "Démo CRITE", roles: { any: "responsible" } }
    return renderIndex(context, application, tab, entity, view, title, theme, locale)
}

module.exports = indexAction