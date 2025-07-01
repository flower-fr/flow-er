const { assert } = require("../../../../core/api-utils")
const { getProperties } = require("../../../flBo/server/controller/getProperties")

const { select } = require("../../../flCore/server/model/select")

const csr = async ({ req }, context, config, db) => {
    const entity = assert.notEmpty(req.params, "entity")
    const view = (req.query.view) ? req.query.view : "default"
    const user = { locale: "fr-FR" }
    const formConfig = context.config[`${entity}/form/${view}`]
    const propertyDefs = formConfig.properties
    const properties = await getProperties(db, context, entity, view, propertyDefs, [])

    let where = (req.query.where) ? req.query.where : null
    where = (where != null) ? where.split("|") : []
    where = where.map((x) => x.split(":"))
    where = Object.assign({}, ...where.map((x) => ({[x[0]]: x[1]})))

    /**
     * Data source
     */
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (property.type === "source") {
            let filters = property.where
            filters = (filters) ? filters.split("|") : []
            filters = filters.map((x) => { return x.split(":") })
            const sourceEntity = property.entity
            const sourceWhere = {}
            for (let filter of filters) {
                let value = context.config[filter[1]] // Value set in config
                if (!value) {
                    if (filter[1][0] === "?") { // Value set in query
                        const key = filter[1].substr(1)
                        if (where[key]) value = where[key]
                        else value = []
                    }
                    else {
                        value = filter[1]
                        value = (value) ? value.split(",") : []
                    }
                }
                if (value.length !== 0) sourceWhere[filter[0]] = value
            }
            const sourceColumns = ["id"]
            for (let columnId of property.format[1].split(",")) sourceColumns.push(columnId)
            
            const modalities = (await db.execute(select(context, sourceEntity, sourceColumns, sourceWhere, null, null, context.config[`${property.entity}/model`])))[0]
            property.modalities = {}
            for (let modality of modalities) {
                const args = []
                for (let param of property.format[1].split(",")) {
                    args.push(modality[param])
                }
                const label = []
                const format = property.format[0].split("%s")
                for (let i = 0; i < format.length; i++) {
                    label.push(format[i])
                    if (args[i]) label.push(args[i])                    
                }
                property.modalities[modality.id] = label.join("")
            }
        }
    }

    return { context, entity, view }, { user: user, recaptchaToken: config.recaptchaToken, formConfig, where, properties }
}

module.exports = {
    csr
}