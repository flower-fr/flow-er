const Ddl = require("../../../utils/Ddl")

module.exports = class Tag extends Ddl {

    identifier = "tag"

    entities = {
        tag: { table: "tag" }
    }

    properties = {
        id: { entity: "tag", column: "id", type: "primary" },
        entity: { entity: "tag", column: "entity" },
        row_id: { entity: "tag", column: "row_id", type: "int" },
        name: { entity: "tag", column: "name" },
        distinct_name: { entity: "tag", column: "distinct_name", type: "DISTINCT", component: "name" },
    }
}
