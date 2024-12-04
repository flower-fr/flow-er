const { select } = require("../../../flCore/server/model/select")

const getProperties = async (db, context, entity, view, propertyDefs, where) => {
    const properties = {}, propertyList = Object.keys(propertyDefs)
    
    for (let propertyId of propertyList) {
        const options = propertyDefs[propertyId]
        let property
        if (context.config[`${entity}/property/${propertyId}`]) {
            property = { ...context.config[`${entity}/property/${propertyId}`] }
            if (property.definition != "inline") property = { ...context.config[property.definition] }    
        }
        else property = {}
        if (options) {
            if (options.type) property.type = options.type
            if (options.labels) property.labels = options.labels    
        }

        // Restriction on property data vs where query param
        if (property.data) {
            const modalities = {}
            for (let modalityId of Object.keys(property.data)) {
                let keep = true
                for (let key of Object.keys(where)) {
                    const value = where[key].split(",")
                    if (property.data[modalityId][key]) {
                        if (!value.includes(property.data[modalityId][key])) keep = false
                    }
                }
                if (keep) modalities[modalityId] = property.modalities[modalityId]
            }
            console.log(modalities)
            property.modalities = modalities
        }

        /**
         * Tags
         */
        if (["tag", "source"].includes(property.type)) {
            let filters = (property.where) ? property.where : ""
            filters = (filters) ? filters.split("|") : []
            filters = filters.map((x) => { return x.split(":") })
            const where = {}
            for (let filter of filters) {
                let value = context.config[filter[1]]
                if (!value) value = filter[1] 
                value = value.split(",")
                where[filter[0]] = value
            }
            const tagColumns = (property.format[1]) ? property.format[1].split(",") : []
            tagColumns.push("id")
            if (property.type == "tag") tagColumns.push(property.vector)
            let order = {}
            if (property.order[0] == "-") order[property.order.substr(1)] = "DESC" 
            else order[property.order] = "ASC"
            const rows = (await db.execute(select(context, property.entity, tagColumns, where, order, null, context.config[`${property.entity}/model`])))[0]
            const modalities = []
            for (let row of rows) {
                const vector = (row[property.vector]) ? row[property.vector].split(",") : []
                row[property.vector] = vector.map((x) => { return parseInt(x) })
                modalities.push(row)
            }
            if (property.type == "tag") property.tags = modalities
            else property.modalities = modalities
        }
        properties[propertyId] = property
        properties[propertyId].options = options
    }
    return properties
}

module.exports = {
    getProperties
}