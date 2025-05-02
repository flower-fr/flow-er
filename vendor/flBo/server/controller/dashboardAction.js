const { assert } = require("../../../../core/api-utils")

const { getProperties } = require("../../../../vendor/bo/server/controller/getProperties")
const { getDistribution } = require("../../../../vendor/bo/server/controller/getDistribution")

const { renderDashboard } = require("../view/renderDashboard")

const dashboardAction = async ({ req }, context, config, db) => {

    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let indexConfig = context.config[`${entity}/index/${view}`]
    if (!indexConfig) indexConfig = context.config[`${entity}/index/default`]
        
    let searchConfig = context.config[`${entity}/search/${view}`]
    if (!searchConfig) searchConfig = context.config[`${entity}/search/default`]
        
    let listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]

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
    const where = (indexConfig && indexConfig.where) ? indexConfig.where : ""
    const order = (indexConfig && indexConfig.order) ? indexConfig.order : ""
    const limit = (indexConfig && indexConfig.limit) ? indexConfig.limit : 1000

    const whereParam = (where != "") ? where.split("|") : []
    const propertyDefs = searchConfig.properties
    for (let propertyId of Object.keys(listConfig.properties)) {
        if (!propertyDefs[propertyId]) propertyDefs[propertyId] = {}
    }
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)

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
        instance: context.instance,
        user: context.user, 
        applications: context.config.applications,
        applicationName: menuDef.labels,
        dashboardConfig,
        tab, 
        menu,
        where,
        order,
        limit,
        footer: context.config.footer,
        indexConfig,
        searchConfig,
        listConfig,
        properties
    }
    return renderDashboard({ context, entity, view }, data)
}

module.exports = {
    dashboardAction
}