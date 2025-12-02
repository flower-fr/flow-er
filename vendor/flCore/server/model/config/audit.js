const { Model } = require("./Model")

class Audit extends Model {

    identifier = "audit"

    entities = {
        audit: { table: "audit" }

        // Foreign entities
    }

    properties = {
        id: { entity: "audit", column: "id", type: "primary" },
        entity: { entity: "audit", column: "entity" },
        row_id: { entity: "audit", column: "row_id", type: "int" },
        property: { entity: "audit", column: "property" },
        value: { entity: "audit", column: "value", type: "text" },
        previous_value: { entity: "audit", column: "previous_value", type: "text" },
    }
}

module.exports = {
    Audit
}