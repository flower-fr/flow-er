const fs = require("fs");

const describeAuditModel = () =>
{
    fs.writeFileSync("vendor/flCore/config/auditTest.json", JSON.stringify({
        "audit/model": {

            /** 
             * Entities
             */
            entities: {
                audit: { table: "audit" }
            },

            /**
             * Properties
             */
            properties: {
                id: { entity: "audit", column: "id", type: "primary" },
                entity: { entity: "audit", column: "entity" },
                row_id: { entity: "audit", column: "row_id", type: "int" },
                property: { entity: "audit", column: "property" },
                value: { entity: "audit", column: "value", type: "text" },
                previous_value: { entity: "audit", column: "previous_value", type: "text" },

                visibility: { entity: "audit", column: "visibility", audit: true },
                touched_at: { entity: "audit", column: "touched_at", type: "datetime" },
                touched_by: { entity: "audit", column: "touched_by", type: "int" }
            }
        }
    }))
}

module.exports = {
    describeAuditModel
}