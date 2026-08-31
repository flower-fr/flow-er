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
        identifier: {
            column: "identifier",
            type: "CONCAT",
            components: ["entity", "view", "profile_id"]
        },
        status: {
            entity: "guided_action",
            column: "status"
        },
    },
    audit: "audit"
}