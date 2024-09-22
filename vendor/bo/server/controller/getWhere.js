const arrayIntersect = (arrays) => {
    const result = {}
    for (let array of arrays) {
        for (let value of array) result[value] = null 
    }
    return Object.keys(result)
}

const getWhere = (properties, whereParam) => {

    const where = {}

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (property.options && property.options.restriction) {
            where[propertyId] = property.options.restriction
        }
    }    

    const whereTags = {}
    for (let param of whereParam) {
        const keyValue = param.split(":")
        const key = keyValue[0]
        let value = keyValue[1].split(",")

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
                    for (let id of ids) {
                        if (!whereTags[tagKey]) whereTags[tagKey] = {}
                        if (!whereTags[tagKey][key]) whereTags[tagKey][key] = []
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
        where[id] = arrayIntersect(Object.values(vectors).map((x) => { return Object.keys(x) }))
    }

    return where
}

module.exports = {
    getWhere
}