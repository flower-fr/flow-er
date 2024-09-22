const { assert } = require("../../../../core/api-utils")

const loadViewAction = ({ req }, context) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    const menuId = context.config[`tab/${view}`].menu
    const menu = {}
    for (let menuTabId of context.config[menuId].tabs) {
        const menuTab = context.config[menuTabId]
        menu[menuTabId] = menuTab
    }

    const applicationName = context.localize(menu.labels)

    const indexConfig = context.config[`${entity}/index/${view}`]
    const tab = context.config[`tab/${view}`]
    const menuDef = context.config[tab.menu]
    const where = (indexConfig && indexConfig.where) ? indexConfig.where : ""
    const order = (indexConfig && indexConfig.order) ? indexConfig.order : ""
    const limit = (indexConfig && indexConfig.limit) ? indexConfig.limit : 1000

    const applications = {}
    for (let applicationId of Object.keys(context.config.applications)) {
        const application = context.config.applications[applicationId]
        if (context.config[`menu/${applicationId}`]) {
            const m = context.config[`menu/${applicationId}`]
            const menuEntry = context.config[m.defaultTab]
            const urlParams = (menuEntry.urlParams) ? menuEntry.urlParams : ""
            const url = `${menuEntry.route}?${urlParams}`
            const label = context.localize(application.labels)

            applications[applicationId] = { labels: application.labels, url: url }
        }
    }

    const result = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        user: context.user,
        applications: applications,
        applicationName: menuDef.labels,
        tab: tab,
        menu: menu,
        where: where,
        order: order,
        limit: limit,
        footer: context.config.footer,
        indexConfig: context.config[`${entity}/index/${view}`]
    }

    return result
}

module.exports = {
    loadViewAction
}