const { qi, qv } = require("./quote")

const dElete = (context, table, ids) => {
    const pairs = { visibility: "deleted" }

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
    dElete
}