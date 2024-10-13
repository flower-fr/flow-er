const arrayIntersect = (arrays) => {
    const result = {}
    for (let array of arrays) {
        for (let value of array) result[value] = null 
    }
    return Object.keys(result)
}

const getWhere = (properties, whereParam) => {

    const where = {}

    const whereTags = {}
    for (let key of Object.keys(whereParam)) {
        let value = whereParam[key].split(",")

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
        else where[key] = value
    }    

    for (let id of Object.keys(whereTags)) {
        const vectors = whereTags[id]
        const intersect = arrayIntersect(Object.values(vectors).map((x) => { return Object.keys(x) }))
        if (intersect.length == 0) return null // Means no select to do since the resulting vector has no ids
        where[id] = intersect
    }
    
    return where
}

module.exports = {
    getWhere
}