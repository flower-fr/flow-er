const { assert } = require("../../../../core/api-utils")

const getDBConfig = async (context, model) => {
    const rows = (await model.db.execute(model.select(context, "config_property", ["entity", "property_id", "definition"], { "status": "active" }, null, null, context.config["config_property/model"])))[0]
    for (let row of rows) {
        const key = `${row.entity}/property/${row.property_id}`
        const value = JSON.parse(row.definition)
        context.config[key] = value
    }
}

module.exports = {
    getDBConfig
}