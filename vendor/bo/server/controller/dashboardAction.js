const { assert } = require("../../../../core/api-utils")

const { renderIndex } = require("../view/renderIndex")

const dashboardAction = async ({ req }, context, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const indexConfig = context.config[`${entity}/index/${view}`]

    const menuId = context.config[`tab/${view}`].menu
    const menu = {}
    for (let menuTabId of context.config[menuId].tabs) {
        const menuTab = context.config[menuTabId]
        menu[menuTabId] = menuTab
    }

    const where = (indexConfig && indexConfig.where) ? indexConfig.where : ""
    const order = (indexConfig && indexConfig.order) ? indexConfig.order : ""
    const limit = (indexConfig && indexConfig.limit) ? indexConfig.limit : 1000
    return renderIndex(context, entity, view, context.user, menu[`tab/${view}`])
}

module.exports = {
    dashboardAction
}