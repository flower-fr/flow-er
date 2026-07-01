const { assert } = require("../../../core/api-utils")
const moment = require("moment")
const util = require("util")

const action = async ({ req }, { context, sql, logger }) => 
{
    const action = assert.notEmpty(req.params, "action")
    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view || "default"
    const locale = req.query.locale || "default"
    const config = context.config[`viewModel_${ action }_${ entity }_${ view }`]

    // Replace tokens in the where clauses with actual dates
    for (const value of Object.values(config ?? {})) {
        if (value?.where) {
            for (const [k, v] of Object.entries(value.where)) {
                if (Array.isArray(v)) {
                    value.where[k] = v.map(token => {
                        switch (token) {
                            case "today":          return moment().format("YYYY-MM-DD")
                            case "start_of_month": return moment().startOf("month").format("YYYY-MM-DD")
                            case "start_of_year":  return moment().startOf("year").format("YYYY-MM-DD")
                            default:               return token
                        }
                    })
                }
            }
        }
    }

    logger && logger.debug(util.inspect(config, { depth: null, colors: true }))

    // Title localization
    if (config?.title?.label?.[locale]) config.title.label = config.title.label[locale]
    else if (config?.title?.label?.["default"]) config.title.label = config.title.label["default"]

    for (const property of config.properties ? Object.values(config.properties) : []) {
        if (property.type == "vector") {
            const { entity, key, format, columns, where, order } = property
            const items = await sql.execute({ context, type: "select", entity, columns, where, order })
            property.modalities = {}
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
            }
        }

        // Localization

        if (property.label[locale]) property.label = property.label[locale]
        else if (property.label["default"]) property.label = property.label["default"]

        if (property.modalities) {
            for (const modality of Object.values(property.modalities)) {
                if (modality.label[locale]) modality.label = modality.label[locale]
                else if (modality.label["default"]) modality.label = modality.label["default"]
            }
        } 
    }

    // Tags
    const tags = await sql.execute({ context, type: "select", entity: "tag", columns: ["distinct_name"], where: { entity }, order: { name: "asc" }, limit: null })

    config.tags = tags

    return [200, config, "application/json"]
}

module.exports = action