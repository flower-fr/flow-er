const { qi, qv } = require("./quote")

const update = (context, table, ids, data, model = []) => {
    const pairs = {}
    for (let key of Object.keys(data)) {
        if (!["instance_id", "touched_at", "touched_by"].includes(key)) {
            let value = data[key]
            if (key != "visibility" || value != "deleted") {
                const type = (model.properties[key].type) ? model.properties[key].type : "text"
    
                if (["date", "datetime"].includes(type)) value = `'${value}'`
                else if (type == "json") value = qv(JSON.stringify(value))
                else if (type == "text") {
                    const maxLength = (model.properties[key].max_length) ? model.properties[key].max_length : 255
                    value = value.replace(/(<([^>]+)>)/ig, '').substring(0, maxLength)
                    value = qv(value)
                }
                else if (type == "longtext") value = qv(value)
        
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
    
    return request
}

module.exports = {
    update
}