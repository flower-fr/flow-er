module.exports = {
    actions: {
        export: {
            type: "link",
            controller: "bo",
            action: "export",
            entity: "account",
            label: "Exporter",
            glyph: "fa-cloud-download-alt"
        },
        import: {
            controller: "bo",
            action: "import",
            entity: "account",
            label: "Importer",
            glyph: "fa-list"
        }
    },
    translations: {}
}
