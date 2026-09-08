const { assert } = require("../../../core/api-utils")
const moment = require("moment")
const util = require("util")

const action = async ({ req }, { context, sql, logger }) => 
{
    const action = assert.notEmpty(req.params, "action")
    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view || "default"
    const locale = req.query.locale || context.user.locale

    // Handle special case for ACL
    if (action === "acl") {
        // Filter ACL based on user roles
        const userRoles = context.user.roles || [context.user.role]
        const filteredAcl = {}
        for (const [key, roles] of Object.entries(context.config.acl)) {
            if (roles.includes("user") || roles.some(role => userRoles.includes(role))) {
                filteredAcl[key] = roles
            }
        }
        return [200, filteredAcl, "application/json"]
    }
    const config = context.config[`viewModel_${ action }_${ entity }_${ view }`]
    if (!config) return [200, {}, "application/json"]

    // Check has role to acces this action
    const roles = context.user.roles || [context.user.role]
    if (config.acl?.roles) {
        if (!config.acl?.roles.includes("user")) {
            if (!roles.some(role => config.acl?.roles.includes(role))) {
                return [403, null, "application/json"]
            }
        }
    }

    const EXCLUDED_KEYS = ["translations", "label"]
    resolveTokensDeep(config, EXCLUDED_KEYS)

    logger && logger.debug(util.inspect(config, { depth: null, colors: true }))

    // Title localization
    if (config?.title?.label?.[locale]) config.title.label = config.title.label[locale]
    else if (config?.title?.label?.["default"]) config.title.label = config.title.label["default"]

    const model = context.config[`${ entity }/model`], aclProperties = {}
    for (const [propertyId, property] of config.properties ? Object.entries(config.properties) : []) {

        // Check property authorization
        if (model.acl) {
            if (!Object.keys(model.acl.get.properties).includes(propertyId)) continue
            if (model.acl.get.properties[propertyId].roles && !roles.some(role => model.acl.get.properties[propertyId].roles.includes(role))) continue
        }
        if (["vector", "autocomplete"].includes(property.type)) {
            const { entity, key, format, columns, where, order } = property
            const items = await sql.execute({ context, type: "select", entity, columns, where, order })
            property.modalities = {}
            property.rows = {}
            for (const item of items) {
                const formatted = []
                let i = 1
                const args = (format[1]) ? format[1].split(",") : []
                for (let sub of property.format[0].split("%s")) {
                    formatted.push(sub)
                    if (item[args[i-1]]) formatted.push(item[args[i-1]])
                    i++
                }
                property.modalities[item[key]] = { label: formatted.join("") }
                property.rows[item[key]] = item
            }
        }
        logger && logger.debug(util.inspect({ property }, { depth: null, colors: true }))

        // Property localization

        if (property.label?.[locale]) property.label = property.label[locale]
        else if (property.label?.["default"]) property.label = property.label["default"]

        if (property.modalities) {
            for (const modality of Object.values(property.modalities)) {
                if (modality.label[locale]) modality.label = modality.label[locale]
                else if (modality.label["default"]) modality.label = modality.label["default"]
            }
        } 

        aclProperties[propertyId] = property
    }
    config.properties = aclProperties

    // Data
    const data = {}
    for (const [paramId, specifier] of Object.entries(config.dataSpecifiers || {})) {
        data[paramId] = {}
        const { entity, where, columns, order } = specifier
        const rows = await sql.execute({ context, type: "select", entity, columns, where, order, limit: null })
        for (const row of rows) data[paramId][row.id] = row
    }
    config.data = data

    // Tags
    const tags = await sql.execute({ context, type: "select", entity: "tag", columns: ["distinct_name"], where: { entity }, order: { name: "asc" }, limit: null })
    config.tags = tags

    // Translations
    if (config.translations) {
        if (config.translations[locale]) {
            config.translations = config.translations[locale]
        } else if (config.translations.default) {
            config.translations = config.translations.default
        }
    }
    
    return [200, config, "application/json"]
}

const resolveToken = (token) => {
    if (typeof token !== "string") return token

    const relativeMatch = /^today([+-]\d+)?$/.exec(token)
    if (relativeMatch) {
        const offset = relativeMatch[1] ? parseInt(relativeMatch[1], 10) : 0
        return moment().add(offset, "days").format("YYYY-MM-DD")
    }

    switch (token) {
    case "start_of_month": return moment().startOf("month").format("YYYY-MM-DD")
    case "start_of_year":  return moment().startOf("year").format("YYYY-MM-DD")
    case "end_of_month":   return moment().endOf("month").format("YYYY-MM-DD")
    case "end_of_year":    return moment().endOf("year").format("YYYY-MM-DD")
    default:               return token
    }
}

/**
 * Recursively resolves tokens in an object, excluding specified keys.
 * @param {Object} node - The object to process.
 * @param {Array} excludeKeys - Keys to exclude from token resolution.
 * @returns {Object} - The processed object with tokens resolved.
 */
const resolveTokensDeep = (node, excludeKeys = []) => {
    if (typeof node === "string") return resolveToken(node)

    if (Array.isArray(node)) {
        node.forEach((item, i) => { node[i] = resolveTokensDeep(item, excludeKeys) })
        return node
    }

    if (node && typeof node === "object") {
        for (const key of Object.keys(node)) {
            if (excludeKeys.includes(key)) continue
            node[key] = resolveTokensDeep(node[key], excludeKeys)
        }
        return node
    }

    return node
}

module.exports = action