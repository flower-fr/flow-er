const { getWhere } = require("./getWhere")
const { select } = require("../../../flCore/server/model/select")

const getList = async (db, context, entity, view, columns, properties, whereParam, orderParam, limit) => {

    const where = getWhere(properties, whereParam)
    if (!where) return [] // in the case of an empty result due to the selected tag -> No need to select in DB

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
    
    const model = context.config[`${entity}/model`]
    const rows = (await db.execute(select(context, entity, columns, where, order, limit, model)))[0]
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