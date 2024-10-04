const vsprintf = require("sprintf-js").vsprintf
const { getWhere } = require("./getWhere")
const { select } = require("../../../flCore/server/model/select")

const getDistribution = async (db, context, entity, view, column, properties, whereParam) => {

    const distribution = {}

    if (properties[column].type == "tag") {
        for (let tag of properties[column].tags) {
            const value = tag[properties[column].vector].length
            if (value) {
                distribution[tag.name] = { code: tag.name, value: value }
            }
        }        
    } 
    else {
        const where = getWhere(properties, whereParam)
        const model = context.config[`${entity}/model`]
        const rows = (where) ? (await db.execute(select(context, entity, ["id", column], where, null, null, model)))[0] : []
    
        let code
        
        for (let row of rows) {
            let values
            if  (typeof row[column] === "string") {
                values = row[column].split(",")
                for (let value of values) {
                    code = (row[column])
                    if (!distribution[value]) distribution[value] = { code: value, value: 0 }
                    distribution[value].value++    
                }
            }
            else values = row[column]
        }    
    }
 
    return distribution
}

module.exports = {
    getDistribution
}