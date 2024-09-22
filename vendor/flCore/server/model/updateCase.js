const { qv } = require("./quote")

const updateCase = (context, table, column, pairs, model) => {

    const type = (model && model.properties[column].type) ? model.properties[column].type : "text"

    const request = []
    request.push(`UPDATE ${table}`)
    request.push(`SET ${column} = CASE`)
    const ids = []
    for (let id of Object.keys(pairs)) {
        let value = pairs[id]
        if (column != "visibility" || value != "deleted") {
            if (typeof(value) == "string") value = qv(value.replace(/(<([^>]+)>)/ig, ''))
            else if (type == "json") value = qv(JSON.stringify(value))
            ids.push(id)
            request.push(`WHEN id = ${id} THEN ${value}`)
        }
    }
    request.push("END,")
    const touched_at = `${new Date().toISOString().slice(0, 19).replace("T", " ")}`
    request.push(`touched_at = '${touched_at}',`)
    const user_id = context.user.id
    request.push(`touched_by = ${user_id}`)
    request.push(`WHERE id IN (${ids.join(",")})`)
    return request.join("\n")
}

module.exports = {
    updateCase
}