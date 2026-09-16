module.exports = {
    "entities": {
        guided_action: {
            table: "guided_action"
        }
    },
    properties: {
        id: {
            entity: "guided_action",
            column: "id",
            type: "primary"
        },
        entity: {
            entity: "guided_action",
            column: "entity"
        },
        view: {
            entity: "guided_action",
            column: "view"
        },
        profile_id: {
            entity: "guided_action",
            column: "profile_id",
            type: "integer"
        },
        validity_date: {
            entity: "guided_action",
            type: "date",
            column: "validity_date"
        },
        identifier: {
            column: "identifier",
            type: "CONCAT",
            components: ["entity", "view", "profile_id", "validity_date"]
        },
        status: {
            entity: "guided_action",
            column: "status"
        },
        where_ids: {
            entity: "guided_action",
            column: "where_ids"
        },
    },
    audit: "audit"
}