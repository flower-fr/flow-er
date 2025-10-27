const { executeService, assert } = require("../../../../core/api-utils")
const { sessionCookieMiddleware } = require("../../../user/server/controller/sessionCookieMiddleware");
const { createDbClient } = require("../../../utils/db-client") // Deprecated
const { createSqlClient } = require("../../../flCore/server/model/sql-client")

const { getProperties } = require("./getProperties")

const { dashboardAction } = require("./dashboardAction")
const { detailAction } = require("./detailAction")
const { detailTabAction } = require("./detailTabAction")
const { exportAction } = require("./exportAction")
const { groupAction } = require("./groupAction")
const { groupTabAction } = require("./groupTabAction")
const { listAction } = require("./listAction")
const { searchAction } = require("./searchAction")

const { notFoundAction } = require("./404")

const { renderIndex } = require("../view/renderIndex")

const registerFlBo = async ({ context, config, logger, app }) => 
{
    const sql = await createSqlClient({ config: config.db, logger, dbName: context.dbName })
    const execute = executeService(context, config, logger)

    // Default tab
    app.get("/", execute(defaultTab, context, config))

    app.get(`${config.prefix}instance`, execute(() => { return JSON.stringify(context.instance) }))
    app.get(`${config.prefix}config`, execute(() => { return JSON.stringify(context.config) }))
    app.get(`${config.prefix}language`, execute(() => { return JSON.stringify(context.translations) }))
    app.get(`${config.prefix}user`, execute(() => { return JSON.stringify(context.user) }))

    app.use(`${config.prefix}`, sessionCookieMiddleware(config, context))

    app.get(`${config.prefix}dashboard/:entity`, execute(dashboardAction, context))
    app.get(`${config.prefix}detail/:entity/:id`, execute(detailAction, context))
    app.get(`${config.prefix}detailTab/:entity/:id`, execute(detailTabAction, context, sql, logger))
    app.get(`${config.prefix}export/:entity`, execute(exportAction, context, sql))
    app.get(`${config.prefix}group/:entity`, execute(groupAction, context))
    app.get(`${config.prefix}groupTab/:entity`, execute(groupTabAction, context, sql))
    app.get(`${config.prefix}groupTab/:entity/:id`, execute(groupTabAction, context, sql))
    app.get(`${config.prefix}index/:entity`, execute(index, context, config, sql))
    app.get(`${config.prefix}list/:entity`, execute(listAction, context, sql))
    app.get(`${config.prefix}search/:entity`, execute(searchAction, context, sql))
    app.get(`${config.prefix}404`, execute(notFoundAction, context, config))

    // fallback : send 404
    app.use(`${config.prefix}`, notFoundMiddleware)
}

const index = async ({ req, logger }, context, config, db) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"

    let indexConfig = context.config[`${entity}/index/${view}`]
    if (!indexConfig) indexConfig = context.config[`${entity}/index/default`]
        
    let searchConfig = context.config[`${entity}/search/${view}`]
    if (!searchConfig) searchConfig = context.config[`${entity}/search/default`]
        
    let listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    
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
    const properties = await getProperties(sql, context, entity, view, propertyDefs, whereParam)

    /**
     * Retrieve distributions of the data
     */
    // for (let propertyId of Object.keys(properties)) {
    //     const property = properties[propertyId]
    //     property.distribution = await getDistribution(db, context, entity, view, propertyId, properties, whereParam)
    // }
    
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
        tab: tab, 
        menu: menu,
        where: where,
        order: order,
        limit: limit,
        footer: context.config.footer,
        indexConfig: indexConfig,
        searchConfig: searchConfig,
        listConfig: listConfig,
        properties: properties
    }
    return renderIndex({ context, entity, view }, data)
}

const notFoundMiddleware = (_req, res) => {
    return res.redirect("/mdb/404")
}

const defaultTab = async ({ req, res }, context) => {

    const defaultTabConfig = context.config["application/defaultTab"]
    if (defaultTabConfig) {
        const tab = context.config[defaultTabConfig]
        return res.redirect(`/${ tab.controller }/${ tab.action }/${ tab.entity }${ (tab.view) ? `?view=${ tab.view }` : "" }`)
    }
}

module.exports = {
    registerFlBo
}