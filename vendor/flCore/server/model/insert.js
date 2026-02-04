const moment = require("moment")

const { qi, qv } = require("./quote")

const { encrypt } = require("./sql-client/encrypt")

const insert = (context, entity, data, model, debug = false) => {

    const table = (model.entities[entity]) ? model.entities[entity].table : entity

    const pairs = {}
    for (let key of Object.keys(data)) {
        if (!["instance_id"/*, "touched_at"*/, "touched_by"].includes(key)) {
            let value = data[key]
            if (key != "visibility" || value != "deleted") {
                const type = (model.properties[key].type) ? model.properties[key].type : "text"
                if (["longblob", "mediumblob"].includes(type)) value = "?"
                else if (!value) {
                    if (["foreign", "date", "datetime", "time"].includes(type)) value = "null"
                    else if (["int", "smallint", "tinyint", "float", "decimal"].includes(type)) value = 0
                    else if (["json"].includes(type)) value = "'[]'"
                    else value = "''"
                }
                else {

                    // Hash
                    if (model.properties[key].hash && value) {
                        pairs[qi(model.properties[key].hash)] = qv(encrypt(context, value))
                    }

                    if (["date", "datetime", "time"].includes(type)) value = `'${value}'`
                    else if (type === "json") value = qv(JSON.stringify(value))
                    else if (type === "text") {
                        if (typeof value === "string") {
                            const maxLength = (model.properties[key].max_length) ? model.properties[key].max_length : 255
                            value = value.substring(0, maxLength) // Protect against string overflow
                            value = qv(value.trim()) 
                        }
                    }
                    else if (["mediumtext", "longtext"].includes(type)) value = qv(value.trim())    
                }

                pairs[qi(key)] = value
            }
        }
    }
    if (model.properties.visibility) pairs[qi("visibility")] = qv("active")
    
    // Deprecated
    if (model.properties.creation_date) pairs[qi("creation_date")] = `'${new Date().toISOString().slice(0, 10)}'`
    if (model.properties.creation_month) pairs[qi("creation_month")] = `'${new Date().toISOString().slice(0, 7)}'`
    if (model.properties.creation_year) pairs[qi("creation_year")] = `'${new Date().toISOString().slice(0, 4)}'`
    
    if (!pairs[qi("touched_at")]) pairs[qi("touched_at")] = `'${moment().format("YYYY-MM-DD HH:mm:ss")}'`
    pairs[qi("touched_by")] = context.user.id

    const request = `INSERT INTO ${table} (${Object.keys(pairs).join(", ")})\n VALUES (${Object.values(pairs).join(", ")})\n`
    if (debug) console.log(request)
    return request
}

module.exports = {
    insert
}