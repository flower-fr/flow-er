const { qi, qv } = require("./quote")

const update = (context, entity, ids, data, model = [], debug = false) => {

    const table = (model.entities[entity]) ? model.entities[entity].table : entity

    const pairs = {}
    for (let key of Object.keys(data)) {
        if (!["instance_id", "touched_at", "touched_by"].includes(key)) {
            let value = data[key]
            if (key != "visibility" || value != "deleted") {
                const type = (model.properties[key].type) ? model.properties[key].type : "text"
    
                if (["int", "tinyint"].includes(type) && !value) value = 0
                else if (["date", "datetime", "time"].includes(type)) {
                    if (!value) value = "NULL"
                    else value = `'${value}'`
                }
                else if (type == "json") value = qv(JSON.stringify(value))
                else if (type == "text") {
                    const maxLength = (model.properties[key].max_length) ? model.properties[key].max_length : 255
                    value = value.replace(/(<([^>]+)>)/ig, '').substring(0, maxLength)
                    value = qv(value.trim())
                }
                else if (["longtext", "mediumtext"].includes(type)) value = qv(value.trim())
                else if (["longblob", "mediumblob"].includes(type)) value = "?"
        
                pairs[qi(key)] = value    
            }
        }
    }

    pairs[qi("touched_at")] = `'${new Date().toISOString().slice(0, 19).replace("T", " ")}'`
    pairs[qi("touched_by")] = context.user.id

    let request = ""
    request += `UPDATE ${table} SET\n`
    const sets = []
    for (let key of Object.keys(pairs)) {
        const value = pairs[key]
        sets.push(`${key} = ${value}`)
    }
    request += sets.join(",\n") + "\n"
    
    request += `WHERE id IN (${ids.join(", ")})\n`
    if (model.properties.visibility) request += "AND visibility != 'deleted'\n"
    if (debug) console.log(request)
    return request
}

module.exports = {
    update
}