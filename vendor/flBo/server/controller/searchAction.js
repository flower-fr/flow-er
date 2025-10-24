const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("./getProperties")

const searchAction = async ({ req }, context, sql) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const whereParam = (req.query.where) ? req.query.where : null

    let where = {}
    for (let pair of (whereParam != null) ? whereParam.split("|") : []) {
        pair = pair.split(":")
        where[pair[0]] = pair[1]
    }

    /**
     * Properties definition
     */
    let listConfig = context.config[`${entity}/search/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/search/default`]
    if (!listConfig) listConfig = context.config[`${entity}/list/${view}`]
    if (!listConfig) listConfig = context.config[`${entity}/list/default`]
    const propertyDefs = listConfig.properties
    const properties = await getProperties(sql, context, entity, view, propertyDefs, where)

    /**
     * Global actions
     */
    let globalConfig = context.config[`${entity}/global/${view}`]
    if (!globalConfig) globalConfig = context.config[`${entity}/global/default`]
    if (!globalConfig) globalConfig = {}

    const result = {
        where: where,
        config: listConfig,
        properties: properties,
        actions: globalConfig.actions
    }
    return result
}

module.exports = {
    searchAction
}