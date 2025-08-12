const { ddlEntity } = require("./ddl")
const { loadAll } = require("./load")

const modelRelease = (context, module, release) => {
    const config = context.config[`${module}/model/releases`][release]
    let ddl = []
    for (const entity of config.entities) {
        ddl = ddl.concat(ddlEntity(context, entity))
        ddl = ddl.concat(loadAll(context, entity))
    }
    for (const pair of config.properties) {
        const [entity, property] = pair.split("/")
        ddl = ddl.concat(ddlEntity(context, entity, property))
    }
    return ddl
}

module.exports = {
    modelRelease
}