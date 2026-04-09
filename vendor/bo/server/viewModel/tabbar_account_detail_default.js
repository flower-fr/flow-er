module.exports = {
    menu: {
        detail: {
            controller: "bo",
            action: "card",
            params: {
                entity: "account",
                id: "id",
            },
            query: {
                view: "default",
            },
            label: "Détail",
        },
        delete: {
            controller: "bo",
            action: "delete",
            params: {
                entity: "account",
            },
            query: {
                view: "default",
            },
            label: "Supprimer",
        },
    },
    defaultTab: "detail",
    translations: {},
}
