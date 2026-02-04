const moment = require("moment")
const { qi, qv } = require("./quote")

const dElete = (context, table, ids, debug = false) => {
    const pairs = { visibility: qv("deleted") }

    pairs[qi("touched_at")] = `'${moment().format("YYYY-MM-DD HH:mm:ss")}'`
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
    request += "AND visibility != 'deleted'\n"
    if (debug) console.log(request)
    return request
}

module.exports = {
    dElete
}