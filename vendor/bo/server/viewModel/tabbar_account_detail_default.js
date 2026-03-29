module.exports = {
    menu: {
        detail: {
            controller: "core",
            action: "v1",
            params: {
                entity: "account",
            },
            query: {
                view: "default"
            },
            label: "Détail",
        },
        delete: {
            scheme: "DELETE",
            controller: "core",
            action: "v1",
            params: {
                entity: "account",
            },
            label: "Supprimer",
        },
    },
    defaultTab: "detail",
    translations: {},
}
