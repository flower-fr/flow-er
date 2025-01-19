const { qi, qv } = require("./quote")

const insert = (context, table, data, model) => {
    console.log(data)
    const pairs = {}
    for (let key of Object.keys(data)) {
        if (!["instance_id", "touched_at", "touched_by"].includes(key)) {
            let value = data[key]
            if (key != "visibility" || value != "deleted") {
                const type = (model.properties[key].type) ? model.properties[key].type : "text"
                if (!value) {
                    if (["foreign", "date", "datetime", "time"].includes(type)) value = "null"
                    else if (["int", "smallint", "tinyint", "float", "decimal"].includes(type)) value = 0
                    else if (["json"].includes(type)) value = "'[]'"
                    else value = "''"
                }
                else {
                    if (["date", "datetime", "time"].includes(type)) value = `'${value}'`
                    else if (type === "json") value = qv(JSON.stringify(value))
                    else if (type === "text") {
                        if (typeof value === "string") {
                            const maxLength = (model.properties[key].max_length) ? model.properties[key].max_length : 255
                            //value = value.replace(/(<([^>]+)>)/ig, '').substring(0, maxLength)
                            value = qv(value)    
                        }
                    }
                    else if (["mediumtext", "longtext"].includes(type)) value = qv(value)    
                }
                pairs[qi(key)] = value
            }
        }
    }
    if (model.properties.visibility) pairs[qi("visibility")] = qv("active")
    if (model.properties.creation_date) pairs[qi("creation_date")] = `'${new Date().toISOString().slice(0, 10)}'`
    if (model.properties.creation_month) pairs[qi("creation_month")] = `'${new Date().toISOString().slice(0, 7)}'`
    if (model.properties.creation_year) pairs[qi("creation_year")] = `'${new Date().toISOString().slice(0, 4)}'`
    pairs[qi("touched_at")] = `'${new Date().toISOString().slice(0, 19).replace("T", " ")}'`
    pairs[qi("touched_by")] = context.user.id
    
    return `INSERT INTO ${table} (${Object.keys(pairs).join(", ")})\n VALUES (${Object.values(pairs).join(", ")})\n`
}

module.exports = {
    insert
}