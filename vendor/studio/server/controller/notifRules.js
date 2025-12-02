const { assert } = require("../../../../core/api-utils")
const { throwBadRequestError } = require("../../../../core/api-utils")
const util = require("util")

const { renderNotifRules } = require("../rendering/renderNotifRules")

const { dataToStore } = require("../../../../vendor/flCore/server/model/dataToStore")
const { entitiesToStore } = require("../../../../vendor/flCore/server/model/entitiesToStore")
const { storeEntities } = require("../../../../vendor/flCore/server/post/storeEntities")
const { auditCells } = require("../../../../vendor/flCore/server/post/auditCells")

const getNotifRules = async ({ req }, context, sql) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    
    const tab = context.config[`tab/${view}`]
    const menuId = tab.menu
    const menu = {}
    for (let menuTabId of context.config[menuId].tabs) {
        const menuTab = context.config[menuTabId]
        menu[menuTabId] = menuTab
    }

    const menuDef = context.config[tab.menu]

    const data = {
        headerParams: context.config.headerParams,
        instance: context.instance,
        user: context.user, 
        applications: context.config.applications,
        applicationName: menuDef.labels,
        tab: tab, 
        menu: menu,
        footer: context.config.footer
    }

    return renderNotifRules({ context, entity, view }, data)
}

const postNotifRules = async ({ req }, context, sql, logger) => 
{
    const entity = assert.notEmpty(req.params, "entity")
    const form = req.body
    const file = req.file && req.file.buffer
    if (file) form.data = file
    try {
        const model = context.config[`${ entity }/model`]
        let { rowsToStore } = dataToStore(model, [form])
        rowsToStore = entitiesToStore(entity, model, rowsToStore)        
        await storeEntities(context, entity, rowsToStore, model, sql)
        await auditCells(context, rowsToStore, sql)
    }
    catch(err) {
        logger && logger.debug(util.inspect(err))
        throw throwBadRequestError()
    }
    return { "status": "ok" }
}

module.exports = {
    getNotifRules, postNotifRules
}