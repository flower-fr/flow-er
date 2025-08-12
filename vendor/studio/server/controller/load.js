const moment = require("moment")

const loadAll = (context, entity) => {
    const model = context.config[`${entity}/model`]
    const result = []
    if (model.initialRows) {
        result.push("\n")
        for (const row of Object.values(model.initialRows)) {
            row["`visibility`"] = "active"
            row["`touched_at`"] = moment().format("YYYY-MM-DD HH:mm:ss")
            row["`touched_by`"] = context.user.id
            result.push(`INSERT INTO \`${ model.entities[entity].table }\` (${Object.keys(row).join(", ")})\n VALUES (${Object.values(row).map( x => `'${x}'`).join(", ")});\n`)
        }    
    }
    return result
}

module.exports = {
    loadAll
}