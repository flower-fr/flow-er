const multer = require("multer");
const { executeService, assert } = require("../../../../core/api-utils")
const { sessionCookieMiddleware } = require("../../../user/server/controller/sessionCookieMiddleware");
const { createDbClient } = require("../../../utils/db-client")

const { getProperties } = require("../../../../vendor/bo/server/controller/getProperties")
const { getDistribution } = require("../../../../vendor/bo/server/controller/getDistribution")

const { searchAction } = require("./searchAction")
const { detailTabAction } = require("../../../flBo/server/controller/detailTabAction")
const { notFoundAction } = require("./404")

const { renderIndex } = require("../view/renderIndex")

const registerFlBo = async ({ context, config, logger, app }) => {

    const db = await createDbClient(config.db, context.dbName)
    const execute = executeService(context, config, logger)
    const upload = multer()
    app.use(upload.array())
    app.use(`${config.prefix}`, sessionCookieMiddleware(config))
    app.get(`${config.prefix}index/:entity`, execute(index, context, config, db))
    app.get(`${config.prefix}search/:entity`, execute(searchAction, context, db))
    app.get(`${config.prefix}detailTab/:entity/:id`, execute(detailTabAction, context, db))
    app.get(`${config.prefix}404`, execute(notFoundAction, context, config))

    // fallback : send 404
    app.use(`${config.prefix}`, notFoundMiddleware)
}

const index = async ({ req }, context, config, db) => {

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
    const properties = await getProperties(db, context, entity, view, propertyDefs, whereParam)

    /**
     * Retrieve distributions of the data
     */
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        property.distribution = await getDistribution(db, context, entity, view, propertyId, properties, whereParam)
    }
    
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

module.exports = {
    registerFlBo
}