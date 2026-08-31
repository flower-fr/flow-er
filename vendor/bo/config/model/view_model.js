module.exports = {
    "entities": {
        view_model: {
            table: "view_model"
        }
    },
    properties: {
        id: {
            entity: "view_model",
            column: "id",
            type: "primary"
        },
        action: {
            entity: "view_model",
            column: "action"
        },
        entity: {
            entity: "view_model",
            column: "entity"
        },
        view: {
            entity: "view_model",
            column: "view"
        },
        identifier: {
            column: "identifier",
            type: "CONCAT",
            components: ["action", "entity", "view"],
        },
        params: {
            entity: "view_model",
            column: "params",
            type: "json"
        },
    },
    audit: "audit"
}