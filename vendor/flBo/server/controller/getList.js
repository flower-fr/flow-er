const { select } = require("../../../flCore/server/model/select")

const getList = async (sql, context, entity, columns, properties, where, orderParam, limit, debug = false) => {

    const whereTags = {}
    for (const [key, value] of Object.entries(where)) {

        /**
         * Tags
         */
        const property = properties[key]
        if (property && property.type == "tag") {
            value = value.map((x) => { return parseInt(x) })
            const tags = {}
            for (let tagKey of Object.keys(property.tags)) {
                const tag = property.tags[tagKey]
                if (value.includes(tag.id)) {
                    tags[tag.id] = tag
                    const vectorId = property.vector
                    const ids = tag[vectorId]
                    const tagKey = (property.key) ? property.key : "id"
                    if (!whereTags[tagKey]) whereTags[tagKey] = {}
                    if (!whereTags[tagKey][key]) whereTags[tagKey][key] = []
                    for (let id of ids) {
                        whereTags[tagKey][key][id] = null
                    }
                }
            }
            property.tags = tags
        }
    }    

    for (let id of Object.keys(whereTags)) {
        const vectors = whereTags[id]
        const intersect = arrayIntersect(Object.values(vectors).map((x) => { return Object.keys(x) }))
        if (intersect.length == 0) return null // Means no select to do since the resulting vector has no ids
        where[id] = intersect
    }

    const orderTags = {}
    let order = null
    if (orderParam != null) {
        order = {}
        for (let orderer of orderParam.split(",")) {
            let propertyId, direction
            if (orderer[0] == "-") {
                propertyId = orderer.substr(1)
                direction = "DESC"
            }
            else {
                propertyId = orderer
                direction = "ASC"
            }
            if (!properties[propertyId] || properties[propertyId].type != "tag") order[propertyId] = direction    
            else orderTags[propertyId] = direction
        }    
    }
    
    // const model = context.config[`${entity}/model`]
    // const rows = (await db.execute(select(context, entity, columns, where, order, limit, model, debug)))[0]
    const rows = await sql.execute({ context, type: "select", entity, columns, where, order, limit, debug })
    if (rows.length > 0) {
        for (let propertyId of Object.keys(properties)) {
            const property = properties[propertyId]
            
            /**
             * Tags 
             */ 
            if (property.type == "tag") {

                const tagKey = property.key
                const dictRows = {}
                for (let row of rows) {
                    if (!dictRows[row[tagKey]]) dictRows[row[tagKey]] = []
                    dictRows[row[tagKey]].push(row)
                }
                
                const tags = property.tags
                for (let row of rows) row[propertyId] = []
                for (let tagId of Object.keys(tags)) {
                    const tag = tags[tagId]
                    tag.rowCache = []
                    const vectorId = (property.vector) ? property.vector : "vector"
                    const vector = tag[vectorId]
                    for (let rowKey of vector) {
                        if (dictRows[rowKey]) {
                            for (let row of dictRows[rowKey]) {
                                const keep = true
                                if (property.matching) {
                                    for (let tagProp of property.matching) {
                                        const dataProp = property.matching[tagProp]
                                        if (row[dataProp] != tag[tagProp]) keep = false
                                    }
                                }
                                if (keep) {
                                    const arguments = []
                                    for (let param of property.format[1].split(",")) {
                                        arguments.push(tag[param])
                                    }
                                    row[propertyId].push(/*vsprintf(*/property.format[0]/*, arguments)*/)
                                    if (orderTags[propertyId]) {
                                        tag.rowCache.push(row)
                                    }
                                }
                            }
                        }
                    }
                }
                for (let row of rows) {
                    if (Array.isArray(row[propertyId])) row[propertyId] = row[propertyId].join("<br>")
                }
                if (orderTags[propertyId]) {
                    const rows = []
                    const rowKeys = {}
                    for (let tag of tags) {
                        if (tag.rowCache) {
                            for (let row of tag.rowCache) {
                                if (!rowKeys[row.id]) {
                                    rowKeys[row.id] = true
                                    rows.push(row)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return rows
}

module.exports = {
    getList
}