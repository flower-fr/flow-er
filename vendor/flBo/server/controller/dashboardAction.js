const { assert } = require("../../../../core/api-utils")

const { renderDashboard } = require("../view/renderDashboard")

const dashboardAction = async ({ req }, context) => {

    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let indexConfig = context.config[`${entity}/index/${view}`]
    if (!indexConfig) indexConfig = context.config[`${entity}/index/default`]

    let dashboardConfig = context.config[`${entity}/dashboard/${view}`]
    if (!dashboardConfig) dashboardConfig = context.config[`${entity}/dashboard/default`]
    
    const tab = context.config[`tab/${view}`]
    const menuId = tab.menu
    const menu = {}
    for (let menuTabId of context.config[menuId].tabs) {
        const menuTab = context.config[menuTabId]
        menu[menuTabId] = menuTab
    }

    const menuDef = context.config[tab.menu]

    const applications = {}
    for (let applicationId of Object.keys(context.config.applications)) {
        const application = context.config.applications[applicationId]
        if (context.config[`menu/${applicationId}`]) {
            const m = context.config[`menu/${applicationId}`]
            const menuEntry = context.config[m.defaultTab]
            const urlParams = (menuEntry.urlParams) ? menuEntry.urlParams : ""
            const url = `${menuEntry.route}?${urlParams}`

            applications[applicationId] = { labels: application.labels, url: url }
        }
    }

    const data = {
        headerParams: context.config.headerParams,
        helpMenu: context.config.helpMenu,
        instance: context.instance,
        user: context.user, 
        applications: context.config.applications,
        applicationName: menuDef.labels,
        dashboardConfig,
        tab, 
        menu,
        footer: context.config.footer,
        indexConfig
    }
    return renderDashboard({ context, entity, view }, data)
}

module.exports = {
    dashboardAction
}