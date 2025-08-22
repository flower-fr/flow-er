const { qi, qv } = require("./quote")

const updateCase = (context, table, column, pairs, model, debug = false) => {

    const type = (model && model.properties[column].type) ? model.properties[column].type : "text"

    let request = []
    request.push(`UPDATE ${table}`)
    request.push(`SET ${qi(column)} = CASE`)
    const ids = []
    for (let id of Object.keys(pairs)) {
        let value = pairs[id]
        if (["int", "tinyint"].includes(type) && !value) value = 0
        else if (["date", "datetime", "time"].includes(type)) {
            if (!value) value = "NULL"
            else value = `'${value}'`
        }
        else if (type == "json") value = qv(JSON.stringify(value))
        else if (type == "text") {
            const maxLength = (model && model.properties[column].max_length) ? model.properties[column].max_length : 255
            value = value.replace(/(<([^>]+)>)/ig, "").substring(0, maxLength)
            value = qv(value.trim())
        }
        else if (["longtext", "mediumtext"].includes(type)) value = qv(value.trim())
        else if (["longblob", "mediumblob"].includes(type)) value = "?"

        ids.push(id)
        request.push(`WHEN id = ${id} THEN ${value}`)
    }
    request.push("END,")
    const touched_at = `${new Date().toISOString().slice(0, 19).replace("T", " ")}`
    request.push(`touched_at = '${touched_at}',`)
    const user_id = context.user.id
    request.push(`touched_by = ${user_id}`)
    request.push(`WHERE id IN (${ids.join(",")})`)
    request = request.join("\n")
    if (debug) console.log(request)
    return request
}

module.exports = {
    updateCase
}