const { assert } = require("../../../core/api-utils")

const action = async ({ req }, { context, sql, logger }) => 
{
    const action = assert.notEmpty(req.params, "action")
    const entity = assert.notEmpty(req.params, "entity")
    const view = req.query.view || "default"
    const locale = req.query.locale || "default"
    const config = context.config[`viewModel_${ action }_${ entity }_${ view }`]

    for (const property of config.properties ? Object.values(config.properties) : []) {
        if (property.type == "vector") {
            const { entity, key, format, columns, where, order } = property
            const items = await sql.execute({ context, type: "select", entity, columns, where, order, debug: true })
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
console.log(modality)
                if (modality.label[locale]) modality.label = modality.label[locale]
                else if (modality.label["default"]) modality.label = modality.label["default"]
            }
        } 
    }

    return [200, config, "application/json"]
}

module.exports = action